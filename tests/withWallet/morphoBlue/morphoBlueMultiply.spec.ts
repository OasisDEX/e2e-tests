import { BrowserContext, test } from '@playwright/test';
import { expect, metamaskSetUp } from 'utils/setup';
import { resetState } from '@synthetixio/synpress/commands/synpress';
import * as metamask from '@synthetixio/synpress/commands/metamask';
import * as tenderly from 'utils/tenderly';
import { setup } from 'utils/setup';
import { veryLongTestTimeout, longTestTimeout, positionTimeout } from 'utils/config';
import { App } from 'src/app';

let context: BrowserContext;
let app: App;
let forkId: string;
let walletAddress: string;

test.describe.configure({ mode: 'serial' });

test.describe('Morpho Blue Multiply - Wallet connected', async () => {
	test.afterAll(async () => {
		await tenderly.deleteFork(forkId);

		await app.page.close();

		await context.close();

		await resetState();
	});

	test('It should allow to simulate a Morpho Blue Multiply position before opening it @regression', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: 'xxx',
		});

		test.setTimeout(veryLongTestTimeout);

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
				balance: '100',
			});
		});

		await app.page.goto('/ethereum/morphoblue/multiply/WSTETH-USDC#setup');
		await app.position.setup.deposit({ token: 'WSTETH', amount: '15.12345' });

		await app.position.overview.shouldHaveLiquidationPriceAfterPill(
			'[0-9]{3}.[0-9]{2} WSTETH/USDC'
		);
		await app.position.overview.shouldHaveLoanToValueAfterPill('[0-9]{1,2}.[0-9]{2}%');
		await app.position.overview.shouldHaveNetValueAfterPill('\\$[0-9]{2},[0-9]{3}.[0-9]{2}');
		await app.position.overview.shouldHaveBuyingPowerAfterPill({
			amount: '[0-9]{2},[0-9]{3}(.[0-9]{1,2})?',
			protocol: 'Morpho Blue',
		});
		await app.position.overview.shouldHaveExposureAfterPill({
			amount: '1[5-7].[0-9]{1,2}',
			token: 'WSTETH',
		});
		await app.position.overview.shouldHaveDebtAfterPill({
			amount: '[1-9],[0-9]{3}.[0-9]{2}',
			token: 'USDC',
			protocol: 'Morpho Blue',
		});
		await app.position.overview.shouldHaveMultipleAfterPill('1(.[0-9]{1,2})?');

		await app.position.setup.shouldHaveLiquidationPrice({
			amount: '[0-9]{3}(.[0-9]{1,2})? WSTETH/USDC',
		});
		// Morphho Blue LTV displays both current and future values: 0.00% -> 10.00%
		await app.position.setup.shouldHaveLoanToValue('0.00%10.00');
		await app.position.setup.orderInformation.shouldHaveBuyingAmount({
			tokenAmount: '[0-2].[0-9]{4}',
			token: 'WSTETH',
			dollarsAmount: '([1-9]{1,2},)?[0-9]{3}.[0-9]{2}',
			protocol: 'Morpho Blue',
		});
		await app.position.setup.orderInformation.shouldHaveTotalExposure({
			token: 'WSTETH',
			current: '0.00',
			future: '1[5-7].[0-9]{1,2}',
		});
		await app.position.setup.orderInformation.shouldHavePriceImpact({
			amount: '[1-5],[0-9]{3}.[0-9]{2}',
			percentage: '[0-9].[0-9]{2}',
			protocol: 'Morpho Blue',
			pair: 'WSTETH/USDC',
		});
		await app.position.setup.orderInformation.shouldHaveMultiple({
			current: '1.00',
			future: '1(.[0-9]{1,2})?',
		});
		await app.position.setup.orderInformation.shouldHaveSlippageLimit('0.50');
		await app.position.setup.orderInformation.shouldHaveDebt({
			token: 'USDC',
			current: '0.00',
			future: '[1-9],[0-9]{3}.[0-9]{2}',
		});
		await app.position.setup.orderInformation.shouldHaveLTV({
			current: '0.00',
			future: '[0-9]{1,2}.[0-9]{2}',
			protocol: 'Morpho Blue',
		});
	});

	test('It should allow to simulate risk adjustment (Up & Down) with slider in a Morpho Blue Multiply position before opening it @regression', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: 'xxx',
		});

		const initialLiqPrice = await app.position.manage.getLiquidationPrice();
		const initialLoanToValue = await app.position.manage.getLoanToValue('Morpho Blue');

		// RISK UP
		await app.position.setup.moveSlider({ protocol: 'Morpho', value: 0.5 });

		// Wait for simulation to update with new risk
		await app.position.setup.shouldHaveLiquidationPrice({ amount: '.', pair: 'WSTETH/USDC' });

		const updatedLiqPrice = await app.position.manage.getLiquidationPrice();
		const updatedLoanToValue = await app.position.manage.getLoanToValue('Morpho Blue');
		expect(updatedLiqPrice).toBeGreaterThan(initialLiqPrice);
		expect(updatedLoanToValue).toBeGreaterThan(initialLoanToValue);

		// RISK DOWN
		await app.position.setup.moveSlider({ protocol: 'Morpho', value: 0.3 });

		// Wait for simulation to update with new risk
		await app.position.setup.shouldHaveLiquidationPrice({ amount: '.', pair: 'WSTETH/USDC' });

		const updatedLiqPrice2 = await app.position.manage.getLiquidationPrice();
		const updatedLoanToValue2 = await app.position.manage.getLoanToValue('Morpho Blue');
		expect(updatedLiqPrice2).toBeLessThan(updatedLiqPrice);
		expect(updatedLoanToValue2).toBeLessThan(updatedLoanToValue);
	});

	test('It should open a Morpho Blue Multiply position @regression', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: 'xxx',
		});

		test.setTimeout(veryLongTestTimeout);

		await app.page.goto('/ethereum/morphoblue/multiply/WSTETH-ETH#setup');

		await app.position.openNewMultiplyPosition({
			forkId,
			deposit: { token: 'WSTETH', amount: '30.12345' },
		});

		await app.position.setup.goToPosition();

		await app.position.manage.shouldBeVisible('Manage your Morpho Multiply');
	});

	test('It should adjust risk of an existing Morpho Blue Multiply position - Up @regression', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: 'xxx',
		});

		test.setTimeout(longTestTimeout);

		await app.position.adjustRiskOnExistingMultiplyPosition_UP({
			protocol: 'Morpho',
			forkId,
			newSliderPosition: 0.6,
		});
	});

	test('It should adjust risk of an existing Morpho Blue Multiply position - Down @regression', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: 'xxxx',
		});

		test.setTimeout(longTestTimeout);

		await app.position.adjustRiskOnExistingMultiplyPosition_DOWN({
			protocol: 'Morpho',
			forkId,
			newSliderPosition: 0.5,
		});
	});

	test('It should Close to collateral an existing Morpho Blue Multiply position @regression', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: 'xxxx',
		});

		test.setTimeout(longTestTimeout);

		await app.position.manage.openManageOptions({ currentLabel: 'Adjust' });
		await app.position.manage.select('Close position');
		await app.position.manage.shouldHaveTokenAmountAfterClosing({
			token: 'WSTETH',
			amount: '[0-9]{1,2}.[0-9]{1,2}',
		});

		await app.position.setup.confirm();

		// ============================================================

		// UI sometimes gets stuck after confirming position update
		//   - 'Reload' added to avoid flakines
		await app.position.setup.confirm();
		await test.step('Metamask: ConfirmPermissionToSpend', async () => {
			await metamask.confirmPermissionToSpend();
		});
		await app.position.setup.shouldShowUpdatingPosition();
		await app.page.reload();

		// ============================================================

		await app.position.overview.shouldHaveLiquidationPrice({
			price: '0.00',
			timeout: positionTimeout,
		});
		await app.position.overview.shouldHaveLoanToValue('0.00');
		await app.position.overview.shouldHaveNetValue({ value: '0.00' });
		await app.position.overview.shouldHaveBuyingPower('0.00');
		await app.position.overview.shouldHaveExposure({ token: 'WSTETH', amount: '0.00' });
		await app.position.overview.shouldHaveDebt({
			amount: '0.00',
			token: 'ETH',
			protocol: 'Morpho Blue',
		});
		await app.position.overview.shouldHaveMultiple('1.00');
	});
});
