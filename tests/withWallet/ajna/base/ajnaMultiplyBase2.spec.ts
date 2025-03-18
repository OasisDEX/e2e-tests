import { testWithSynpress } from '@synthetixio/synpress';
import { metaMaskFixtures } from '@synthetixio/synpress/playwright';
import baseSetup from 'utils/synpress/test-wallet-setup/base.setup';
import { setup } from 'utils/setup';
import * as tenderly from 'utils/tenderly';
import { longTestTimeout, veryLongTestTimeout } from 'utils/config';
import { App } from 'src/app';
import { close } from 'tests/sharedTestSteps/positionManagement';

let app: App;
let vtId: string;
let vtRPC: string;
let walletAddress: string;

const test = testWithSynpress(metaMaskFixtures(baseSetup));

test.describe('Ajna Base Multiply - Wallet connected', async () => {
	test.beforeEach(async ({ metamask, page }) => {
		test.setTimeout(longTestTimeout);

		app = new App(page);
		({ vtId, vtRPC, walletAddress } = await setup({
			metamask,
			app,
			network: 'base',
		}));

		await tenderly.changeAccountOwner({
			account: '0xf71da0973121d949e1cee818eb519ba364406309',
			newOwner: walletAddress,
			vtRPC,
		});
	});

	test.afterEach(async () => {
		await tenderly.deleteFork(vtId);
	});

	test('It should Close to debt an existing Ajna Base Multiply position @regression', async ({
		metamask,
	}) => {
		test.setTimeout(veryLongTestTimeout);

		await app.position.openPage('/base/ajna/multiply/ETH-USDC/435#overview');

		// For avoiding flakiness
		await app.page.waitForTimeout(4_000);

		await close({
			metamask,
			vtId,
			app,
			closeTo: 'debt',
			collateralToken: 'ETH',
			debtToken: 'USDC',
			tokenAmountAfterClosing: '[0-7].[0-9]{4}',
		});
	});

	test('It should Close to collateral an existing Ajna Base Multiply position @regression', async ({
		metamask,
	}) => {
		test.setTimeout(veryLongTestTimeout);

		await app.position.openPage('/base/ajna/multiply/ETH-USDC/435#overview');

		// For avoiding flakiness
		await app.page.waitForTimeout(2_000);

		await close({
			metamask,
			vtId,
			app,
			closeTo: 'collateral',
			collateralToken: 'ETH',
			debtToken: 'USDC',
			tokenAmountAfterClosing: '0.00([0-9]{2})?',
		});
	});
});
