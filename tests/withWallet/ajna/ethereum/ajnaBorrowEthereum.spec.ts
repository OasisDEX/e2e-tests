import { BrowserContext, test } from '@playwright/test';
import { expect, metamaskSetUp } from 'utils/setup';
import { resetState } from '@synthetixio/synpress/commands/synpress';
import * as metamask from '@synthetixio/synpress/commands/metamask';
import * as tenderly from 'utils/tenderly';
import { setup } from 'utils/setup';
import { hooksTimeout, extremelyLongTestTimeout } from 'utils/config';
import { App } from 'src/app';

let context: BrowserContext;
let app: App;
let forkId: string;

test.describe.configure({ mode: 'serial' });

test.describe('Ajna Ethereum Borrow - Wallet connected', async () => {
	test.beforeEach(async () => {
		test.setTimeout(hooksTimeout);

		({ context } = await metamaskSetUp({ network: 'mainnet' }));
		let page = await context.newPage();
		app = new App(page);

		({ forkId } = await setup({ app, network: 'mainnet' }));
	});

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

		await app.page.goto('/ethereum/ajna/borrow/CBETH-ETH#setup');

		await app.position.setup.acknowlegeAjnaInfo();
		await app.position.setup.deposit({ token: 'CBETH', amount: '26.12345' });

		await app.position.overview.shouldHaveCollateralLockedAfterPill('26.12 CBETH');
		await app.position.overview.shouldHaveAvailableToWithdraw({
			amount: '26.12',
			token: 'CBETH',
		});
		await app.position.overview.shouldHaveAvailableToBorrow({
			amount: '2[4-9].[0-9]{2}',
			token: 'ETH',
		});
		await app.position.setup.shouldHaveMaxBorrowingAmount({
			token: 'ETH',
			amount: '2[4-9].[0-9]{2}',
		});
		await app.position.setup.orderInformation.shouldHaveCollateralLocked({
			token: 'CBETH',
			current: '0.00',
			future: '26.12',
		});
		await app.position.setup.orderInformation.shouldHaveMaxLTV({
			current: '[7-9][0-9].[0-9]{2}',
			future: '[7-9][0-9].[0-9]{2}',
		});
		await app.position.setup.orderInformation.shouldHaveAvailableToWithdraw({
			token: 'CBETH',
			current: '0.00',
			future: '26.12',
		});
		await app.position.setup.orderInformation.shouldHaveAvailableToBorrow({
			token: 'ETH',
			current: '0.00',
			future: '2[5-8].[0-9]{2}',
		});

		await app.position.setup.borrow({ token: 'ETH', amount: '20' });

		await app.position.overview.shouldHaveLiquidationPriceAfterPill('0.[0-9]{4} CBETH/ETH');
		await app.position.overview.shouldHaveLoanToValueAfterPill('[5-9][0-9].[0-9]{2}%');
		await app.position.overview.shouldHaveDebtAfterPill({
			protocol: 'Ajna',
			amount: '20(.[0-9]{2})?',
			token: 'ETH',
		});
		await app.position.overview.shouldHaveAvailableToWithdraw({
			amount: '[4-9].[0-9]{4}',
			token: 'CBETH',
		});
		await app.position.overview.shouldHaveAvailableToBorrow({
			amount: '[4-9].[0-9]{4}',
			token: 'ETH',
		});
		await app.position.setup.shouldHaveOriginationFee({
			token: 'ETH',
			tokenAmount: '0.[0-9]{4}',
			dollarsAmount: '[0-9]{1,2}(.[0-9]{1,2})?',
		});
		await app.position.orderInformation.shouldHaveLTV({
			protocol: 'Ajna',
			current: '0.00',
			future: '[5-9][0-9].[0-9]{2}',
		});
		await app.position.orderInformation.shouldHaveLiquidationPrice({
			pair: 'CBETH/ETH',
			current: '0.00',
			future: '0.[0-9]{3,4}',
		});
		await app.position.setup.orderInformation.shouldHaveMaxLTV({
			current: '[7-9][0-9].[0-9]{2}',
			future: '[7-9][0-9].[0-9]{2}',
		});
		await app.position.setup.orderInformation.shouldHaveDebt({
			token: 'ETH',
			current: '0.00',
			future: '20.[0-9]{2}',
		});
		await app.position.setup.orderInformation.shouldHaveAvailableToWithdraw({
			token: 'CBETH',
			current: '0.00',
			future: '[4-9].[0-9]{4}',
		});
		await app.position.setup.orderInformation.shouldHaveAvailableToBorrow({
			token: 'ETH',
			current: '0.00',
			future: '[4-9].[0-9]{4}',
		});
	});

	test('It should open an Ajna Ethereum Borrow position @regression', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: '12103',
		});

		test.setTimeout(extremelyLongTestTimeout);

		await app.page.goto('/ethereum/ajna/borrow/ETH-DAI');
		await app.position.setup.acknowlegeAjnaInfo();
		await app.position.setup.deposit({ token: 'ETH', amount: '11.12345' });
		await app.position.setup.borrow({ token: 'DAI', amount: '50' });
		await app.position.setup.createSmartDeFiAccount();

		// Smart DeFi Acount creation randomly fails - Retry until it's created.
		await expect(async () => {
			await app.position.setup.createSmartDeFiAccount();
			await test.step('Metamask: ConfirmAddToken', async () => {
				await metamask.confirmAddToken();
			});
			await app.position.setup.continueShouldBeVisible();
		}).toPass();

		await app.position.setup.continue();

		// Position creation randomly fails - Retry until it's created.
		await expect(async () => {
			await app.position.setup.confirmOrRetry();
			await test.step('Metamask: ConfirmPermissionToSpend', async () => {
				await metamask.confirmPermissionToSpend();
			});
			await app.position.setup.goToPositionShouldBeVisible();
		}).toPass();

		await app.position.setup.goToPosition();
		await app.position.manage.shouldBeVisible('Manage your ');
	});
});
