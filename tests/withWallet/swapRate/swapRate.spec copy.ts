import { BrowserContext, expect, request, test } from '@playwright/test';
import { metamaskSetUp } from 'utils/setup';
import { resetState } from '@synthetixio/synpress/commands/synpress';
import { setup } from 'utils/setup';
import { App } from 'src/app';
import { longTestTimeout } from 'utils/config';

let context: BrowserContext;
let app: App;

test.describe.configure({ mode: 'serial' });

test.describe('Token Swap rate', async () => {
	test.afterAll(async () => {
		await app.page.close();

		await context.close();

		await resetState();
	});

	test(`It should show Swap rate very similar to 1inch's - Openin Aave V3 Mutiply WSTETH-CBETH `, async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: 'xxx',
		});

		test.setTimeout(longTestTimeout);

		await test.step('Test setup', async () => {
			({ context } = await metamaskSetUp({ network: 'mainnet' }));
			let page = await context.newPage();
			app = new App(page);

			await setup({
				app,
				network: 'mainnet',
				withoutFork: true,
			});
		});

		await app.position.openPage('/ethereum/aave/v3/multiply/WSTETH-CBETH#setup');
		await app.position.setup.deposit({ token: 'WSTETH', amount: '10' });
		const summerSwapRate = await app.position.setup.getSwapRate();

		const apiContext = await request.newContext();
		const oneInchResponse = await apiContext.get(`https://api.1inch.dev/swap/v6.0/1/quote`, {
			params: {
				src: '0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0',
				dst: '0xbe9895146f7af43049ca1c1ae358b0541ea49704',
				amount: '1000000000000000000',
			},
			headers: {
				Authorization: `Bearer ${process.env.ONE_INCH_API_KEY}`,
				accept: 'application/json',
			},
		});

		const oneInchResponseJson = await oneInchResponse.json();
		const oneInchSwapRate0 = oneInchResponseJson.dstAmount;
		const oneInchSwapRate = oneInchSwapRate0 / 10 ** 18;

		expect((oneInchSwapRate - summerSwapRate) / oneInchSwapRate).toBeLessThan(0.001);
	});
});
