import { expect, test } from '@playwright/test';

test.describe('API tests - Auto-Buy - Aave V3 - Ethereum', async () => {
	test('Add automation - Valid data', async ({ request }) => {
		// Old test wallet: 0x10649c79428d718621821Cf6299e91920284743F
		// Position link: https://staging.summer.fi/ethereum/aave/v3/multiply/ETH-USDC/1218

		const response = await request.post('/api/triggers/1/aave3/auto-buy', {
			data: {
				action: 'add',
				dpm: '0x16f2c35e062c14f57475de0a466f7e08b03a9c7d',
				position: {
					collateral: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
					debt: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
				},
				protocol: 'aavev3',
				triggerData: {
					executionLTV: '3200',
					maxBaseFee: '300',
					targetLTV: '5000',
					useMaxBuyPrice: false,
				},
			},
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject({
			simulation: {
				executionLTV: '3200',
				targetLTV: '5000',
				collateralAmountAfterExecution: expect.any(String),
				debtAmountAfterExecution: expect.any(String),
				targetLTVWithDeviation: ['4900', '5100'],
				targetMultiple: expect.any(String),
				executionPrice: expect.any(String),
				position: {
					hasStablecoinDebt: true,
					ltv: expect.any(String),
					collateral: {
						balance: expect.any(String),
						token: {
							decimals: 18,
							symbol: 'WETH',
							address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
						},
					},
					debt: {
						balance: expect.any(String),
						token: {
							decimals: 6,
							symbol: 'USDC',
							address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
						},
					},
					address: '0x16F2C35E062C14F57475dE0A466F7E08b03A9C7D',
					oraclePrices: {
						collateralPrice: expect.any(String),
						debtPrice: expect.any(String),
					},
					collateralPriceInDebt: expect.any(String),
					netValueUSD: expect.any(String),
					debtValueUSD: expect.any(String),
					collateralValueUSD: expect.any(String),
				},
			},
			transaction: {
				to: '0x16F2C35E062C14F57475dE0A466F7E08b03A9C7D',
				data: expect.any(String),
				triggerTxData: expect.any(String),
			},
			encodedTriggerData: expect.any(String),
			warnings: [
				{
					message: 'Auto buy with no max price threshold',
					code: 'auto-buy-with-no-max-price-threshold',
					path: [],
				},
			],
		});
	});

	test('Add automation - Without "dpm"', async ({ request }) => {
		// Old test wallet: 0x10649c79428d718621821Cf6299e91920284743F
		// Position link: https://staging.summer.fi/ethereum/aave/v3/multiply/ETH-USDC/1218

		const response = await request.post('/api/triggers/1/aave3/auto-buy', {
			data: {
				action: 'add',
				// dpm: '0x16f2c35e062c14f57475de0a466f7e08b03a9c7d',
				position: {
					collateral: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
					debt: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
				},
				protocol: 'aavev3',
				triggerData: {
					executionLTV: '3200',
					maxBaseFee: '300',
					targetLTV: '5000',
					useMaxBuyPrice: false,
				},
			},
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject({
			message: 'Validation Errors',
			errors: [
				{
					message: 'Invalid address format',
					path: ['dpm'],
				},
			],
			warnings: [],
		});
	});

	test('Add automation - Without "position"', async ({ request }) => {
		// Old test wallet: 0x10649c79428d718621821Cf6299e91920284743F
		// Position link: https://staging.summer.fi/ethereum/aave/v3/multiply/ETH-USDC/1218

		const response = await request.post('/api/triggers/1/aave3/auto-buy', {
			data: {
				action: 'add',
				dpm: '0x16f2c35e062c14f57475de0a466f7e08b03a9c7d',
				// position: {
				// 	collateral: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
				// 	debt: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
				// },
				protocol: 'aavev3',
				triggerData: {
					executionLTV: '3200',
					maxBaseFee: '300',
					targetLTV: '5000',
					useMaxBuyPrice: false,
				},
			},
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject({
			message: 'Validation Errors',
			errors: [
				{
					message: 'Required',
					code: 'invalid_type',
					path: ['position'],
				},
			],
			warnings: [],
		});
	});

	test('Add automation - Without "collateral (position)"', async ({ request }) => {
		// Old test wallet: 0x10649c79428d718621821Cf6299e91920284743F
		// Position link: https://staging.summer.fi/ethereum/aave/v3/multiply/ETH-USDC/1218

		const response = await request.post('/api/triggers/1/aave3/auto-buy', {
			data: {
				action: 'add',
				dpm: '0x16f2c35e062c14f57475de0a466f7e08b03a9c7d',
				position: {
					// collateral: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
					debt: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
				},
				protocol: 'aavev3',
				triggerData: {
					executionLTV: '3200',
					maxBaseFee: '300',
					targetLTV: '5000',
					useMaxBuyPrice: false,
				},
			},
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject({
			message: 'Validation Errors',
			errors: [
				{
					message: 'Invalid address format',
					path: ['position', 'collateral'],
				},
			],
			warnings: [],
		});
	});

	test('Add automation - Without "debt (position)"', async ({ request }) => {
		// Old test wallet: 0x10649c79428d718621821Cf6299e91920284743F
		// Position link: https://staging.summer.fi/ethereum/aave/v3/multiply/ETH-USDC/1218

		const response = await request.post('/api/triggers/1/aave3/auto-buy', {
			data: {
				action: 'add',
				dpm: '0x16f2c35e062c14f57475de0a466f7e08b03a9c7d',
				position: {
					collateral: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
					// debt: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
				},
				protocol: 'aavev3',
				triggerData: {
					executionLTV: '3200',
					maxBaseFee: '300',
					targetLTV: '5000',
					useMaxBuyPrice: false,
				},
			},
		});

		const respJSON = await response.json();

		console.log('RESPJSON: ', respJSON);
		console.log('RESPJSON: ', respJSON.errors[0].path);

		expect(respJSON).toMatchObject({
			message: 'Validation Errors',
			errors: [
				{
					message: 'Invalid address format',
					path: ['position', 'debt'],
				},
			],
			warnings: [],
		});
	});
});
