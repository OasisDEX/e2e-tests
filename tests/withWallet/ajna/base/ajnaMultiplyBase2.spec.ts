import { BrowserContext, test } from '@playwright/test';
import { metamaskSetUp, setupNewFork } from 'utils/setup';
import { resetState } from '@synthetixio/synpress/commands/synpress';
import * as tenderly from 'utils/tenderly';
import { setup } from 'utils/setup';
import { extremelyLongTestTimeout, veryLongTestTimeout } from 'utils/config';
import { App } from 'src/app';
import { close } from 'tests/sharedTestSteps/positionManagement';

let context: BrowserContext;
let app: App;
let forkId: string;
let walletAddress: string;

test.describe.configure({ mode: 'serial' });

test.describe('Ajna Base Multiply - Wallet connected', async () => {
	test.afterAll(async () => {
		await tenderly.deleteFork(forkId);

		await app.page.close();

		await context.close();

		await resetState();
	});

	test('It should Close to debt an existing Ajna Base Multiply position @regression', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: 'xxxx',
		});

		test.setTimeout(extremelyLongTestTimeout);

		await test.step('Test setup', async () => {
			({ context } = await metamaskSetUp({ network: 'base' }));
			let page = await context.newPage();
			app = new App(page);

			({ forkId, walletAddress } = await setup({ app, network: 'base' }));
		});

		await tenderly.changeAccountOwner({
			account: '0xf71da0973121d949e1cee818eb519ba364406309',
			newOwner: walletAddress,
			forkId,
		});

		await app.position.openPage('/base/ajna/multiply/ETH-USDC/435#overview');

		await close({
			forkId,
			app,
			closeTo: 'debt',
			collateralToken: 'ETH',
			debtToken: 'USDC',
			tokenAmountAfterClosing: '[1-7].[0-9]{4}',
		});
	});

	test('It should Close to collateral an existing Ajna Base Multiply position @regression', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: 'xxxx',
		});

		test.setTimeout(veryLongTestTimeout);

		// New fork needed to be able to close a Multiply position
		await test.step('Test setup - New fork', async () => {
			({ forkId } = await setupNewFork({ app, network: 'base' }));
		});

		await tenderly.changeAccountOwner({
			account: '0xf71da0973121d949e1cee818eb519ba364406309',
			newOwner: walletAddress,
			forkId,
		});

		await app.position.openPage('/base/ajna/multiply/ETH-USDC/435#overview');

		await close({
			forkId,
			app,
			closeTo: 'collateral',
			collateralToken: 'ETH',
			debtToken: 'USDC',
			tokenAmountAfterClosing: '0.00[0-9]{2}',
		});
	});
});
