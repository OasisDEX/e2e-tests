import { BrowserContext, test } from '@playwright/test';
import { metamaskSetUp, setup } from 'utils/setup';
import { resetState } from '@synthetixio/synpress/commands/synpress';
import { extremelyLongTestTimeout } from 'utils/config';
import { App } from 'src/app';

let context: BrowserContext;
let app: App;

const walletPK: string = process.env.OLD_WALLET_PK;

test.describe.configure({ mode: 'serial' });

test.describe('Rays - Wallet connected', async () => {
	test.afterAll(async () => {
		await app.page.close();

		await context.close();

		await resetState();
	});

	test('It should claim Rays - Wallet with summer.fi positions @regression', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: '11772',
		});

		test.setTimeout(extremelyLongTestTimeout);

		await test.step('Test setup', async () => {
			({ context } = await metamaskSetUp({ network: 'mainnet' }));
			let page = await context.newPage();
			app = new App(page);

			await setup({
				app,
				network: 'mainnet',
				withoutFork: true,
				withExistingWallet: {
					privateKey: walletPK,
				},
			});
		});

		await app.page.goto('/rays');

		await app.rays.claimRays();

		await app.rays.claimed.shouldBeVisible();
		await app.rays.claimed.shouldHave([
			'Earn more $RAYS',
			'Enable automation to your active positions',
			'Migrate a DeFi position in from elsewhere',
			'Trade using Multiply and Yield Loops',
			'Use more protocols through Summer.fi',
		]);
	});
});
