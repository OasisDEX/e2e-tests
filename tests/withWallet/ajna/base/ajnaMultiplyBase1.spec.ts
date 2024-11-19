import { testWithSynpress } from '@synthetixio/synpress';
import { metaMaskFixtures } from '@synthetixio/synpress/playwright';
import baseSetup from 'utils/synpress/test-wallet-setup/base.setup';
import { setup } from 'utils/setup';
import * as tenderly from 'utils/tenderly';
import { extremelyLongTestTimeout, longTestTimeout } from 'utils/config';
import { App } from 'src/app';
import { adjustRisk, openPosition } from 'tests/sharedTestSteps/positionManagement';

let app: App;
let forkId: string;
let walletAddress: string;

const test = testWithSynpress(metaMaskFixtures(baseSetup));

test.describe('Ajna Base Multiply - Wallet connected', async () => {
	test.beforeEach(async ({ metamask, page }) => {
		test.setTimeout(longTestTimeout);

		app = new App(page);
		({ forkId, walletAddress } = await setup({
			metamask,
			app,
			network: 'base',
			extraFeaturesFlags: 'AjnaSuppressValidation:true',
		}));

		await tenderly.setTokenBalance({
			forkId,
			walletAddress,
			network: 'base',
			token: 'USDC',
			balance: '200000',
		});
	});

	test.afterEach(async () => {
		await tenderly.deleteFork(forkId);
	});

	test('It should open and manage an Ajna Base Multiply position @regression', async ({
		metamask,
	}) => {
		test.setTimeout(extremelyLongTestTimeout);

		await test.step('Setup test - Open Earn position to provide liquidity', async () => {
			await app.position.openPage('/base/ajna/earn/ETH-USDC#setup');
			await app.position.setup.acknowledgeAjnaInfo();

			await openPosition({
				metamask,
				app,
				forkId,
				deposit: { token: 'USDC', amount: '150000' },
			});
		});

		// Wait to make sure that liquidity added in previous test is actually up
		await app.page.waitForTimeout(5_000);

		await app.page.goto('/base/ajna/multiply/ETH-USDC');
		await app.position.setup.acknowledgeAjnaInfo();

		await test.step('Open Borrow position', async () => {
			// For avoiding flakiness
			await app.page.waitForTimeout(1_000);

			await openPosition({
				metamask,
				app,
				forkId,
				deposit: { token: 'ETH', amount: '2' },
				protocol: 'Ajna',
				ajnaExistingDpm: true,
			});
		});

		await test.step('Adjust risk - UP', async () => {
			// For avoiding flakiness
			await app.page.waitForTimeout(1_000);

			await adjustRisk({
				metamask,
				forkId,
				app,
				risk: 'up',
				newSliderPosition: 0.3,
			});
		});

		await test.step('Adjust risk - DOWN', async () => {
			// For avoiding flakiness
			await app.page.waitForTimeout(1_000);

			await adjustRisk({
				metamask,
				forkId,
				app,
				risk: 'down',
				newSliderPosition: 0.18,
			});
		});
	});
});
