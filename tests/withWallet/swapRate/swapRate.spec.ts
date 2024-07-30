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

	test(`It should show Swap rate very similar to 1inch's - Opening Aave V3 Earn WSTETH-CBETH`, async () => {
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

		let summerSwapRate: number;

		await expect(async () => {
			await app.position.openPage('/ethereum/aave/v3/multiply/WSTETH-CBETH#setup');

			// Wait for 2 seconds before depositing to avoid random fails
			await app.page.waitForTimeout(2_000);

			await app.position.setup.deposit({ token: 'WSTETH', amount: '10' });
			summerSwapRate = await app.position.setup.getSwapRate();

			expect(summerSwapRate).toBeGreaterThan(0);
		}).toPass();

		const apiContext = await request.newContext();
		let oneInchSwapRate0: number;

		await expect(async () => {
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
			oneInchSwapRate0 = oneInchResponseJson.dstAmount;
			expect(oneInchSwapRate0).toBeDefined();
		}).toPass();

		const oneInchSwapRate = oneInchSwapRate0 / 10 ** 18;

		// Logs for debugiing purposes
		console.log('summerSwapRate: ', summerSwapRate);
		console.log('oneInchSwapRate: ', oneInchSwapRate);

		expect((oneInchSwapRate - summerSwapRate) / oneInchSwapRate).toBeLessThan(0.001);
	});

	test(`It should show Swap rate very similar to 1inch's - Opening Aave V3 Mutiply ETH-USDC`, async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: 'xxx',
		});

		let summerSwapRate: number;

		await expect(async () => {
			await app.position.openPage('/ethereum/aave/v3/multiply/ETH-USDC#setup');

			// Wait for 2 seconds before depositing to avoid random fails
			await app.page.waitForTimeout(2_000);

			await app.position.setup.deposit({ token: 'ETH', amount: '10' });
			summerSwapRate = await app.position.setup.getSwapRate();

			expect(summerSwapRate).toBeGreaterThan(0);
		}).toPass();

		const apiContext = await request.newContext();
		let oneInchSwapRate0: number;

		await expect(async () => {
			const oneInchResponse = await apiContext.get(`https://api.1inch.dev/swap/v6.0/1/quote`, {
				params: {
					src: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
					dst: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
					amount: '1000000000000000000',
				},
				headers: {
					Authorization: `Bearer ${process.env.ONE_INCH_API_KEY}`,
					accept: 'application/json',
				},
			});

			const oneInchResponseJson = await oneInchResponse.json();
			oneInchSwapRate0 = oneInchResponseJson.dstAmount;
			expect(oneInchSwapRate0).toBeDefined();
		}).toPass();

		const oneInchSwapRate = oneInchSwapRate0 / 10 ** 18;

		// Logs for debugiing purposes
		console.log('summerSwapRate: ', summerSwapRate);
		console.log('oneInchSwapRate: ', oneInchSwapRate);

		expect((oneInchSwapRate - summerSwapRate) / oneInchSwapRate).toBeLessThan(0.001);
	});
});
