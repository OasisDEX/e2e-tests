import { BrowserContext, test } from '@playwright/test';
import { resetState } from '@synthetixio/synpress/commands/synpress';
import { metamaskSetUp } from 'utils/setup';
import * as tenderly from 'utils/tenderly';
import { setup } from 'utils/setup';
import { extremelyLongTestTimeout } from 'utils/config';
import { App } from 'src/app';
import { openMakerPosition, swapPosition } from 'tests/sharedTestSteps/positionManagement';

let context: BrowserContext;
let app: App;
let forkId: string;

test.describe.configure({ mode: 'serial' });

test.describe('Maker Multiply - Swap to Aave V3', async () => {
	test.afterAll(async () => {
		await tenderly.deleteFork(forkId);

		await app.page.close();

		await context.close();

		await resetState();
	});

	test.use({
		viewport: { width: 1400, height: 720 },
	});

	// Create a Maker position as part of the Swap tests setup
	test('Test setup - Open Maker Borrow ETH-C/DAI position', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: '11788, 11790',
		});

		test.setTimeout(extremelyLongTestTimeout);

		await test.step('Test setup', async () => {
			({ context } = await metamaskSetUp({ network: 'mainnet' }));
			let page = await context.newPage();
			app = new App(page);

			({ forkId } = await setup({
				app,
				network: 'mainnet',
				extraFeaturesFlags: 'MakerTenderly:true',
			}));
		});

		await app.position.openPage('/vaults/open/ETH-C', { positionType: 'Maker' });

		// Depositing collateral too quickly after loading page returns wrong simulation results
		await app.position.overview.waitForComponentToBeStable({ positionType: 'Maker' });

		await openMakerPosition({
			app,
			forkId,
			deposit: { token: 'ETH', amount: '5' },
			generate: { token: 'DAI', amount: '3700' },
		});
	});

	test('It should swap a Maker Borrow position (ETH-C/DAI) to Aave V3 Multiply (ETH/DAI)', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: 'xxx',
		});

		test.setTimeout(extremelyLongTestTimeout);

		// Wait an reload to avoid flakiness
		const positionPage = app.page.url();
		await app.position.openPage(positionPage, { tab: 'Overview' });
		await app.position.manage.shouldBeVisible('Manage your vault');

		await swapPosition({
			app,
			forkId,
			reason: 'Switch to higher max Loan To Value',
			originalProtocol: 'Maker',
			targetProtocol: 'Aave V3',
			targetPool: { colToken: 'ETH', debtToken: 'DAI' },
			verifyPositions: {
				originalPosition: { type: 'Borrow', collateralToken: 'ETH', debtToken: 'DAI' },
				targetPosition: {
					exposure: { amount: '[0-9].[0-9]{2}', token: 'ETH' },
					debt: { amount: '[0-9],[0-9]{3}.[0-9]{2}', token: 'DAI' },
				},
			},
		});
	});
});
