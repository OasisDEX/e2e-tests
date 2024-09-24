import { BrowserContext, test } from '@playwright/test';
import { resetState } from '@synthetixio/synpress/commands/synpress';
import * as tenderly from 'utils/tenderly';
import { expect, metamaskSetUp } from 'utils/setup';
import { setup } from 'utils/setup';
import { extremelyLongTestTimeout } from 'utils/config';
import { App } from 'src/app';
import { openMakerPosition } from 'tests/sharedTestSteps/positionManagement';

let context: BrowserContext;
let app: App;
let forkId: string;
let walletAddress: string;

test.describe.configure({ mode: 'serial' });

test.describe('Maker Multiply - Wallet connected', async () => {
	test.afterAll(async () => {
		await tenderly.deleteFork(forkId);

		await app.page.close();

		await context.close();

		await resetState();
	});

	test('Test setup - Open Maker Mutiply position', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: 'xxx',
		});

		test.setTimeout(extremelyLongTestTimeout);

		await test.step('Test setup', async () => {
			({ context } = await metamaskSetUp({ network: 'mainnet' }));
			let page = await context.newPage();
			app = new App(page);

			({ forkId, walletAddress } = await setup({
				app,
				network: 'mainnet',
				extraFeaturesFlags: 'MakerTenderly:true',
			}));

			await tenderly.setTokenBalance({
				forkId,
				walletAddress,
				network: 'mainnet',
				token: 'WSTETH',
				balance: '200',
			});
		});

		await app.position.openPage('/vaults/open-multiply/WSTETH-B', { positionType: 'Maker' });

		// Depositing collateral too quickly after loading page returns wrong simulation results
		await app.position.overview.waitForComponentToBeStable({ positionType: 'Maker' });

		await openMakerPosition({
			app,
			forkId,
			deposit: { token: 'WSTETH', amount: '50' },
			adjustRisk: { value: 0.35 },
		});
	});

	(['UP', 'DOWN'] as const).forEach((adjustment) => {
		test(`It should have Price Impact lower than 1% when adjusting risk - ${adjustment}`, async () => {
			test.info().annotations.push({
				type: 'Test case',
				description: 'xxx',
			});

			if (adjustment === 'DOWN') {
				await app.page.reload();
			}

			await app.position.setup.moveSlider({
				protocol: 'Maker',
				value: adjustment === 'UP' ? 0.6 : 0.2,
			});

			await expect(async () => {
				const priceImpact = await app.position.setup.getPriceImpact();
				expect(priceImpact).toBeGreaterThan(0);
				expect(priceImpact).toBeLessThan(1.5);
			}).toPass();
		});
	});

	test('It should have Price Impact lower than 1% when closing position', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: 'xxx',
		});

		await app.page.reload();

		await app.position.manage.openManageOptions({ currentLabel: 'Adjust' });
		await app.position.manage.select('Close vault');

		await expect(async () => {
			const priceImpact = await app.position.setup.getPriceImpact();

			expect(priceImpact).toBeGreaterThan(0);
			expect(priceImpact).toBeLessThan(1.5);
		}).toPass();
	});
});
