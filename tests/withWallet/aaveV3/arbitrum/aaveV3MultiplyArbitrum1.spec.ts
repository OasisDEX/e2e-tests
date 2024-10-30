import { testWithSynpress } from '@synthetixio/synpress';
import { metaMaskFixtures } from '@synthetixio/synpress/playwright';
import arbitrumRealWalletSetup from 'utils/synpress/wallet-setup/arbitrumRealWallet.setup';
import { setup } from 'utils/setup';
import * as tenderly from 'utils/tenderly';
import { extremelyLongTestTimeout, longTestTimeout } from 'utils/config';
import { App } from 'src/app';
import { adjustRisk, openPosition } from 'tests/sharedTestSteps/positionManagement';

let app: App;
let forkId: string;

const test = testWithSynpress(metaMaskFixtures(arbitrumRealWalletSetup));

test.describe.configure({ mode: 'serial' });

test.describe('Aave V3 Borrow - Arbitrum - Wallet connected', async () => {
	test.beforeEach(async ({ metamask, page }) => {
		test.setTimeout(longTestTimeout);

		app = new App(page);
		({ forkId } = await setup({ metamask, app, network: 'arbitrum' }));
	});

	test.afterEach(async () => {
		await tenderly.deleteFork(forkId);
		await app.page.close();
	});

	test('It should open and manage an Aave V3 Multiply Arbitrum ETH/USDC position @regression', async ({
		metamask,
	}) => {
		test.info().annotations.push({
			type: 'Test case',
			description: '12068',
		});

		test.setTimeout(extremelyLongTestTimeout);

		await app.page.goto('/arbitrum/aave/v3/multiply/eth-usdc');

		await test.step('It should Open a position', async () => {
			await openPosition({
				metamask,
				app,
				forkId,
				deposit: { token: 'ETH', amount: '8.12345' },
			});
		});

		await test.step('It should Adjust risk - Up', async () => {
			await adjustRisk({
				metamask,
				forkId,
				app,
				risk: 'up',
				newSliderPosition: 0.6,
			});
		});

		await test.step('It should Adjust risk - Down', async () => {
			await app.position.manage.withdrawCollateral();

			await adjustRisk({
				metamask,
				forkId,
				app,
				risk: 'down',
				newSliderPosition: 0.5,
			});
		});
	});
});
