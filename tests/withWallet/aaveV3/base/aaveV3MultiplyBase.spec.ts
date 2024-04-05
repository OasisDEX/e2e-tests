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

test.describe('Aave v3 Multiply - Base - Wallet connected', async () => {
	test.afterAll(async () => {
		await tenderly.deleteFork(forkId);

		await app.page.close();

		await context.close();

		await resetState();
	});

	test('It should open an Aave v3 Multiply Base position @regression', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: '12463',
		});

		test.setTimeout(extremelyLongTestTimeout);

		await test.step('Test setup', async () => {
			({ context } = await metamaskSetUp({ network: 'base' }));
			let page = await context.newPage();
			app = new App(page);

			({ forkId, walletAddress } = await setup({ app, network: 'base' }));

			await tenderly.setTokenBalance({
				forkId,
				walletAddress,
				network: 'base',
				token: 'CBETH',
				balance: '50',
			});
		});

		await app.page.goto('/base/aave/v3/multiply/cbeth-usdbc');

		await openPosition({
			app,
			forkId,
			deposit: { token: 'CBETH', amount: '14' },
			omni: { network: 'base' },
		});
	});

	// Skip again if DB collision also happeningwith omni
	test('It should adjust risk of an existent Aave V3 Multiply Base position - Up @regression', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: '12465',
		});

		test.setTimeout(longTestTimeout);

		// Pause and reload to avoid random fails
		await app.page.waitForTimeout(3_000);
		await app.page.reload();

		await adjustRisk({
			forkId,
			app,
			risk: 'up',
			newSliderPosition: 0.6,
		});
	});

	// Skip again if DB collision also happeningwith omni
	test('It should adjust risk of an existent Aave V3 Multiply Base position - Down @regression', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: '12464',
		});

		test.setTimeout(longTestTimeout);

		// Pause and reload to avoid random fails
		await app.page.waitForTimeout(3_000);
		await app.page.reload();

		await adjustRisk({
			forkId,
			app,
			risk: 'down',
			newSliderPosition: 0.1,
		});
	});

	// Skip again if DB collision also happeningwith omni
	test('It should close an existent Aave V3 Multiply Base position - Close to debt token (USDBC) @regression', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: '12466',
		});

		test.setTimeout(longTestTimeout);

		// Pause and reload to avoid random fails
		await app.page.waitForTimeout(3_000);
		await app.page.reload();

		await close({
			app,
			forkId,
			positionType: 'Multiply',
			closeTo: 'debt',
			collateralToken: 'CBETH',
			debtToken: 'USDBC',
			tokenAmountAfterClosing: '[0-9]{1,2},[0-9]{3}.[0-9]{1,2}([0-9]{1,2})?',
		});
	});

	test.skip('It should list an opened Aave v3 Multiply Base position in portfolio', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: '12467',
		});

		test.setTimeout(longTestTimeout);

		// await app.page.goto(`/owner/${walletAddress}`);

		// await app.portfolio.multiply.shouldHaveHeaderCount('1');
		// await app.portfolio.multiply.vaults.first.shouldHave({ assets: 'CBETH/USDBC' });
	});

	test.skip('It should open an Aave v3 Multiply Base position from portfolio page', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: '12468',
		});

		test.setTimeout(longTestTimeout);

		// await app.portfolio.multiply.vaults.first.view();
		// await app.position.manage.shouldBeVisible('Manage multiply');
	});
});
