import { BrowserContext, test } from '@playwright/test';
import { metamaskSetUp, setup } from 'utils/setup';
import { resetState } from '@synthetixio/synpress/commands/synpress';
import { extremelyLongTestTimeout } from 'utils/config';
import { App } from 'src/app';

let context: BrowserContext;
let app: App;

test.describe.configure({ mode: 'serial' });

test.describe('Rays - Wallet connected', async () => {
	test.afterAll(async () => {
		await app.page.close();

		await context.close();

		await resetState();
	});

	test('It should claim Rays - Wallet with no summer.fi positions @regression', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: '11772',
		});

		test.setTimeout(extremelyLongTestTimeout);

		await test.step('Test setup', async () => {
			({ context } = await metamaskSetUp({ network: 'mainnet' }));
			let page = await context.newPage();
			app = new App(page);

			await setup({ app, network: 'mainnet', withoutFork: true });
		});

		await app.page.goto('/rays');

		await app.rays.claimRays();
		await app.rays.openPosition.shouldBeVisible();
		await app.rays.openPosition.openBoostShouldBeVisible();
		await app.rays.openPosition.productPicker.shouldBeVisible();
	});
});
