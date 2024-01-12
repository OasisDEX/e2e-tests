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

test.describe('Ajna Ethereum Borrow - Wallet connected', async () => {
	test.afterAll(async () => {
		await tenderly.deleteFork(forkId);

		await app.page.close();

		await context.close();

		await resetState();
	});

	test('It should allow to simulate an Ajna Ethereum Borrow position before opening it @regression', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: '12732',
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

		await app.page.goto('/ethereum/ajna/borrow/WBTC-USDC#setup');

		await app.position.setup.acknowlegeAjnaInfo();
		await app.position.setup.deposit({ token: 'WBTC', amount: '0.12345' });

		await app.position.overview.shouldHaveCollateralDepositedAfterPill('0.1234 WBTC');
		await app.position.overview.shouldHaveNetValueAfterPill('\\$[0-9]{1,2},[0-9]{3}.[0-9]{2}');
		await app.position.overview.shouldHaveAvailableToWithdraw({
			amount: '0.1234',
			token: 'WBTC',
		});
		await app.position.overview.shouldHaveAvailableToBorrow({
			amount: '[0-9]{1,2},[0-9]{3}.[0-9]{2}',
			token: 'USDC',
		});

		await app.position.setup.shouldHaveMinBorrowingAmount({
			token: 'USDC',
			amount: '[0-9]{1,2},[0-9]{3}.[0-9]{2}',
		});
		await app.position.setup.orderInformation.shouldHaveCollateralLocked({
			token: 'WBTC',
			current: '0.00',
			future: '0.1234',
		});
		await app.position.setup.orderInformation.shouldHaveMaxLTV({
			current: '[0-9]{1,2}.[0-9]{2}',
			future: '[0-9]{1,2}.[0-9]{2}',
		});
		await app.position.setup.orderInformation.shouldHaveAvailableToWithdraw({
			token: 'WBTC',
			current: '0.00',
			future: '0.1234',
		});
		await app.position.setup.orderInformation.shouldHaveAvailableToBorrow({
			token: 'USDC',
			current: '0.00',
			future: '[0-9]{1,2},[0-9]{3}.[0-9]{2}',
		});

		await app.position.setup.borrow({ token: 'USDC', amount: '2000.12' });

		await app.position.overview.shouldHaveLiquidationPriceAfterPill(
			'[0-9]{1,2},[0-9]{3}.[0-9]{2} WBTC/USDC'
		);
		await app.position.overview.shouldHaveLoanToValueAfterPill('[1-9][0-9].[0-9]{2}%');
		await app.position.overview.shouldHaveDebtAfterPill({
			protocol: 'Ajna',
			amount: '2,000.12',
			token: 'USDC',
		});
		await app.position.overview.shouldHaveAvailableToWithdraw({
			amount: '0.0[0-9]{3}',
			token: 'WBTC',
		});
		await app.position.overview.shouldHaveAvailableToBorrow({
			amount: '[1-9],[0-9]{3}.[0-9]{2}',
			token: 'USDC',
		});
		await app.position.setup.shouldHaveOriginationFee({
			token: 'USDC',
			tokenAmount: '[0-9].[0-9]{4}',
			dollarsAmount: '[0-9]{1,2}(.[0-9]{1,2})?',
		});
		await app.position.orderInformation.shouldHaveLiquidationPrice({
			pair: 'WBTC/USDC',
			current: '0.00',
			future: '[0-9]{1,2},[0-9]{3}.[0-9]{1,2}',
		});
		await app.position.orderInformation.shouldHaveLTV({
			protocol: 'Ajna',
			current: '0.00',
			future: '[1-9][0-9].[0-9]{2}',
		});
		await app.position.setup.orderInformation.shouldHaveMaxLTV({
			current: '[2-9][0-9].[0-9]{2}',
			future: '[2-9][0-9].[0-9]{2}',
		});
		await app.position.setup.orderInformation.shouldHaveDebt({
			token: 'USDC',
			current: '0.00',
			future: '2,0[0-9]{2}.[0-9]{2}',
		});
		await app.position.setup.orderInformation.shouldHaveAvailableToWithdraw({
			token: 'WBTC',
			current: '0.00',
			future: '0.0[0-9]{3}',
		});
		await app.position.setup.orderInformation.shouldHaveAvailableToBorrow({
			token: 'USDC',
			current: '0.00',
			future: '[1-9],[0-9]{3}.[0-9]{2}',
		});
	});

	test('It should open an Ajna Ethereum Borrow position @regression', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: '12103',
		});

		test.setTimeout(extremelyLongTestTimeout);

		await app.page.goto('/ethereum/ajna/borrow/WSTETH-ETH#setup');
		await app.position.setup.acknowlegeAjnaInfo();
		await app.position.setup.deposit({ token: 'WSTETH', amount: '10' });
		await app.position.setup.borrow({ token: 'ETH', amount: '7' });

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

		await app.position.setup.goToPosition();
		await app.position.setup.continue();
		await app.position.manage.shouldBeVisible('Manage your Ajna Borrow Position');
	});
});
