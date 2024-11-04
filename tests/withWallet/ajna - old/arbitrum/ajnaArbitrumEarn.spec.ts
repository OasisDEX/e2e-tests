import { BrowserContext, test } from '@playwright/test';
import { expect, metamaskSetUp } from 'utils/setup';
import { resetState } from '@synthetixio/synpress/commands/synpress';
import * as tenderly from 'utils/tenderly';
import { setup } from 'utils/setup';
import { extremelyLongTestTimeout, longTestTimeout } from 'utils/config';
import { App } from 'src/app';
import { openPosition } from 'tests/sharedTestSteps/positionManagement';

let context: BrowserContext;
let app: App;
let forkId: string;
let walletAddress: string;

test.describe.configure({ mode: 'serial' });

test.describe('Ajna Arbitrum Earn - Wallet connected', async () => {
	test.afterAll(async () => {
		await tenderly.deleteFork(forkId);

		await app.page.close();

		await context.close();

		await resetState();
	});

	test('It should open an Ajna Arbitrum Earn position @regression', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: 'xxx',
		});

		test.setTimeout(extremelyLongTestTimeout);

		await test.step('Test setup', async () => {
			({ context } = await metamaskSetUp({ network: 'arbitrum' }));
			let page = await context.newPage();
			app = new App(page);

			({ forkId, walletAddress } = await setup({
				app,
				network: 'arbitrum',
				extraFeaturesFlags: 'AjnaSuppressValidation:true',
			}));

			await tenderly.setTokenBalance({
				forkId,
				walletAddress,
				network: 'arbitrum',
				token: 'WBTC',
				balance: '5',
			});

			await tenderly.setTokenBalance({
				forkId,
				walletAddress,
				network: 'arbitrum',
				token: 'USDC',
				balance: '100000',
			});
		});

		await app.position.openPage('/arbitrum/ajna/earn/USDC-WBTC#setup');
		await app.position.setup.acknowledgeAjnaInfo();

		await openPosition({
			app,
			forkId,
			deposit: { token: 'WBTC', amount: '1' },
			adjustRisk: { value: 0.8 },
			protocol: 'Ajna',
		});
	});

	test('It should allow to simulate an Ajna Arbitrum Earn position before opening it', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: 'xxx',
		});

		test.setTimeout(longTestTimeout);

		await app.position.openPage('/arbitrum/ajna/earn/RETH-ETH#setup');
		await app.position.setup.acknowledgeAjnaInfo();
		await app.position.setup.deposit({ token: 'ETH', amount: '10' });

		await app.position.overview.shouldHaveProjectedEarnings30days({
			token: 'ETH',
			amount: '0.0[0-9]{3}',
		});

		await app.position.setup.orderInformation.shouldHaveAmountToLend({
			current: '0.00',
			future: '10.00',
			token: 'ETH',
		});
		await app.position.setup.orderInformation.shouldHaveLendingPrice({
			current: '0.00',
			future: '0.[0-9]{3,4}',
			tokensPair: 'RETH/ETH',
		});
		await app.position.setup.orderInformation.shouldHaveMaxLTV({
			current: '0.00',
			future: '[0-9]{1,2}.[0-9]{2}',
		});
	});

	test('It should allow to simulate Lending Price adjustment (Up) in an Ajna Base Earn position before opening it', async () => {
		test.info().annotations.push(
			{
				type: 'Test case',
				description: 'xxx',
			},
			{
				type: 'Bug',
				description: '15163',
			}
		);

		const initialLendingPrice = await app.position.setup.getLendingPrice();
		const initialMaxLTV = await app.position.setup.getMaxLTV();

		await app.position.setup.showLendingPriceEditor({ pair: 'RETH/ETH' });
		await app.position.setup.updateLendingPrice({
			collateralToken: 'ETH',
			adjust: 'up',
		});

		// Wait for simulation to update with new risk
		// BUG
		// await app.position.setup.shouldHaveButtonDisabled('Confirm');
		// await app.position.setup.shouldHaveButtonEnabled('Confirm');

		await expect(async () => {
			const updatedLendingPrice = await app.position.manage.getLendingPrice();
			const updatedMaxLTV = await app.position.manage.getMaxLTV();
			expect(updatedLendingPrice).toBeGreaterThan(initialLendingPrice);
			expect(updatedMaxLTV).toBeGreaterThan(initialMaxLTV);

			await app.position.setup.orderInformation.shouldHaveMaxLTV({
				current: '0.00',
				future: updatedMaxLTV.toFixed(2),
			});
		}).toPass();
	});

	test('It should allow to simulate Lending Price adjustment (Down) in an Ajna Base Earn position before opening it', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: '15163',
		});

		const initialLendingPrice = await app.position.setup.getLendingPrice();
		const initialMaxLTV = await app.position.setup.getMaxLTV();

		await app.position.setup.updateLendingPrice({
			collateralToken: 'ETH',
			adjust: 'down',
		});

		// Wait for simulation to update with new risk
		// BUG
		// await app.position.setup.shouldHaveButtonDisabled('Confirm');
		// await app.position.setup.shouldHaveButtonEnabled('Confirm');

		await expect(async () => {
			const updatedLendingPrice = await app.position.manage.getLendingPrice();
			const updatedMaxLTV = await app.position.manage.getMaxLTV();
			expect(updatedLendingPrice).toBeLessThan(initialLendingPrice);
			expect(updatedMaxLTV).toBeLessThan(initialMaxLTV);

			await app.position.setup.orderInformation.shouldHaveMaxLTV({
				current: '0.00',
				future: updatedMaxLTV.toFixed(2),
			});
		}).toPass();
	});
});
