import { testWithSynpress } from '@synthetixio/synpress';
import { metaMaskFixtures } from '@synthetixio/synpress/playwright';
import arbitrumSetup from 'utils/synpress/test-wallet-setup/arbitrum.setup';
import { setup } from 'utils/setup';
import * as tenderly from 'utils/tenderly';
import { extremelyLongTestTimeout, longTestTimeout } from 'utils/config';
import { App } from 'src/app';
import { openPosition } from 'tests/sharedTestSteps/positionManagement';

let app: App;
let vtId: string;
let vtRPC: string;
let walletAddress: string;

const test = testWithSynpress(metaMaskFixtures(arbitrumSetup));
const { expect } = test;

test.describe('Ajna Arbitrum Earn - Wallet connected', async () => {
	test.beforeEach(async ({ metamask, page }) => {
		test.setTimeout(longTestTimeout);

		app = new App(page);

		({ vtId, vtRPC, walletAddress } = await setup({ metamask, app, network: 'arbitrum' }));

		await tenderly.setTokenBalance({
			vtRPC,
			walletAddress,
			network: 'arbitrum',
			token: 'WBTC',
			balance: '5',
		});
	});

	test.afterEach(async () => {
		await tenderly.deleteFork(vtId);
	});

	test('It should open an Ajna Arbitrum Earn position @regression', async ({ metamask }) => {
		test.setTimeout(extremelyLongTestTimeout);

		await app.position.openPage('/arbitrum/ajna/earn/USDC-WBTC#setup');
		await app.position.setup.acknowledgeAjnaInfo();

		// Pause to avoid random fails
		await app.page.waitForTimeout(1_000);

		await openPosition({
			metamask,
			app,
			vtId,
			deposit: { token: 'WBTC', amount: '1' },
			adjustRisk: { value: 0.8 },
			protocol: 'Ajna',
		});
	});
});

test.describe('Ajna Arbitrum Earn - Wallet connected', async () => {
	test.beforeEach(async ({ metamask, page }) => {
		test.setTimeout(longTestTimeout);

		app = new App(page);
		await setup({ metamask, app, network: 'arbitrum', withoutFork: true });
	});

	test('It should allow to simulate an Ajna Arbitrum Earn position before opening it', async () => {
		test.setTimeout(longTestTimeout);

		await app.position.openPage('/arbitrum/ajna/earn/RETH-ETH#setup');

		await app.position.setup.acknowledgeAjnaInfo();

		// Pause to avoid random fails
		await app.page.waitForTimeout(1_000);

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

		await test.step('It should allow to simulate Lending Price adjustment (Up)', async () => {
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

		await test.step('It should allow to simulate Lending Price adjustment (Up)', async () => {
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
});
