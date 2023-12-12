import { BrowserContext, test } from '@playwright/test';
import { expect, metamaskSetUp } from 'utils/setup';
import { resetState } from '@synthetixio/synpress/commands/synpress';
import * as metamask from '@synthetixio/synpress/commands/metamask';
import * as tenderly from 'utils/tenderly';
import { setup } from 'utils/setup';
import {
	hooksTimeout,
	extremelyLongTestTimeout,
	veryLongTestTimeout,
	baseUrl,
	longTestTimeout,
} from 'utils/config';
import { App } from 'src/app';

let context: BrowserContext;
let app: App;
let forkId: string;

test.describe.configure({ mode: 'serial' });

test.describe('Ajna Ethereum Multiply - Wallet connected', async () => {
	test.beforeAll(async () => {
		test.setTimeout(hooksTimeout);

		({ context } = await metamaskSetUp({ network: 'mainnet' }));
		let page = await context.newPage();
		app = new App(page);

		({ forkId } = await setup({ app, network: 'mainnet' }));
		await tenderly.setRethBalance({ forkId, rEthBalance: '100' });
	});

	test.afterAll(async () => {
		await tenderly.deleteFork(forkId);

		await app.page.close();

		await context.close();

		await resetState();
	});

	test('It should allow to simulate an Ajna Ethereum Multiply position before opening it @regression', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: '12729',
		});

		test.setTimeout(veryLongTestTimeout);

		await app.page.goto('/ethereum/ajna/multiply/WBTC-USDC#setup');
		await app.position.setup.acknowlegeAjnaInfo();
		await app.position.setup.deposit({ token: 'WBTC', amount: '3.123456' });

		// !!!!! BUG - 'Liquidation Price' returning 0.00 at the moment !!!!!!
		await app.position.overview.shouldHaveLiquidationPriceAfterPill('[1-9],[0-9]{3}.[0-9]{2}');
		await app.position.overview.shouldHaveLoanToValueAfterPill('[1-4][0-9].[0-9]{2}%');
		await app.position.overview.shouldHaveNetValueAfterPill('[0-9]{2,3},[0-9]{3}.[0-9]{2}');
		await app.position.overview.shouldHaveExposureAfterPill({
			amount: '[3-5].[0-9]{4}',
			token: 'WBTC',
		});
		await app.position.overview.shouldHaveDebtAfterPill({
			amount: '[1-3][0-9],[0-9]{3}.[0-9]{2}',
			token: 'USDC',
		});
		await app.position.overview.shouldHaveMultipleAfterPill('1(.[0-9]{1,2})?');
		await app.position.overview.shouldHaveBuyingPowerAfterPill({
			amount: '[1-9][0-9],[0-9]{3}(.[0-9]{1,2})?',
		});
		// !!!!! BUG - 'Liquidation Price' returning 0.00 at the moment !!!!!!
		await app.position.setup.shouldHaveLiquidationPrice({
			amount: '[0-9]{1,2},[0-9]{3}(.[0-9]{1,2})? USDC',
		});
		// Ajna LTV displays both current and future values: 0.00% -> 10.00%
		await app.position.setup.shouldHaveLoanToValue('0.00%10.00');
		await app.position.setup.orderInformation.shouldHaveBuyingAmount({
			tokenAmount: '[0-1].[0-9]{4}',
			token: 'WBTC',
			dollarsAmount: '[1-3][0-9],[0-9]{3}.[0-9]{2}',
			protocol: 'Ajna',
		});
		await app.position.setup.orderInformation.shouldHaveTotalExposure({
			token: 'WBTC',
			current: '0.00',
			future: '3.[0-9]{3,4}',
		});
		await app.position.setup.orderInformation.shouldHavePriceImpact({
			amount: '[2-6][0-9],[0-9]{3}.[0-9]{2}',
			percentage: '[0-9].[0-9]{2}',
			protocol: 'Ajna',
			pair: 'WBTC\\/USDC',
		});
		await app.position.setup.orderInformation.shouldHaveMultiple({
			current: '1.00',
			future: '1(.[0-9]{1,2})?',
		});
		await app.position.setup.orderInformation.shouldHaveSlippageLimit('0.[0-9]{2}');
		await app.position.setup.orderInformation.shouldHaveDebt({
			token: 'USDC',
			current: '0.00',
			future: '[0-9]{1,2},[0-9]{3}.[0-9]{2}',
		});
		await app.position.setup.orderInformation.shouldHaveLTV({
			current: '0.00',
			future: '[1-2][0-9].[0-9]{2}',
			protocol: 'Ajna',
		});
		await app.position.setup.orderInformation.shouldHaveMaxLTV({
			current: '[0-9]{2}.[0-9]{2}',
			future: '[0-9]{2}.[0-9]{2}',
		});
	});

	test('It should allow to simulate risk adjustment (Up & Down) with slider in an Ajna Multiply position before opening it @regression', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: '12730',
		});

		await app.page.goto('/ethereum/ajna/multiply/WBTC-DAI#setup');

		await app.position.setup.acknowlegeAjnaInfo();
		await app.position.setup.deposit({ token: 'WBTC', amount: '5' });

		// Wait for simulation values to be updated
		await app.position.overview.shouldHaveLoanToValueAfterPill('[1-3][0-9].[0-9]{2}%');

		const initialLiqPrice = await app.position.manage.getLiquidationPrice();
		const initialLoanToValue = await app.position.manage.getLoanToValue('Ajna');

		// RISK UP
		await app.position.setup.moveSlider({ protocol: 'Ajna', value: 0.5 });

		// Wait for simulation to update with new risk
		await app.position.setup.shouldHaveButtonDisabled('Create Smart DeFi account');
		await app.position.setup.shouldHaveButtonEnabled('Create Smart DeFi account');

		const updatedLiqPrice = await app.position.manage.getLiquidationPrice();
		const updatedLoanToValue = await app.position.manage.getLoanToValue('Ajna');
		expect(updatedLiqPrice).toBeLessThan(initialLiqPrice);
		expect(updatedLoanToValue).toBeGreaterThan(initialLoanToValue);

		// RISK DOWN
		await app.position.setup.moveSlider({ value: 0.3 });

		// Wait for simulation to update with new risk
		await app.position.setup.shouldHaveButtonDisabled('Create Smart DeFi account');
		await app.position.setup.shouldHaveButtonEnabled('Create Smart DeFi account');

		const updatedLiqPrice2 = await app.position.manage.getLiquidationPrice();
		const updatedLoanToValue2 = await app.position.manage.getLoanToValue('Ajna');
		expect(updatedLiqPrice2).toBeGreaterThan(updatedLiqPrice);
		expect(updatedLoanToValue2).toBeLessThan(updatedLoanToValue);
	});

	test('It should open an Ajna Ethreum Multiply position @regression', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: '12104',
		});

		test.skip(baseUrl.includes('staging') || baseUrl.includes('//summer.fi'));

		test.setTimeout(extremelyLongTestTimeout);

		await app.page.goto('/ethereum/ajna/multiply/RETH-ETH');
		await app.position.setup.acknowlegeAjnaInfo();
		await app.position.setup.deposit({ token: 'RETH', amount: '7.543' });
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

		// await app.position.setup.setupAllowance();
		await app.position.setup.approveAllowance();
		await test.step('Metamask: ConfirmAddToken', async () => {
			await metamask.confirmAddToken();
		});
		await app.position.setup.continue();

		// Position creation randomly fails - Retry until it's created.
		await expect(async () => {
			await app.position.setup.confirmOrRetry();
			await test.step('Metamask: ConfirmPermissionToSpend', async () => {
				await metamask.confirmPermissionToSpend();
			});
			await app.position.setup.shouldConfirmPositionCreation();
		}).toPass({ timeout: longTestTimeout });

		await app.position.setup.goToPosition();
		await app.position.manage.shouldBeVisible('Manage ');
	});
});
