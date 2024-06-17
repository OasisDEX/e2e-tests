import { BrowserContext, test } from '@playwright/test';
import { metamaskSetUp } from 'utils/setup';
import { resetState } from '@synthetixio/synpress/commands/synpress';
import * as tenderly from 'utils/tenderly';
import { setup } from 'utils/setup';
import { extremelyLongTestTimeout, longTestTimeout, positionTimeout } from 'utils/config';
import { App } from 'src/app';
import { adjustRisk, openPosition } from 'tests/sharedTestSteps/positionManagement';
import { reloadUntilCorrect } from 'utils/general';

let context: BrowserContext;
let app: App;
let forkId: string;
let walletAddress: string;

test.describe.configure({ mode: 'serial' });

test.describe('Aave V3 Earn - Ethereum - Wallet connected', async () => {
	test.afterAll(async () => {
		await tenderly.deleteFork(forkId);

		await app.page.close();

		await context.close();

		await resetState();
	});

	test('It should open an Aave V3 Earn Ethereum position @regression', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: '11672',
		});

		test.setTimeout(extremelyLongTestTimeout);

		await test.step('Test setup', async () => {
			({ context } = await metamaskSetUp({ network: 'mainnet' }));
			let page = await context.newPage();
			app = new App(page);

			({ forkId, walletAddress } = await setup({ app, network: 'mainnet' }));

			await tenderly.setTokenBalance({
				forkId,
				walletAddress,
				network: 'mainnet',
				token: 'WSTETH',
				balance: '50',
			});
		});

		await app.position.openPage('/ethereum/aave/v3/earn/wsteth-eth#simulate');

		await openPosition({
			app,
			forkId,
			deposit: { token: 'ETH', amount: '10' },
		});
	});

	test('It should adjust risk of an existing Aave V3 Earn Ethereum position - Up', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: '13060',
		});

		test.setTimeout(longTestTimeout);

		// Pause and reload to avoid random fails
		await app.page.waitForTimeout(3_000);
		await reloadUntilCorrect(app);

		await adjustRisk({
			forkId,
			app,
			earnPosition: true,
			risk: 'up',
			newSliderPosition: 0.8,
		});
	});
});
