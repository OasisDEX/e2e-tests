import { BrowserContext, test } from '@playwright/test';
import { metamaskSetUp } from 'utils/setup';
import { resetState } from '@synthetixio/synpress/commands/synpress';
import * as tenderly from 'utils/tenderly';
import { setup } from 'utils/setup';
import { extremelyLongTestTimeout, longTestTimeout } from 'utils/config';
import { App } from 'src/app';
import { close, openPosition } from 'tests/sharedTestSteps/positionManagement';

let context: BrowserContext;
let app: App;
let forkId: string;
let walletAddress: string;

test.describe.configure({ mode: 'serial' });

test.describe('Aave V3 Borrow - Optimism - Wallet connected', async () => {
	test.afterAll(async () => {
		await tenderly.deleteFork(forkId);

		await app.page.close();

		await context.close();

		await resetState();
	});

	test('It should open an Aave V3 Borrow Optimism position @regression', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: '12069',
		});

		test.setTimeout(extremelyLongTestTimeout);

		await test.step('Test setup', async () => {
			({ context } = await metamaskSetUp({ network: 'optimism' }));
			let page = await context.newPage();
			app = new App(page);

			({ forkId, walletAddress } = await setup({ app, network: 'optimism' }));

			await tenderly.setTokenBalance({
				forkId,
				walletAddress,
				network: 'optimism',
				token: 'DAI',
				balance: '50000',
			});
		});

		await app.position.openPage('/optimism/aave/v3/borrow/DAI-WBTC#setup');

		await openPosition({
			app,
			forkId,
			deposit: { token: 'DAI', amount: '30000' },
			borrow: { token: 'WBTC', amount: '0.2' },
		});
	});

	test('It should close an existent Aave V3 Borrow Optimism position - Close to debt token (WBTC)', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: '12914',
		});

		test.setTimeout(longTestTimeout);

		await app.page.waitForTimeout(3_000);
		await app.page.reload();

		await close({
			forkId,
			app,
			positionType: 'Borrow',
			closeTo: 'debt',
			collateralToken: 'DAI',
			debtToken: 'WBTC',
			tokenAmountAfterClosing: '0.[0-9]{3,4}',
		});
	});
});
