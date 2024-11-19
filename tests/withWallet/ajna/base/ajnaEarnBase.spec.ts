import { testWithSynpress } from '@synthetixio/synpress';
import { metaMaskFixtures } from '@synthetixio/synpress/playwright';
import baseSetup from 'utils/synpress/test-wallet-setup/base.setup';
import { setup } from 'utils/setup';
import * as tenderly from 'utils/tenderly';
import { extremelyLongTestTimeout, longTestTimeout } from 'utils/config';
import { App } from 'src/app';
import { openPosition } from 'tests/sharedTestSteps/positionManagement';

let app: App;
let forkId: string;
let walletAddress: string;

const test = testWithSynpress(metaMaskFixtures(baseSetup));
const { expect } = test;

test.describe('Ajna Base Earn - Wallet connected', async () => {
	test.beforeEach(async ({ metamask, page }) => {
		test.setTimeout(longTestTimeout);

		app = new App(page);
		({ forkId, walletAddress } = await setup({ metamask, app, network: 'base' }));

		await tenderly.setTokenBalance({
			forkId,
			network: 'base',
			walletAddress,
			token: 'USDC',
			balance: '50000',
		});
	});

	test.afterEach(async () => {
		await tenderly.deleteFork(forkId);
	});

	test('It should open an Ajna Base Earn position @regression', async ({ metamask, page }) => {
		test.setTimeout(extremelyLongTestTimeout);

		await app.position.openPage('/base/ajna/earn/ETH-USDC#setup');
		await app.position.setup.acknowledgeAjnaInfo();

		// Pause to avoid random fails
		await app.page.waitForTimeout(1_000);

		await openPosition({
			metamask,
			app,
			forkId,
			deposit: { token: 'USDC', amount: '5000' },
			protocol: 'Ajna',
		});
	});
});

test.describe('Ajna Base Earn - Wallet connected', async () => {
	test.beforeEach(async ({ metamask, page }) => {
		app = new App(page);
		await setup({ metamask, app, network: 'base', withoutFork: true });
	});

	test.afterEach(async () => {
		await app.page.close();
	});

	test('It should allow to simulate an Ajna Base Earn position before opening it', async () => {
		test.setTimeout(extremelyLongTestTimeout);

		await test.step('Test setup', async () => {});

		await app.position.openPage('/base/ajna/earn/CBETH-ETH#setup');
		await app.position.setup.acknowledgeAjnaInfo();

		// Pause to avoid random fails
		await app.page.waitForTimeout(1_000);

		await app.position.setup.deposit({ token: 'ETH', amount: '10' });

		await app.position.overview.shouldHaveProjectedEarnings30days({
			token: 'ETH',
			amount: '0.[0-9]{4}',
		});

		await app.position.setup.orderInformation.shouldHaveAmountToLend({
			current: '0.00',
			future: '10.00',
			token: 'ETH',
		});
		await app.position.setup.orderInformation.shouldHaveLendingPrice({
			current: '0.00',
			future: '[0-5].[0-9]{4}',
			tokensPair: 'CBETH/ETH',
		});
		await app.position.setup.orderInformation.shouldHaveMaxLTV({
			current: '0.00',
			future: '[0-9]{2,3}.[0-9]{2}',
		});

		await test.step('It should allow to simulate Lending Price adjustment (Down)', async () => {
			const initialLendingPrice = await app.position.setup.getLendingPrice();
			const initialMaxLTV = await app.position.setup.getMaxLTV();

			await app.position.setup.showLendingPriceEditor({ pair: 'CBETH/ETH' });
			await app.position.setup.updateLendingPrice({
				collateralToken: 'ETH',
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

		await test.step('It should allow to simulate Lending Price adjustment (Up)', async () => {
			const initialLendingPrice = await app.position.setup.getLendingPrice();
			const initialMaxLTV = await app.position.setup.getMaxLTV();

			await app.position.setup.updateLendingPrice({
				collateralToken: 'ETH',
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
	});
});
