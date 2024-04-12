import { BrowserContext, test } from '@playwright/test';
import { metamaskSetUp, setupNewFork } from 'utils/setup';
import { resetState } from '@synthetixio/synpress/commands/synpress';
import * as tenderly from 'utils/tenderly';
import { setup } from 'utils/setup';
import { extremelyLongTestTimeout, longTestTimeout, veryLongTestTimeout } from 'utils/config';
import { App } from 'src/app';
import { adjustRisk, close, openPosition } from 'tests/sharedTestSteps/positionManagement';

let context: BrowserContext;
let app: App;
let forkId: string;
let walletAddress: string;

test.describe.configure({ mode: 'serial' });

test.describe('Aave v3 Multiply - Ethereum - Wallet connected', async () => {
	test.afterAll(async () => {
		await tenderly.deleteFork(forkId);

		await app.page.close();

		await context.close();

		await resetState();
	});

	test('It should open an Aave v3 Multiply Ethereum position @regression', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: '11769',
		});

		test.setTimeout(extremelyLongTestTimeout);

		await test.step('Test setup', async () => {
			({ context } = await metamaskSetUp({ network: 'mainnet' }));
			let page = await context.newPage();
			app = new App(page);

			({ forkId, walletAddress } = await setup({ app, network: 'mainnet' }));

			await tenderly.setTokenBalance({
				forkId,
				network: 'mainnet',
				walletAddress,
				token: 'DAI',
				balance: '30000',
			});
		});

		await app.page.goto('/ethereum/aave/v3/multiply/dai-wbtc');

		await openPosition({
			app,
			forkId,
			deposit: { token: 'DAI', amount: '15000.1234' },
		});
	});

	// SKIP if DB collision still hapenning with omni
	test('It should close an existent Aave V3 Multiply Ethereum position - Close to debt token (WBTC) @regression', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: '12057',
		});

		test.setTimeout(longTestTimeout);

		await close({
			forkId,
			app,
			closeTo: 'debt',
			collateralToken: 'DAI',
			debtToken: 'WBTC',
			tokenAmountAfterClosing: '[0-1].[0-9]{3,4}',
		});
	});

	// SKIP if DB collision still hapenning with omni
	test('It should adjust risk of an existent Aave V3 Multiply Ethereum position - Up @regression', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: '12055',
		});

		test.setTimeout(veryLongTestTimeout);

		await tenderly.changeAccountOwner({
			account: '0x16f2c35e062c14f57475de0a466f7e08b03a9c7d',
			newOwner: walletAddress,
			forkId,
		});

		await app.page.goto('/ethereum/aave/v3/multiply/ETH-USDC/1218#overview');

		await adjustRisk({
			forkId,
			app,
			risk: 'up',
			newSliderPosition: 0.9,
		});
	});

	// SKIP if DB collision still hapenning with omni
	test('It should adjust risk of an existent Aave V3 Multiply Ethereum position - Down @regression', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: '12056',
		});

		test.setTimeout(veryLongTestTimeout);
		// New fork needed to be able to close a Multiply position
		await test.step('Test setup - New fork', async () => {
			({ forkId } = await setupNewFork({ app, network: 'mainnet' }));
		});

		await tenderly.changeAccountOwner({
			account: '0x16f2c35e062c14f57475de0a466f7e08b03a9c7d',
			newOwner: walletAddress,
			forkId,
		});

		await app.page.goto('/ethereum/aave/v3/multiply/ETH-USDC/1218#overview');

		await adjustRisk({
			forkId,
			app,
			risk: 'down',
			newSliderPosition: 0.05,
		});
	});

	test.skip('It should list an opened Aave v3 Multiply Ethereum position in portfolio', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: '11770',
		});

		test.setTimeout(veryLongTestTimeout);

		// await app.page.goto(`/owner/${walletAddress}`);

		// await app.portfolio.multiply.shouldHaveHeaderCount('1');
		// await app.portfolio.vaults.first.shouldHave({ assets: 'DAI/WBTC' });
	});

	test.skip('It should open an Aave v3 Multiply Ethereum position from portfolio page', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: '11771',
		});

		test.setTimeout(veryLongTestTimeout);

		// await app.portfolio.multiply.vaults.first.view();
		// await app.position.manage.shouldBeVisible('Manage multiply');
	});
});
