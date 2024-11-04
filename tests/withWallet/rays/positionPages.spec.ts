import { testWithSynpress } from '@synthetixio/synpress';
import { metaMaskFixtures } from '@synthetixio/synpress/playwright';
import arbitrumSetup from 'utils/synpress/test-wallet-setup/arbitrum.setup';
import { setup } from 'utils/setup';
import * as tenderly from 'utils/tenderly';
import { extremelyLongTestTimeout, longTestTimeout, veryLongTestTimeout } from 'utils/config';
import { App } from 'src/app';

let forkId: string;
let walletAddress: string;
let app: App;

const test = testWithSynpress(metaMaskFixtures(arbitrumSetup));
const { expect } = test;

test.describe('Rays - Wallet connected - Position page', async () => {
	test.beforeEach(async ({ metamask, page }) => {
		test.setTimeout(longTestTimeout);

		app = new App(page);
		({ forkId, walletAddress } = await setup({
			metamask,
			app,
			network: 'arbitrum',
			automationMinNetValueFlags: 'arbitrum:aavev3:0.001',
		}));

		await tenderly.changeAccountOwner({
			account: '0xf0464ef55705e5b5cb3b865d92be5341fe85fbb8',
			newOwner: walletAddress,
			forkId,
		});
	});

	test.afterEach(async () => {
		await tenderly.deleteFork(forkId);
		await app.page.close();
	});

	test('It should show Rays to be earned, increased or reduced @regression', async () => {
		test.setTimeout(extremelyLongTestTimeout);

		await app.position.openPage('/arbitrum/aave/v3/multiply/eth-dai/1#overview');

		await test.step('Adjust risk UP', async () => {
			await app.position.setup.moveSlider({ protocol: 'Ajna', value: 0.8 });
			await app.position.manage.shouldEarnRays('0.00[0-9]{2}');
		});

		await test.step('Adjust risk DOWN', async () => {
			await app.page.reload();

			await app.position.setup.moveSlider({ protocol: 'Ajna', value: 0.1 });
			await app.position.manage.shouldEarnRays('0.000[0-9]');
		});

		await test.step('Deposit extra collateral', async () => {
			await app.position.manage.openManageOptions({ currentLabel: 'Adjust' });
			await app.position.manage.select('Manage collateral');
			await app.position.manage.deposit({ token: 'ETH', amount: '10' });
			await app.position.manage.shouldIncreaseRays('[1-5],[0-9]{3}.[0-9]{2}');
		});

		await test.step('Withdraw collateral', async () => {
			await app.position.manage.withdrawCollateral();
			await app.position.manage.withdraw({ token: 'ETH', amount: '0.002' });

			await app.position.manage.shouldReduceRays({ raysCount: '0.00[0-9]{2}' });
		});

		await test.step('Pay back debt', async () => {
			await app.position.manage.openManageOptions({ currentLabel: 'ETH' });
			await app.position.manage.select('Manage debt');
			await app.position.manage.payBack({ token: 'Dai', amount: '1.5' });
			await app.position.manage.shouldIncreaseRays('0.00[0-9]{2}');
		});

		await test.step('Borrow more', async () => {
			await app.position.manage.withdrawDebt();
			await app.position.manage.borrow({ token: 'DAI', amount: '7' });

			await app.position.manage.shouldReduceRays({ raysCount: '0.00[0-9]{2}' });
		});

		await test.step('Close position', async () => {
			await app.position.manage.openManageOptions({ currentLabel: 'DAI' });
			await app.position.manage.select('Close position');
			await app.position.manage.shouldEarnRays('0.000[0-9]');
		});
	});
});
