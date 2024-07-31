import { BrowserContext, expect, request, test } from '@playwright/test';
import { resetState } from '@synthetixio/synpress/commands/synpress';
import { App } from 'src/app';
import { longTestTimeout } from 'utils/config';
import { metamaskSetUp, setup } from 'utils/setup';
import { tokenAddresses } from 'utils/tenderly';
import { depositAmount, tokenDecimals } from 'utils/testData';

export const compareTokenSwapRate = async ({
	network,
	protocol,
	pool,
	positionType,
}: {
	network: 'arbitrum' | 'base' | 'ethereum' | 'optimism';
	protocol: 'aave/v2' | 'aave/v3' | 'erc-4626' | 'morphoblue' | 'spark';
	pool: string;
	positionType: 'borrow' | 'earn' | 'multiply';
}) => {
	let context: BrowserContext;
	let app: App;

	test.describe(`Token Swap Rate - ${network}/${protocol}/`, async () => {
		test.afterAll(async () => {
			await app.page.close();

			await context.close();

			await resetState();
		});

		test(`It should use Swap rate very similar to 1inch's - Opening position - ${positionType.toUpperCase()} - ${pool}`, async () => {
			test.info().annotations.push({
				type: 'Test case',
				description: 'xxx',
			});

			test.setTimeout(longTestTimeout);

			let summerTokenSwapRate: number;

			const collToken: string =
				pool.split('-')[
					(network === 'ethereum' &&
						protocol === 'aave/v3' &&
						pool === 'WSTETH-ETH' &&
						positionType !== 'borrow') ||
					pool.includes('flagship') ||
					pool.includes('steakhouse')
						? 1
						: 0
				];
			const collTokenAddress =
				network === 'ethereum' && collToken === 'ETH'
					? '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2'
					: tokenAddresses[network === 'ethereum' ? 'mainnet' : network][
							collToken === 'USDC.E' ? 'USDC_E' : collToken
					  ];

			const debtToken: string = pool.split('-')[1];
			const debtTokenAddress =
				network === 'ethereum' && debtToken === 'ETH'
					? '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2'
					: tokenAddresses[network === 'ethereum' ? 'mainnet' : network][
							debtToken === 'USDC.E' ? 'USDC_E' : debtToken
					  ];

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

			await expect(async () => {
				await app.position.openPage(`/${network}/${protocol}/${positionType}/${pool}#setup`);

				// Wait for 2 seconds before depositing to avoid random fails
				await app.page.waitForTimeout(2_000);

				await app.position.setup.deposit({
					token: collToken,
					amount: depositAmount[collToken === 'USDC.E' ? 'USDC_E' : collToken],
				});
				summerTokenSwapRate = await app.position.setup.getTokenSwapRate();

				expect(summerTokenSwapRate).toBeGreaterThan(0);
			}).toPass();

			const apiContext = await request.newContext();
			let oneInchTokenSwapRate0: number;

			await expect(async () => {
				const oneInchResponse = await apiContext.get(`https://api.1inch.dev/swap/v6.0/1/quote`, {
					params: {
						src: collTokenAddress,
						dst: debtTokenAddress,
						amount: tokenDecimals[collToken].toString(),
					},
					headers: {
						Authorization: `Bearer ${process.env.ONE_INCH_API_KEY}`,
						accept: 'application/json',
					},
				});

				const oneInchResponseJson = await oneInchResponse.json();
				oneInchTokenSwapRate0 = oneInchResponseJson.dstAmount;
				expect(oneInchTokenSwapRate0).toBeDefined();
			}).toPass();

			const oneInchTokenSwapRate = oneInchTokenSwapRate0 / tokenDecimals[collToken];

			// Logs for debugiing purposes
			console.log('summerTokenSwapRate: ', summerTokenSwapRate);
			console.log('oneInchTokenSwapRate: ', oneInchTokenSwapRate);

			expect((oneInchTokenSwapRate - summerTokenSwapRate) / oneInchTokenSwapRate).toBeLessThan(
				0.001
			);
		});
	});
};
