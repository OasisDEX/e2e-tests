import { testWithSynpress } from '@synthetixio/synpress';
import { metaMaskFixtures } from '@synthetixio/synpress/playwright';
import basicSetup from 'utils/synpress/test-wallet-setup/basic.setup';
import { setup } from 'utils/setup';
import { extremelyLongTestTimeout, longTestTimeout } from 'utils/config';
import { App } from 'src/app';
import { openPosition } from 'tests/sharedTestSteps/positionManagement';

let app: App;
let forkId: string;

const test = testWithSynpress(metaMaskFixtures(basicSetup));
const { expect } = test;

test.describe('Ajna Ethereum Earn - Wallet connected', async () => {
	test.beforeEach(async ({ metamask, page }) => {
		test.setTimeout(longTestTimeout);

		app = new App(page);
		({ forkId } = await setup({ metamask, app, network: 'mainnet' }));
	});

	test.afterEach(async () => {
		await app.page.close();
	});

	test('It should open an Ajna Ethereum Earn position @regression', async ({ metamask }) => {
		test.setTimeout(extremelyLongTestTimeout);

		await app.page.goto('/ethereum/ajna/earn/RETH-ETH#setup');
		await app.position.setup.acknowledgeAjnaInfo();

		await openPosition({
			metamask,
			app,
			forkId,
			deposit: { token: 'ETH', amount: '20' },
			protocol: 'Ajna',
		});
	});

	test('It should allow to simulate an Ajna Ethereum Earn position before opening it', async () => {
		await app.page.goto('/ethereum/ajna/earn/WSTETH-ETH#setup');

		await app.position.setup.acknowledgeAjnaInfo();
		await app.position.setup.deposit({ token: 'ETH', amount: '9.12345' });

		await app.position.overview.shouldHaveProjectedEarnings30days({
			token: 'ETH',
			amount: '0.0[0-9]{3}',
		});

		await app.position.setup.orderInformation.shouldHaveAmountToLend({
			current: '0.00',
			future: '9.[0-9]{4}',
			token: 'ETH',
		});
		await app.position.setup.orderInformation.shouldHaveLendingPrice({
			current: '0.00',
			future: '[0-9]{1,2}.[0-9]{4}',
			tokensPair: 'WSTETH/ETH',
		});
		await app.position.setup.orderInformation.shouldHaveMaxLTV({
			current: '0.00',
			future: '[0-9]{1,2}.[0-9]{2}',
		});

		await test.step('Lending Price adjustment - UP', async () => {
			const initialLendingPrice = await app.position.setup.getLendingPrice();
			const initialMaxLTV = await app.position.setup.getMaxLTV();

			await app.position.setup.showLendingPriceEditor({ pair: 'WSTETH/ETH' });
			await app.position.setup.updateLendingPrice({
				collateralToken: 'ETH',
				adjust: 'up',
			});

			// Wait for simulation to update with new risk
			await app.position.setup.shouldHaveButtonDisabled('Create');
			await app.position.setup.shouldHaveButtonEnabled('Create');

			const updatedLendingPrice = await app.position.manage.getLendingPrice();
			const updatedMaxLTV = await app.position.manage.getMaxLTV();
			expect(updatedLendingPrice).toBeGreaterThan(initialLendingPrice);
			expect(updatedMaxLTV).toBeGreaterThan(initialMaxLTV);

			await app.position.setup.orderInformation.shouldHaveMaxLTV({
				current: '0.00',
				future: updatedMaxLTV.toFixed(2),
			});
		});

		await test.step('Lending Price adjustment - DOWN', async () => {
			const initialLendingPrice = await app.position.setup.getLendingPrice();
			const initialMaxLTV = await app.position.setup.getMaxLTV();

			await app.position.setup.updateLendingPrice({
				collateralToken: 'ETH',
				adjust: 'down',
			});

			// Wait for simulation to update with new risk
			await app.position.setup.shouldHaveButtonDisabled('Create');
			await app.position.setup.shouldHaveButtonEnabled('Create');

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
