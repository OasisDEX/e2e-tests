import { testWithSynpress } from '@synthetixio/synpress';
import { metaMaskFixtures } from '@synthetixio/synpress/playwright';
import optimismSetup from 'utils/synpress/test-wallet-setup/optimism.setup';
import { setup } from 'utils/setup';
import * as tenderly from 'utils/tenderly';
import { extremelyLongTestTimeout, longTestTimeout, veryLongTestTimeout } from 'utils/config';
import { App } from 'src/app';
import { openPosition } from 'tests/sharedTestSteps/positionManagement';

let app: App;
let forkId: string;
let walletAddress: string;

const test = testWithSynpress(metaMaskFixtures(optimismSetup));
const { expect } = test;

test.describe('Ajna Optimism Earn - Wallet connected', async () => {
	test.beforeEach(async ({ metamask, page }) => {
		test.setTimeout(longTestTimeout);

		app = new App(page);
		({ forkId, walletAddress } = await setup({ metamask, app, network: 'optimism' }));

		await tenderly.setTokenBalance({
			forkId,
			network: 'optimism',
			walletAddress,
			token: 'DAI',
			balance: '100000',
		});
	});

	test.afterEach(async () => {
		await tenderly.deleteFork(forkId);
	});

	test('It should open an Ajna Optimism Earn position @regression', async ({ metamask, page }) => {
		test.setTimeout(extremelyLongTestTimeout);

		await app.page.goto('/optimism/ajna/earn/OP-ETH#setup');
		await app.position.setup.acknowledgeAjnaInfo();

		// Pause to avoid random fails
		await app.page.waitForTimeout(1_000);

		await openPosition({
			metamask,
			app,
			forkId,
			deposit: { token: 'ETH', amount: '10' },
			adjustRisk: { value: 0.8 },
			protocol: 'Ajna',
		});
	});
});

test.describe('Ajna Optimism Earn - Wallet connected', async () => {
	test.beforeEach(async ({ metamask, page }) => {
		test.setTimeout(longTestTimeout);

		app = new App(page);
		await setup({ metamask, app, network: 'base', withoutFork: true });
	});

	test('It should allow to simulate an Ajna Optimism Earn position before opening it', async () => {
		test.setTimeout(veryLongTestTimeout);

		await app.page.goto('/optimism/ajna/earn/WBTC-DAI#setup');
		await app.position.setup.acknowledgeAjnaInfo();

		// Pause to avoid random fails
		await app.page.waitForTimeout(1_000);

		await app.position.setup.deposit({ token: 'DAI', amount: '20000' });

		await app.position.overview.shouldHaveProjectedEarnings30days({
			token: 'DAI',
			amount: '[0-9]{2,3}.[0-9]{2}',
		});

		await app.position.setup.orderInformation.shouldHaveAmountToLend({
			current: '0.00',
			future: '20,000.00',
			token: 'DAI',
		});
		await app.position.setup.orderInformation.shouldHaveLendingPrice({
			current: '0.00',
			future: '[0-9]{3}.[0-9]{2}',
			tokensPair: 'WBTC/DAI',
		});
		await app.position.setup.orderInformation.shouldHaveMaxLTV({
			current: '0.00',
			future: '[0-9]{1,2}.[0-9]{2}',
		});

		await test.step('It should allow to simulate Lending Price adjustment (Up)', async () => {
			const initialLendingPrice = await app.position.setup.getLendingPrice();
			const initialMaxLTV = await app.position.setup.getMaxLTV();

			await app.position.setup.showLendingPriceEditor({ pair: 'WBTC/DAI' });
			await app.position.setup.updateLendingPrice({
				collateralToken: 'DAI',
				adjust: 'up',
			});

			// Wait for simulation to update with new risk
			await app.position.setup.shouldHaveSpinningIconInButton('Create Smart DeFi account');
			await app.position.setup.shouldNotHaveSpinningIconInButton('Create Smart DeFi account');

			const updatedLendingPrice = await app.position.manage.getLendingPrice();
			const updatedMaxLTV = await app.position.manage.getMaxLTV();
			expect(updatedLendingPrice).toBeGreaterThan(initialLendingPrice);
			expect(updatedMaxLTV).toBeGreaterThan(initialMaxLTV);

			await app.position.setup.orderInformation.shouldHaveMaxLTV({
				current: '0.00',
				future: updatedMaxLTV.toFixed(2),
			});
		});

		await test.step('It should allow to simulate Lending Price adjustment (Down)', async () => {
			const initialLendingPrice = await app.position.setup.getLendingPrice();
			const initialMaxLTV = await app.position.setup.getMaxLTV();

			await app.position.setup.updateLendingPrice({
				collateralToken: 'DAI',
				adjust: 'down',
			});

			// Wait for simulation to update with new risk
			await app.position.setup.shouldHaveSpinningIconInButton('Create Smart DeFi account');
			await app.position.setup.shouldNotHaveSpinningIconInButton('Create Smart DeFi account');

			const updatedLendingPrice = await app.position.manage.getLendingPrice();
			const updatedMaxLTV = await app.position.manage.getMaxLTV();
			expect(updatedLendingPrice).toBeLessThan(initialLendingPrice);
			expect(updatedMaxLTV).toBeLessThan(initialMaxLTV);

			await app.position.setup.orderInformation.shouldHaveMaxLTV({
				current: '0.00',
				future: updatedMaxLTV.toFixed(2),
			});
		});
	});
});
