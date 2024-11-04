import { BrowserContext, test } from '@playwright/test';
import { metamaskSetUp } from 'utils/setup';
import { resetState } from '@synthetixio/synpress/commands/synpress';
import * as tenderly from 'utils/tenderly';
import { setup } from 'utils/setup';
import { extremelyLongTestTimeout, longTestTimeout } from 'utils/config';
import { App } from 'src/app';
import { adjustRisk, close, openPosition } from 'tests/sharedTestSteps/positionManagement';

let context: BrowserContext;
let app: App;
let forkId: string;
let walletAddress: string;

test.describe.configure({ mode: 'serial' });

test.describe('Spark Earn - Wallet connected', async () => {
	test.afterAll(async () => {
		await tenderly.deleteFork(forkId);

		await app.page.close();

		await context.close();

		await resetState();
	});

	test('It should open a Spark Earn (Yiel Loop) position - RETH/ETH @regression', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: '12089',
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
				token: 'RETH',
				balance: '10',
			});
		});

		await app.page.goto('/ethereum/spark/multiply/RETH-ETH#setup');

		await openPosition({
			app,
			forkId,
			deposit: { token: 'RETH', amount: '7.5' },
		});
	});

	test('It should adjust risk of an existent Spark Earn position - Up @regression', async () => {
		test.info().annotations.push(
			{
				type: 'Test case',
				description: '12892',
			},
			{
				type: 'Bug',
				description: '13044',
			}
		);

		test.setTimeout(longTestTimeout);

		await adjustRisk({
			forkId,
			app,
			earnPosition: true,
			risk: 'up',
			newSliderPosition: 0.8,
		});
	});

	test('It should adjust risk of an existent Spark Earn position - Down @regression', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: '12893',
		});

		test.setTimeout(longTestTimeout);

		await adjustRisk({
			forkId,
			app,
			earnPosition: true,
			risk: 'down',
			newSliderPosition: 0.2,
		});
	});

	test('It should close an existent Spark Earn position - Close to collateral token (RETH) @regression', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: '12894',
		});

		test.setTimeout(longTestTimeout);

		// Pause to avoid random fails
		await app.page.waitForTimeout(2_000);

		await close({
			app,
			forkId,
			positionType: 'Earn (Yield Loop)',
			closeTo: 'collateral',
			collateralToken: 'RETH',
			debtToken: 'ETH',
			tokenAmountAfterClosing: '[0-9]{1,2}.[0-9]{1,2}([0-9]{1,2})?',
		});
	});
});
