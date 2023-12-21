import { BrowserContext, test } from '@playwright/test';
import { expect, metamaskSetUp, setupNewFork } from 'utils/setup';
import { resetState } from '@synthetixio/synpress/commands/synpress';
import * as metamask from '@synthetixio/synpress/commands/metamask';
import * as tenderly from 'utils/tenderly';
import { setup } from 'utils/setup';
import {
	extremelyLongTestTimeout,
	longTestTimeout,
	positionTimeout,
	veryLongTestTimeout,
} from 'utils/config';
import { App } from 'src/app';

let context: BrowserContext;
let app: App;
let forkId: string;
let walletAddress: string;

test.describe.configure({ mode: 'serial' });

test.describe('Aave v3 Multiply - Ethereum - Wallet connected', async () => {
	test.afterAll(async () => {
		await tenderly.deleteFork(forkId);

		await app.page.close();

		await context.close();

		await resetState();
	});

	test('It should Deposit and Borrow in a single tx on an existing Aave V3 Multiply Ethereum position @regression', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: '13664',
		});

		test.setTimeout(extremelyLongTestTimeout);

		await test.step('Test setup', async () => {
			({ context } = await metamaskSetUp({ network: 'mainnet' }));
			let page = await context.newPage();
			app = new App(page);

			({ forkId, walletAddress } = await setup({ app, network: 'mainnet' }));
			await tenderly.setRethBalance({ forkId, walletAddress, rEthBalance: '100' });
		});

		await tenderly.changeAccountOwner({
			account: '0x6bb713b56e73a115164b4b56ea1f5a76640c4d19',
			newOwner: walletAddress,
			forkId,
		});

		await app.page.goto('/ethereum/aave/v3/1276#overview');
		// Wait for all position data to be loaded
		await app.position.shouldHaveTab('Protection ON');

		await app.position.manage.openManageOptions({ currentLabel: 'Adjust' });
		await app.position.manage.select('Manage collateral');
		await app.position.manage.deposit({ token: 'RETH', amount: '50' });
		await app.position.manage.borrow({ token: 'DAI', amount: '40000' });

		// Setting up allowance  randomly fails - Retry until it's set.
		await expect(async () => {
			await app.position.setup.setupAllowance();
			await app.position.setup.approveAllowance();
			await test.step('Metamask: ConfirmAddToken', async () => {
				await metamask.confirmAddToken({});
			});
			await app.position.setup.continueShouldBeVisible();
		}).toPass({ timeout: longTestTimeout });
		await app.position.setup.continue();

		// Confirm action randomly fails - Retry until it's applied.
		await expect(async () => {
			await app.position.setup.confirmOrRetry();
			await test.step('Metamask: ConfirmPermissionToSpend', async () => {
				await metamask.confirmPermissionToSpend();
			});
			await app.position.manage.shouldShowSuccessScreen();
		}).toPass({ timeout: veryLongTestTimeout });

		await app.position.manage.ok();

		await app.position.overview.shouldHaveExposure({
			amount: '50.[0-9]{5}',
			token: 'RETH',
			timeout: positionTimeout,
		});
		await app.position.overview.shouldHaveDebt({ amount: '40,[0-9]{3}.[0-9]{4}', token: 'DAI' });
	});

	test('It should Withdraw and Pay back in a single tx on an existing Aave V3 Multiply Ethereum position @regression', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: '13665',
		});

		test.setTimeout(veryLongTestTimeout);

		await app.position.manage.shouldBeVisible('Manage Multiply position');
		await app.position.overview.shouldHaveExposure({ amount: '50.[0-9]{5}', token: 'RETH' });
		await app.position.overview.shouldHaveDebt({ amount: '40,[0-9]{3}.[0-9]{4}', token: 'DAI' });

		await app.position.manage.openManageOptions({ currentLabel: 'Adjust' });
		await app.position.manage.select('Manage collateral');
		await app.position.manage.withdrawCollateral();
		await app.position.manage.withdraw({ token: 'RETH', amount: '8' });
		await app.position.manage.payback({ token: 'DAI', amount: '10000' });
		// Setting up allowance  randomly fails - Retry until it's set.
		await expect(async () => {
			await app.position.setup.setupAllowance();
			await app.position.setup.approveAllowance();
			await test.step('Metamask: ConfirmAddToken', async () => {
				await metamask.confirmAddToken({});
			});
			await app.position.setup.continueShouldBeVisible();
		}).toPass({ timeout: longTestTimeout });
		await app.position.setup.continue();

		// Confirm action randomly fails - Retry until it's applied.
		await expect(async () => {
			await app.position.setup.confirmOrRetry();
			await test.step('Metamask: ConfirmPermissionToSpend', async () => {
				await metamask.confirmPermissionToSpend();
			});
			await app.position.manage.shouldShowSuccessScreen();
		}).toPass({ timeout: longTestTimeout });

		await app.position.manage.ok();

		await app.position.overview.shouldHaveExposure({
			amount: '4[1-2].[0-9]{5}',
			token: 'RETH',
			timeout: positionTimeout,
		});
		await app.position.overview.shouldHaveDebt({ amount: '30,[0-9]{3}.[0-9]{4}', token: 'DAI' });
	});

	test('It should Borrow and Deposit in a single tx on an existing Aave V3 Multiply Ethereum position @regression', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: '13666',
		});

		test.setTimeout(veryLongTestTimeout);

		await app.position.manage.shouldBeVisible('Manage Multiply position');
		await app.position.overview.shouldHaveExposure({ amount: '4[1-2].[0-9]{5}', token: 'RETH' });
		await app.position.overview.shouldHaveDebt({ amount: '30,[0-9]{3}.[0-9]{4}', token: 'DAI' });

		await app.position.manage.openManageOptions({ currentLabel: 'Adjust' });
		await app.position.manage.select('Manage debt');
		await app.position.manage.borrow({ token: 'DAI', amount: '20000' });
		await app.position.manage.deposit({ token: 'RETH', amount: '15' });

		// Confirm action randomly fails - Retry until it's applied.
		await expect(async () => {
			await app.position.setup.confirmOrRetry();
			await test.step('Metamask: ConfirmPermissionToSpend', async () => {
				await metamask.confirmPermissionToSpend();
			});
			await app.position.manage.shouldShowSuccessScreen();
		}).toPass({ timeout: longTestTimeout });

		await app.position.manage.ok();

		await app.position.overview.shouldHaveExposure({
			amount: '5[6-7].[0-9]{5}',
			token: 'RETH',
			timeout: positionTimeout,
		});
		await app.position.overview.shouldHaveDebt({ amount: '50,[0-9]{3}.[0-9]{4}', token: 'DAI' });
	});

	test('It should Pay back and Withdraw in a single tx on an existing Aave V3 Multiply Ethereum position @regression', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: '13667',
		});

		test.setTimeout(veryLongTestTimeout);

		await app.position.manage.shouldBeVisible('Manage Multiply position');
		await app.position.overview.shouldHaveExposure({ amount: '5[6-7].[0-9]{5}', token: 'RETH' });
		await app.position.overview.shouldHaveDebt({ amount: '50,[0-9]{3}.[0-9]{4}', token: 'DAI' });

		await app.position.manage.openManageOptions({ currentLabel: 'Adjust' });
		await app.position.manage.select('Manage debt');
		await app.position.manage.payBackDebt();
		await app.position.manage.payback({ token: 'DAI', amount: '42000' });
		await app.position.manage.withdraw({ token: 'RETH', amount: '30' });

		// Confirm action randomly fails - Retry until it's applied.
		await expect(async () => {
			await app.position.setup.confirmOrRetry();
			await test.step('Metamask: ConfirmPermissionToSpend', async () => {
				await metamask.confirmPermissionToSpend();
			});
			await app.position.manage.shouldShowSuccessScreen();
		}).toPass({ timeout: longTestTimeout });

		await app.position.manage.ok();

		await app.position.overview.shouldHaveExposure({
			amount: '2[6-7].[0-9]{5}',
			token: 'RETH',
			timeout: positionTimeout,
		});
		await app.position.overview.shouldHaveDebt({ amount: '8,[0-9]{3}.[0-9]{4}', token: 'DAI' });
	});
});
