import { BrowserContext, test } from '@playwright/test';
import { expect, metamaskSetUp } from 'utils/setup';
import { resetState } from '@synthetixio/synpress/commands/synpress';
import * as metamask from '@synthetixio/synpress/commands/metamask';
import * as tenderly from 'utils/tenderly';
import { setup } from 'utils/setup';
import { extremelyLongTestTimeout, longTestTimeout } from 'utils/config';
import { App } from 'src/app';

let context: BrowserContext;
let app: App;
let forkId: string;
let walletAddress: string;

test.describe.configure({ mode: 'serial' });

test.describe('Morpho Blue Borrow - Wallet connected', async () => {
	test.afterAll(async () => {
		await tenderly.deleteFork(forkId);

		await app.page.close();

		await context.close();

		await resetState();
	});

	test('It should allow to simulate a Morpho Blue Borrow position before opening it @regression', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: 'xxxxxx',
		});

		test.setTimeout(extremelyLongTestTimeout);

		await test.step('Test setup', async () => {
			({ context } = await metamaskSetUp({ network: 'mainnet' }));
			let page = await context.newPage();
			app = new App(page);

			({ forkId, walletAddress } = await setup({ app, network: 'mainnet' }));

			await tenderly.setTokenBalance({
				forkId,
				network: 'mainnet',
				walletAddress,
				token: 'WSTETH',
				balance: '10',
			});
		});

		await app.page.goto('/ethereum/morphoblue/borrow/WSTETH-ETH#setup');

		await app.position.setup.deposit({ token: 'WSTETH', amount: '10.12345' });

		await app.position.overview.shouldHaveCollateralDepositedAfterPill('10.12 WSTETH');
		await app.position.overview.shouldHaveNetValueAfterPill('\\$[0-9]{1,2},[0-9]{3}.[0-9]{2}');
		// !!! BUG: vailableToWithdrawAfterPill showing 0.00 at the moment
		// await app.position.overview.shouldHaveAvailableToWithdrawAfterPill({
		// 	amount: '10.12',
		// 	token: 'WSTETH',
		// });
		await app.position.overview.shouldHaveAvailableToBorrowAfterPill({
			amount: '[0-9]{1,2}.[0-9]{2}',
			token: 'ETH',
		});

		await app.position.setup.shouldHaveMaxBorrowingAmount({
			token: 'ETH',
			amount: '[0-9]{1,2}.[0-9]{2}',
		});
		await app.position.setup.orderInformation.shouldHaveCollateralLocked({
			token: 'WSTETH',
			current: '0.00',
			future: '10.12',
		});
		await app.position.setup.orderInformation.shouldHaveMaxLTV({
			current: '[0-9]{2,3}.[0-9]{2}',
			future: '[0-9]{2,3}.[0-9]{2}',
		});
		// !!! BUG: vailableToWithdrawAfterPill showing 0.00 at the moment
		// await app.position.setup.orderInformation.shouldHaveAvailableToWithdraw({
		// 	token: 'WSTETH',
		// 	current: '0.00',
		// 	future: '10.12',
		// });
		await app.position.setup.orderInformation.shouldHaveAvailableToBorrow({
			token: 'ETH',
			current: '0.00',
			future: '[0-9]{1,2}.[0-9]{2}',
		});

		await app.position.setup.borrow({ token: 'ETH', amount: '8.12345' });

		await app.position.overview.shouldHaveLiquidationPriceAfterPill('[0-1].[0-9]{3,4} WSTETH/ETH');
		await app.position.overview.shouldHaveLoanToValueAfterPill('[4-9][0-9].[0-9]{1,2}%');
		await app.position.overview.shouldHaveDebtAfterPill({
			amount: '8.1234',
			token: 'ETH',
		});
		await app.position.overview.shouldHaveNetValueAfterPill('\\$[0-9]{1,2},[0-9]{3}.[0-9]{2}');
		await app.position.overview.shouldHaveAvailableToWithdrawAfterPill({
			amount: '[0-1].[0-9]{3,4}',
			token: 'WSTETH',
		});
		await app.position.overview.shouldHaveAvailableToBorrowAfterPill({
			amount: '[0-4].[0-9]{3,4}',
			token: 'ETH',
		});

		await app.position.orderInformation.shouldHaveLiquidationPrice({
			pair: 'WSTETH/ETH',
			current: '0.00',
			future: '[0-2].[0-9]{3,4}',
		});
		await app.position.orderInformation.shouldHaveLTV({
			protocol: 'Morpho Blue',
			current: '0.00',
			future: '[1-9][0-9].[0-9]{2}',
		});
		await app.position.setup.orderInformation.shouldHaveMaxLTV({
			current: '[0-9]{2,3}.[0-9]{2}',
			future: '[0-9]{2,3}.[0-9]{2}',
		});
		await app.position.setup.orderInformation.shouldHaveDebt({
			token: 'ETH',
			current: '0.00',
			future: '8.[0-9]{3,4}',
		});
		await app.position.setup.orderInformation.shouldHaveAvailableToWithdraw({
			token: 'WSTETH',
			current: '0.00',
			future: '[0-5].[0-9]{3,4}',
		});
		await app.position.setup.orderInformation.shouldHaveAvailableToBorrow({
			token: 'ETH',
			current: '0.00',
			future: '[0-5].[0-9]{3,4}',
		});
	});

	test('It should open a Morpho Blue Borrow position @regression', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: 'xxx',
		});

		test.setTimeout(extremelyLongTestTimeout);

		await app.page.goto('ethereum/morphoblue/borrow/WSTETH-USDC#setup');
		await app.position.setup.deposit({ token: 'WSTETH', amount: '10' });
		await app.position.setup.borrow({ token: 'USDC', amount: '8000.12' });

		await app.position.setup.createSmartDeFiAccount();

		// Smart DeFi Acount creation randomly fails - Retry until it's created.
		await expect(async () => {
			await app.position.setup.createSmartDeFiAccount();
			await test.step('Metamask: ConfirmAddToken', async () => {
				await metamask.confirmAddToken();
			});
			await app.position.setup.continueShouldBeVisible();
		}).toPass({ timeout: longTestTimeout });

		await app.position.setup.continue();

		// Setting up allowance  randomly fails - Retry until it's set.
		await expect(async () => {
			await app.position.setup.approveAllowance();
			await test.step('Metamask: ConfirmAddToken', async () => {
				await metamask.confirmAddToken();
			});
			await app.position.setup.continueShouldBeVisible();
		}).toPass({ timeout: longTestTimeout });

		await app.position.setup.continue();

		// Position creation randomly fails - Retry until it's created.
		await expect(async () => {
			await app.position.setup.confirmOrRetry();
			await test.step('Metamask: ConfirmPermissionToSpend', async () => {
				await metamask.confirmPermissionToSpend();
			});
			await app.position.setup.goToPositionShouldBeVisible();
		}).toPass({ timeout: longTestTimeout });

		// !!!! BUG: Position is created but UI gets stuck
		// await app.position.setup.goToPosition();
		// await app.position.setup.continue();
		// await app.position.manage.shouldBeVisible('Manage your XXX Borrow Position');
	});
});
