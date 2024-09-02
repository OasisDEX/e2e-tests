import { expect } from '#noWalletFixtures';

export const responses = {
	autoBuyWithoutMaxBuyPrice: {
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
	},
	autoSellWithoutMinSellPrice: {
		simulation: {
			executionLTV: '4600',
			targetLTV: '3800',
			collateralAmountAfterExecution: expect.any(String),
			debtAmountAfterExecution: expect.any(String),
			targetLTVWithDeviation: ['3700', '3900'],
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
				message: 'No min sell price',
				code: 'auto-sell-with-no-min-price-threshold',
				path: ['triggerData', 'minSellPrice'],
			},
		],
	},
	stopLoss: {
		simulation: {},
		transaction: {
			to: '0x16F2C35E062C14F57475dE0A466F7E08b03A9C7D',
			data: expect.any(String),
			triggerTxData: expect.any(String),
		},
		encodedTriggerData: expect.any(String),
		warnings: [],
	},
	trailingStopLoss: {
		simulation: {
			latestPrice: {
				tokenRoundId: expect.any(String),
				denominationRoundId: expect.any(String),
				token: {
					id: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
					symbol: 'WETH',
					oraclesToken: [
						{
							address: '0x5f4ec3df9cbd43714fe2740f5e3616155c5b8419',
						},
					],
				},
				denomination: {
					id: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
					symbol: 'USDC',
					oraclesToken: [
						{
							address: '0x8fffffd4afb6115b954bd326cbe7b4ba576818f6',
						},
					],
				},
				derivedPrice: expect.any(String),
			},
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
			executionParams: {
				executionPrice: expect.any(String),
				dynamicExecutionLTV: expect.any(String),
			},
		},
		transaction: {
			to: '0x16F2C35E062C14F57475dE0A466F7E08b03A9C7D',
			data: expect.any(String),
			triggerTxData: expect.any(String),
		},
		encodedTriggerData: expect.any(String),
		warnings: [],
	},
	autoTakeProfit: {
		simulation: {
			profits: [
				{
					triggerPrice: expect.any(String),
					realizedProfitInCollateral: {
						balance: expect.any(String),
						token: {
							decimals: 18,
							symbol: 'WETH',
							address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
						},
					},
					realizedProfitInDebt: {
						balance: expect.any(String),
						token: {
							decimals: 6,
							symbol: 'USDC',
							address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
						},
					},
					totalProfitInCollateral: {
						balance: expect.any(String),
						token: {
							decimals: 18,
							symbol: 'WETH',
							address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
						},
					},
					totalProfitInDebt: {
						balance: expect.any(String),
						token: {
							decimals: 6,
							symbol: 'USDC',
							address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
						},
					},
					stopLossDynamicPrice: expect.any(String),
					fee: {
						balance: expect.any(String),
						token: {
							decimals: 18,
							symbol: 'WETH',
							address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
						},
					},
					totalFee: {
						balance: expect.any(String),
						token: {
							decimals: 18,
							symbol: 'WETH',
							address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
						},
					},
				},
				{
					triggerPrice: expect.any(String),
					realizedProfitInCollateral: {
						balance: expect.any(String),
						token: {
							decimals: 18,
							symbol: 'WETH',
							address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
						},
					},
					realizedProfitInDebt: {
						balance: expect.any(String),
						token: {
							decimals: 6,
							symbol: 'USDC',
							address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
						},
					},
					totalProfitInCollateral: {
						balance: expect.any(String),
						token: {
							decimals: 18,
							symbol: 'WETH',
							address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
						},
					},
					totalProfitInDebt: {
						balance: expect.any(String),
						token: {
							decimals: 6,
							symbol: 'USDC',
							address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
						},
					},
					stopLossDynamicPrice: expect.any(String),
					fee: {
						balance: expect.any(String),
						token: {
							decimals: 18,
							symbol: 'WETH',
							address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
						},
					},
					totalFee: {
						balance: expect.any(String),
						token: {
							decimals: 18,
							symbol: 'WETH',
							address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
						},
					},
				},
				{
					triggerPrice: expect.any(String),
					realizedProfitInCollateral: {
						balance: expect.any(String),
						token: {
							decimals: 18,
							symbol: 'WETH',
							address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
						},
					},
					realizedProfitInDebt: {
						balance: expect.any(String),
						token: {
							decimals: 6,
							symbol: 'USDC',
							address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
						},
					},
					totalProfitInCollateral: {
						balance: expect.any(String),
						token: {
							decimals: 18,
							symbol: 'WETH',
							address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
						},
					},
					totalProfitInDebt: {
						balance: expect.any(String),
						token: {
							decimals: 6,
							symbol: 'USDC',
							address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
						},
					},
					stopLossDynamicPrice: expect.any(String),
					fee: {
						balance: expect.any(String),
						token: {
							decimals: 18,
							symbol: 'WETH',
							address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
						},
					},
					totalFee: {
						balance: expect.any(String),
						token: {
							decimals: 18,
							symbol: 'WETH',
							address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
						},
					},
				},
				{
					triggerPrice: expect.any(String),
					realizedProfitInCollateral: {
						balance: expect.any(String),
						token: {
							decimals: 18,
							symbol: 'WETH',
							address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
						},
					},
					realizedProfitInDebt: {
						balance: expect.any(String),
						token: {
							decimals: 6,
							symbol: 'USDC',
							address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
						},
					},
					totalProfitInCollateral: {
						balance: expect.any(String),
						token: {
							decimals: 18,
							symbol: 'WETH',
							address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
						},
					},
					totalProfitInDebt: {
						balance: expect.any(String),
						token: {
							decimals: 6,
							symbol: 'USDC',
							address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
						},
					},
					stopLossDynamicPrice: expect.any(String),
					fee: {
						balance: expect.any(String),
						token: {
							decimals: 18,
							symbol: 'WETH',
							address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
						},
					},
					totalFee: {
						balance: expect.any(String),
						token: {
							decimals: 18,
							symbol: 'WETH',
							address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
						},
					},
				},
				{
					triggerPrice: expect.any(String),
					realizedProfitInCollateral: {
						balance: expect.any(String),
						token: {
							decimals: 18,
							symbol: 'WETH',
							address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
						},
					},
					realizedProfitInDebt: {
						balance: expect.any(String),
						token: {
							decimals: 6,
							symbol: 'USDC',
							address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
						},
					},
					totalProfitInCollateral: {
						balance: expect.any(String),
						token: {
							decimals: 18,
							symbol: 'WETH',
							address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
						},
					},
					totalProfitInDebt: {
						balance: expect.any(String),
						token: {
							decimals: 6,
							symbol: 'USDC',
							address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
						},
					},
					stopLossDynamicPrice: expect.any(String),
					fee: {
						balance: expect.any(String),
						token: {
							decimals: 18,
							symbol: 'WETH',
							address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
						},
					},
					totalFee: {
						balance: expect.any(String),
						token: {
							decimals: 18,
							symbol: 'WETH',
							address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
						},
					},
				},
				{
					triggerPrice: expect.any(String),
					realizedProfitInCollateral: {
						balance: expect.any(String),
						token: {
							decimals: 18,
							symbol: 'WETH',
							address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
						},
					},
					realizedProfitInDebt: {
						balance: expect.any(String),
						token: {
							decimals: 6,
							symbol: 'USDC',
							address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
						},
					},
					totalProfitInCollateral: {
						balance: expect.any(String),
						token: {
							decimals: 18,
							symbol: 'WETH',
							address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
						},
					},
					totalProfitInDebt: {
						balance: expect.any(String),
						token: {
							decimals: 6,
							symbol: 'USDC',
							address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
						},
					},
					stopLossDynamicPrice: expect.any(String),
					fee: {
						balance: expect.any(String),
						token: {
							decimals: 18,
							symbol: 'WETH',
							address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
						},
					},
					totalFee: {
						balance: expect.any(String),
						token: {
							decimals: 18,
							symbol: 'WETH',
							address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
						},
					},
				},
				{
					triggerPrice: expect.any(String),
					realizedProfitInCollateral: {
						balance: expect.any(String),
						token: {
							decimals: 18,
							symbol: 'WETH',
							address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
						},
					},
					realizedProfitInDebt: {
						balance: expect.any(String),
						token: {
							decimals: 6,
							symbol: 'USDC',
							address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
						},
					},
					totalProfitInCollateral: {
						balance: expect.any(String),
						token: {
							decimals: 18,
							symbol: 'WETH',
							address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
						},
					},
					totalProfitInDebt: {
						balance: expect.any(String),
						token: {
							decimals: 6,
							symbol: 'USDC',
							address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
						},
					},
					stopLossDynamicPrice: expect.any(String),
					fee: {
						balance: expect.any(String),
						token: {
							decimals: 18,
							symbol: 'WETH',
							address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
						},
					},
					totalFee: {
						balance: expect.any(String),
						token: {
							decimals: 18,
							symbol: 'WETH',
							address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
						},
					},
				},
				{
					triggerPrice: expect.any(String),
					realizedProfitInCollateral: {
						balance: expect.any(String),
						token: {
							decimals: 18,
							symbol: 'WETH',
							address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
						},
					},
					realizedProfitInDebt: {
						balance: expect.any(String),
						token: {
							decimals: 6,
							symbol: 'USDC',
							address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
						},
					},
					totalProfitInCollateral: {
						balance: expect.any(String),
						token: {
							decimals: 18,
							symbol: 'WETH',
							address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
						},
					},
					totalProfitInDebt: {
						balance: expect.any(String),
						token: {
							decimals: 6,
							symbol: 'USDC',
							address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
						},
					},
					stopLossDynamicPrice: expect.any(String),
					fee: {
						balance: expect.any(String),
						token: {
							decimals: 18,
							symbol: 'WETH',
							address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
						},
					},
					totalFee: {
						balance: expect.any(String),
						token: {
							decimals: 18,
							symbol: 'WETH',
							address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
						},
					},
				},
				{
					triggerPrice: expect.any(String),
					realizedProfitInCollateral: {
						balance: expect.any(String),
						token: {
							decimals: 18,
							symbol: 'WETH',
							address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
						},
					},
					realizedProfitInDebt: {
						balance: expect.any(String),
						token: {
							decimals: 6,
							symbol: 'USDC',
							address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
						},
					},
					totalProfitInCollateral: {
						balance: expect.any(String),
						token: {
							decimals: 18,
							symbol: 'WETH',
							address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
						},
					},
					totalProfitInDebt: {
						balance: expect.any(String),
						token: {
							decimals: 6,
							symbol: 'USDC',
							address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
						},
					},
					stopLossDynamicPrice: expect.any(String),
					fee: {
						balance: expect.any(String),
						token: {
							decimals: 18,
							symbol: 'WETH',
							address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
						},
					},
					totalFee: {
						balance: expect.any(String),
						token: {
							decimals: 18,
							symbol: 'WETH',
							address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
						},
					},
				},
				{
					triggerPrice: expect.any(String),
					realizedProfitInCollateral: {
						balance: expect.any(String),
						token: {
							decimals: 18,
							symbol: 'WETH',
							address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
						},
					},
					realizedProfitInDebt: {
						balance: expect.any(String),
						token: {
							decimals: 6,
							symbol: 'USDC',
							address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
						},
					},
					totalProfitInCollateral: {
						balance: expect.any(String),
						token: {
							decimals: 18,
							symbol: 'WETH',
							address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
						},
					},
					totalProfitInDebt: {
						balance: expect.any(String),
						token: {
							decimals: 6,
							symbol: 'USDC',
							address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
						},
					},
					stopLossDynamicPrice: expect.any(String),
					fee: {
						balance: expect.any(String),
						token: {
							decimals: 18,
							symbol: 'WETH',
							address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
						},
					},
					totalFee: {
						balance: expect.any(String),
						token: {
							decimals: 18,
							symbol: 'WETH',
							address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
						},
					},
				},
				{
					triggerPrice: expect.any(String),
					realizedProfitInCollateral: {
						balance: expect.any(String),
						token: {
							decimals: 18,
							symbol: 'WETH',
							address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
						},
					},
					realizedProfitInDebt: {
						balance: expect.any(String),
						token: {
							decimals: 6,
							symbol: 'USDC',
							address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
						},
					},
					totalProfitInCollateral: {
						balance: expect.any(String),
						token: {
							decimals: 18,
							symbol: 'WETH',
							address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
						},
					},
					totalProfitInDebt: {
						balance: expect.any(String),
						token: {
							decimals: 6,
							symbol: 'USDC',
							address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
						},
					},
					stopLossDynamicPrice: expect.any(String),
					fee: {
						balance: expect.any(String),
						token: {
							decimals: 18,
							symbol: 'WETH',
							address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
						},
					},
					totalFee: {
						balance: expect.any(String),
						token: {
							decimals: 18,
							symbol: 'WETH',
							address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
						},
					},
				},
				{
					triggerPrice: expect.any(String),
					realizedProfitInCollateral: {
						balance: expect.any(String),
						token: {
							decimals: 18,
							symbol: 'WETH',
							address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
						},
					},
					realizedProfitInDebt: {
						balance: expect.any(String),
						token: {
							decimals: 6,
							symbol: 'USDC',
							address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
						},
					},
					totalProfitInCollateral: {
						balance: expect.any(String),
						token: {
							decimals: 18,
							symbol: 'WETH',
							address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
						},
					},
					totalProfitInDebt: {
						balance: expect.any(String),
						token: {
							decimals: 6,
							symbol: 'USDC',
							address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
						},
					},
					stopLossDynamicPrice: expect.any(String),
					fee: {
						balance: expect.any(String),
						token: {
							decimals: 18,
							symbol: 'WETH',
							address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
						},
					},
					totalFee: {
						balance: expect.any(String),
						token: {
							decimals: 18,
							symbol: 'WETH',
							address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
						},
					},
				},
				{
					triggerPrice: expect.any(String),
					realizedProfitInCollateral: {
						balance: expect.any(String),
						token: {
							decimals: 18,
							symbol: 'WETH',
							address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
						},
					},
					realizedProfitInDebt: {
						balance: expect.any(String),
						token: {
							decimals: 6,
							symbol: 'USDC',
							address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
						},
					},
					totalProfitInCollateral: {
						balance: expect.any(String),
						token: {
							decimals: 18,
							symbol: 'WETH',
							address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
						},
					},
					totalProfitInDebt: {
						balance: expect.any(String),
						token: {
							decimals: 6,
							symbol: 'USDC',
							address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
						},
					},
					stopLossDynamicPrice: expect.any(String),
					fee: {
						balance: expect.any(String),
						token: {
							decimals: 18,
							symbol: 'WETH',
							address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
						},
					},
					totalFee: {
						balance: expect.any(String),
						token: {
							decimals: 18,
							symbol: 'WETH',
							address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
						},
					},
				},
				{
					triggerPrice: expect.any(String),
					realizedProfitInCollateral: {
						balance: expect.any(String),
						token: {
							decimals: 18,
							symbol: 'WETH',
							address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
						},
					},
					realizedProfitInDebt: {
						balance: expect.any(String),
						token: {
							decimals: 6,
							symbol: 'USDC',
							address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
						},
					},
					totalProfitInCollateral: {
						balance: expect.any(String),
						token: {
							decimals: 18,
							symbol: 'WETH',
							address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
						},
					},
					totalProfitInDebt: {
						balance: expect.any(String),
						token: {
							decimals: 6,
							symbol: 'USDC',
							address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
						},
					},
					stopLossDynamicPrice: expect.any(String),
					fee: {
						balance: expect.any(String),
						token: {
							decimals: 18,
							symbol: 'WETH',
							address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
						},
					},
					totalFee: {
						balance: expect.any(String),
						token: {
							decimals: 18,
							symbol: 'WETH',
							address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
						},
					},
				},
				{
					triggerPrice: expect.any(String),
					realizedProfitInCollateral: {
						balance: expect.any(String),
						token: {
							decimals: 18,
							symbol: 'WETH',
							address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
						},
					},
					realizedProfitInDebt: {
						balance: expect.any(String),
						token: {
							decimals: 6,
							symbol: 'USDC',
							address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
						},
					},
					totalProfitInCollateral: {
						balance: expect.any(String),
						token: {
							decimals: 18,
							symbol: 'WETH',
							address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
						},
					},
					totalProfitInDebt: {
						balance: expect.any(String),
						token: {
							decimals: 6,
							symbol: 'USDC',
							address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
						},
					},
					stopLossDynamicPrice: expect.any(String),
					fee: {
						balance: expect.any(String),
						token: {
							decimals: 18,
							symbol: 'WETH',
							address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
						},
					},
					totalFee: {
						balance: expect.any(String),
						token: {
							decimals: 18,
							symbol: 'WETH',
							address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
						},
					},
				},
			],
		},
		transaction: {
			to: '0x16F2C35E062C14F57475dE0A466F7E08b03A9C7D',
			data: expect.any(String),
			triggerTxData: expect.any(String),
		},
		encodedTriggerData: expect.any(String),
		warnings: [],
	},
	autoBuyWithoutMaxBuyPriceMorpho: {
		simulation: {
			executionLTV: '8200',
			targetLTV: '9300',
			collateralAmountAfterExecution: expect.any(String),
			debtAmountAfterExecution: expect.any(String),
			targetLTVWithDeviation: ['9200', '9400'],
			targetMultiple: expect.any(String),
			executionPrice: expect.any(String),
			position: {
				hasStablecoinDebt: false,
				ltv: expect.any(String),
				collateral: {
					balance: expect.any(String),
					token: {
						decimals: 18,
						symbol: 'wstETH',
						address: '0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0',
					},
				},
				debt: {
					balance: expect.any(String),
					token: {
						decimals: 18,
						symbol: 'WETH',
						address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
					},
				},
				address: '0x302a28D7968824f386F278a72368856BC4d82BA4',
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
			to: '0x302a28D7968824f386F278a72368856BC4d82BA4',
			data: expect.any(String),
			triggerTxData: expect.any(String),
		},
		encodedTriggerData: expect.any(String),
		warnings: [],
	},
	autoSellWithoutMinSellPriceMorpho: {
		simulation: {
			executionLTV: '9400',
			targetLTV: '9300',
			collateralAmountAfterExecution: expect.any(String),
			debtAmountAfterExecution: expect.any(String),
			targetLTVWithDeviation: ['9200', '9400'],
			targetMultiple: expect.any(String),
			executionPrice: expect.any(String),
			position: {
				hasStablecoinDebt: false,
				ltv: expect.any(String),
				collateral: {
					balance: expect.any(String),
					token: {
						decimals: 18,
						symbol: 'wstETH',
						address: '0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0',
					},
				},
				debt: {
					balance: expect.any(String),
					token: {
						decimals: 18,
						symbol: 'WETH',
						address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
					},
				},
				address: '0x302a28D7968824f386F278a72368856BC4d82BA4',
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
			to: '0x302a28D7968824f386F278a72368856BC4d82BA4',
			data: expect.any(String),
			triggerTxData: expect.any(String),
		},
		encodedTriggerData: expect.any(String),
		warnings: [],
	},
	trailingStopLossMorpho: {
		simulation: {
			latestPrice: {
				tokenRoundId: expect.any(String),
				denominationRoundId: expect.any(String),
				token: {
					id: '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599',
					symbol: 'WBTC',
					oraclesToken: [
						{
							address: '0xf4030086522a5beea4988f8ca5b36dbc97bee88c',
						},
					],
				},
				denomination: {
					id: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
					symbol: 'USDC',
					oraclesToken: [
						{
							address: '0x8fffffd4afb6115b954bd326cbe7b4ba576818f6',
						},
					],
				},
				derivedPrice: expect.any(String),
			},
			position: {
				hasStablecoinDebt: false,
				ltv: expect.any(String),
				collateral: {
					balance: expect.any(String),
					token: {
						decimals: 8,
						symbol: 'WBTC',
						address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
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
				address: '0x2e0515d7A3eA0276F28c94C426c5d2D1d85FD4d5',
				oraclePrices: {
					collateralPrice: expect.any(String),
					debtPrice: expect.any(String),
				},
				collateralPriceInDebt: expect.any(String),
				netValueUSD: expect.any(String),
				debtValueUSD: expect.any(String),
				collateralValueUSD: expect.any(String),
			},
			executionParams: {
				executionPrice: expect.any(String),
				dynamicExecutionLTV: expect.any(String),
			},
		},
		transaction: {
			to: '0x2e0515d7A3eA0276F28c94C426c5d2D1d85FD4d5',
			data: expect.any(String),
			triggerTxData: expect.any(String),
		},
		encodedTriggerData: expect.any(String),
		warnings: [],
	},
	autoTakeProfitMorpho: {
		simulation: {
			profits: [
				{
					triggerPrice: expect.any(String),
					realizedProfitInCollateral: {
						balance: expect.any(String),
						token: {
							decimals: 8,
							symbol: 'WBTC',
							address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
						},
					},
					realizedProfitInDebt: {
						balance: expect.any(String),
						token: {
							decimals: 6,
							symbol: 'USDC',
							address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
						},
					},
					totalProfitInCollateral: {
						balance: expect.any(String),
						token: {
							decimals: 8,
							symbol: 'WBTC',
							address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
						},
					},
					totalProfitInDebt: {
						balance: expect.any(String),
						token: {
							decimals: 6,
							symbol: 'USDC',
							address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
						},
					},
					stopLossDynamicPrice: expect.any(String),
					fee: {
						balance: expect.any(String),
						token: {
							decimals: 8,
							symbol: 'WBTC',
							address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
						},
					},
					totalFee: {
						balance: expect.any(String),
						token: {
							decimals: 8,
							symbol: 'WBTC',
							address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
						},
					},
				},
				{
					triggerPrice: expect.any(String),
					realizedProfitInCollateral: {
						balance: expect.any(String),
						token: {
							decimals: 8,
							symbol: 'WBTC',
							address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
						},
					},
					realizedProfitInDebt: {
						balance: expect.any(String),
						token: {
							decimals: 6,
							symbol: 'USDC',
							address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
						},
					},
					totalProfitInCollateral: {
						balance: expect.any(String),
						token: {
							decimals: 8,
							symbol: 'WBTC',
							address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
						},
					},
					totalProfitInDebt: {
						balance: expect.any(String),
						token: {
							decimals: 6,
							symbol: 'USDC',
							address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
						},
					},
					stopLossDynamicPrice: expect.any(String),
					fee: {
						balance: expect.any(String),
						token: {
							decimals: 8,
							symbol: 'WBTC',
							address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
						},
					},
					totalFee: {
						balance: expect.any(String),
						token: {
							decimals: 8,
							symbol: 'WBTC',
							address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
						},
					},
				},
				{
					triggerPrice: expect.any(String),
					realizedProfitInCollateral: {
						balance: expect.any(String),
						token: {
							decimals: 8,
							symbol: 'WBTC',
							address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
						},
					},
					realizedProfitInDebt: {
						balance: expect.any(String),
						token: {
							decimals: 6,
							symbol: 'USDC',
							address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
						},
					},
					totalProfitInCollateral: {
						balance: expect.any(String),
						token: {
							decimals: 8,
							symbol: 'WBTC',
							address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
						},
					},
					totalProfitInDebt: {
						balance: expect.any(String),
						token: {
							decimals: 6,
							symbol: 'USDC',
							address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
						},
					},
					stopLossDynamicPrice: expect.any(String),
					fee: {
						balance: expect.any(String),
						token: {
							decimals: 8,
							symbol: 'WBTC',
							address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
						},
					},
					totalFee: {
						balance: expect.any(String),
						token: {
							decimals: 8,
							symbol: 'WBTC',
							address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
						},
					},
				},
				{
					triggerPrice: expect.any(String),
					realizedProfitInCollateral: {
						balance: expect.any(String),
						token: {
							decimals: 8,
							symbol: 'WBTC',
							address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
						},
					},
					realizedProfitInDebt: {
						balance: expect.any(String),
						token: {
							decimals: 6,
							symbol: 'USDC',
							address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
						},
					},
					totalProfitInCollateral: {
						balance: expect.any(String),
						token: {
							decimals: 8,
							symbol: 'WBTC',
							address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
						},
					},
					totalProfitInDebt: {
						balance: expect.any(String),
						token: {
							decimals: 6,
							symbol: 'USDC',
							address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
						},
					},
					stopLossDynamicPrice: expect.any(String),
					fee: {
						balance: expect.any(String),
						token: {
							decimals: 8,
							symbol: 'WBTC',
							address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
						},
					},
					totalFee: {
						balance: expect.any(String),
						token: {
							decimals: 8,
							symbol: 'WBTC',
							address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
						},
					},
				},
				{
					triggerPrice: expect.any(String),
					realizedProfitInCollateral: {
						balance: expect.any(String),
						token: {
							decimals: 8,
							symbol: 'WBTC',
							address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
						},
					},
					realizedProfitInDebt: {
						balance: expect.any(String),
						token: {
							decimals: 6,
							symbol: 'USDC',
							address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
						},
					},
					totalProfitInCollateral: {
						balance: expect.any(String),
						token: {
							decimals: 8,
							symbol: 'WBTC',
							address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
						},
					},
					totalProfitInDebt: {
						balance: expect.any(String),
						token: {
							decimals: 6,
							symbol: 'USDC',
							address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
						},
					},
					stopLossDynamicPrice: expect.any(String),
					fee: {
						balance: expect.any(String),
						token: {
							decimals: 8,
							symbol: 'WBTC',
							address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
						},
					},
					totalFee: {
						balance: expect.any(String),
						token: {
							decimals: 8,
							symbol: 'WBTC',
							address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
						},
					},
				},
				{
					triggerPrice: expect.any(String),
					realizedProfitInCollateral: {
						balance: expect.any(String),
						token: {
							decimals: 8,
							symbol: 'WBTC',
							address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
						},
					},
					realizedProfitInDebt: {
						balance: expect.any(String),
						token: {
							decimals: 6,
							symbol: 'USDC',
							address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
						},
					},
					totalProfitInCollateral: {
						balance: expect.any(String),
						token: {
							decimals: 8,
							symbol: 'WBTC',
							address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
						},
					},
					totalProfitInDebt: {
						balance: expect.any(String),
						token: {
							decimals: 6,
							symbol: 'USDC',
							address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
						},
					},
					stopLossDynamicPrice: expect.any(String),
					fee: {
						balance: expect.any(String),
						token: {
							decimals: 8,
							symbol: 'WBTC',
							address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
						},
					},
					totalFee: {
						balance: expect.any(String),
						token: {
							decimals: 8,
							symbol: 'WBTC',
							address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
						},
					},
				},
				{
					triggerPrice: expect.any(String),
					realizedProfitInCollateral: {
						balance: expect.any(String),
						token: {
							decimals: 8,
							symbol: 'WBTC',
							address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
						},
					},
					realizedProfitInDebt: {
						balance: expect.any(String),
						token: {
							decimals: 6,
							symbol: 'USDC',
							address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
						},
					},
					totalProfitInCollateral: {
						balance: expect.any(String),
						token: {
							decimals: 8,
							symbol: 'WBTC',
							address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
						},
					},
					totalProfitInDebt: {
						balance: expect.any(String),
						token: {
							decimals: 6,
							symbol: 'USDC',
							address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
						},
					},
					stopLossDynamicPrice: expect.any(String),
					fee: {
						balance: expect.any(String),
						token: {
							decimals: 8,
							symbol: 'WBTC',
							address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
						},
					},
					totalFee: {
						balance: expect.any(String),
						token: {
							decimals: 8,
							symbol: 'WBTC',
							address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
						},
					},
				},
				{
					triggerPrice: expect.any(String),
					realizedProfitInCollateral: {
						balance: expect.any(String),
						token: {
							decimals: 8,
							symbol: 'WBTC',
							address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
						},
					},
					realizedProfitInDebt: {
						balance: expect.any(String),
						token: {
							decimals: 6,
							symbol: 'USDC',
							address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
						},
					},
					totalProfitInCollateral: {
						balance: expect.any(String),
						token: {
							decimals: 8,
							symbol: 'WBTC',
							address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
						},
					},
					totalProfitInDebt: {
						balance: expect.any(String),
						token: {
							decimals: 6,
							symbol: 'USDC',
							address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
						},
					},
					stopLossDynamicPrice: expect.any(String),
					fee: {
						balance: expect.any(String),
						token: {
							decimals: 8,
							symbol: 'WBTC',
							address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
						},
					},
					totalFee: {
						balance: expect.any(String),
						token: {
							decimals: 8,
							symbol: 'WBTC',
							address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
						},
					},
				},
				{
					triggerPrice: expect.any(String),
					realizedProfitInCollateral: {
						balance: expect.any(String),
						token: {
							decimals: 8,
							symbol: 'WBTC',
							address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
						},
					},
					realizedProfitInDebt: {
						balance: expect.any(String),
						token: {
							decimals: 6,
							symbol: 'USDC',
							address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
						},
					},
					totalProfitInCollateral: {
						balance: expect.any(String),
						token: {
							decimals: 8,
							symbol: 'WBTC',
							address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
						},
					},
					totalProfitInDebt: {
						balance: expect.any(String),
						token: {
							decimals: 6,
							symbol: 'USDC',
							address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
						},
					},
					stopLossDynamicPrice: expect.any(String),
					fee: {
						balance: expect.any(String),
						token: {
							decimals: 8,
							symbol: 'WBTC',
							address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
						},
					},
					totalFee: {
						balance: expect.any(String),
						token: {
							decimals: 8,
							symbol: 'WBTC',
							address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
						},
					},
				},
				{
					triggerPrice: expect.any(String),
					realizedProfitInCollateral: {
						balance: expect.any(String),
						token: {
							decimals: 8,
							symbol: 'WBTC',
							address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
						},
					},
					realizedProfitInDebt: {
						balance: expect.any(String),
						token: {
							decimals: 6,
							symbol: 'USDC',
							address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
						},
					},
					totalProfitInCollateral: {
						balance: expect.any(String),
						token: {
							decimals: 8,
							symbol: 'WBTC',
							address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
						},
					},
					totalProfitInDebt: {
						balance: expect.any(String),
						token: {
							decimals: 6,
							symbol: 'USDC',
							address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
						},
					},
					stopLossDynamicPrice: expect.any(String),
					fee: {
						balance: expect.any(String),
						token: {
							decimals: 8,
							symbol: 'WBTC',
							address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
						},
					},
					totalFee: {
						balance: expect.any(String),
						token: {
							decimals: 8,
							symbol: 'WBTC',
							address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
						},
					},
				},
				{
					triggerPrice: expect.any(String),
					realizedProfitInCollateral: {
						balance: expect.any(String),
						token: {
							decimals: 8,
							symbol: 'WBTC',
							address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
						},
					},
					realizedProfitInDebt: {
						balance: expect.any(String),
						token: {
							decimals: 6,
							symbol: 'USDC',
							address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
						},
					},
					totalProfitInCollateral: {
						balance: expect.any(String),
						token: {
							decimals: 8,
							symbol: 'WBTC',
							address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
						},
					},
					totalProfitInDebt: {
						balance: expect.any(String),
						token: {
							decimals: 6,
							symbol: 'USDC',
							address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
						},
					},
					stopLossDynamicPrice: expect.any(String),
					fee: {
						balance: expect.any(String),
						token: {
							decimals: 8,
							symbol: 'WBTC',
							address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
						},
					},
					totalFee: {
						balance: expect.any(String),
						token: {
							decimals: 8,
							symbol: 'WBTC',
							address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
						},
					},
				},
				{
					triggerPrice: expect.any(String),
					realizedProfitInCollateral: {
						balance: expect.any(String),
						token: {
							decimals: 8,
							symbol: 'WBTC',
							address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
						},
					},
					realizedProfitInDebt: {
						balance: expect.any(String),
						token: {
							decimals: 6,
							symbol: 'USDC',
							address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
						},
					},
					totalProfitInCollateral: {
						balance: expect.any(String),
						token: {
							decimals: 8,
							symbol: 'WBTC',
							address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
						},
					},
					totalProfitInDebt: {
						balance: expect.any(String),
						token: {
							decimals: 6,
							symbol: 'USDC',
							address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
						},
					},
					stopLossDynamicPrice: expect.any(String),
					fee: {
						balance: expect.any(String),
						token: {
							decimals: 8,
							symbol: 'WBTC',
							address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
						},
					},
					totalFee: {
						balance: expect.any(String),
						token: {
							decimals: 8,
							symbol: 'WBTC',
							address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
						},
					},
				},
				{
					triggerPrice: expect.any(String),
					realizedProfitInCollateral: {
						balance: expect.any(String),
						token: {
							decimals: 8,
							symbol: 'WBTC',
							address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
						},
					},
					realizedProfitInDebt: {
						balance: expect.any(String),
						token: {
							decimals: 6,
							symbol: 'USDC',
							address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
						},
					},
					totalProfitInCollateral: {
						balance: expect.any(String),
						token: {
							decimals: 8,
							symbol: 'WBTC',
							address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
						},
					},
					totalProfitInDebt: {
						balance: expect.any(String),
						token: {
							decimals: 6,
							symbol: 'USDC',
							address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
						},
					},
					stopLossDynamicPrice: expect.any(String),
					fee: {
						balance: expect.any(String),
						token: {
							decimals: 8,
							symbol: 'WBTC',
							address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
						},
					},
					totalFee: {
						balance: expect.any(String),
						token: {
							decimals: 8,
							symbol: 'WBTC',
							address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
						},
					},
				},
				{
					triggerPrice: expect.any(String),
					realizedProfitInCollateral: {
						balance: expect.any(String),
						token: {
							decimals: 8,
							symbol: 'WBTC',
							address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
						},
					},
					realizedProfitInDebt: {
						balance: expect.any(String),
						token: {
							decimals: 6,
							symbol: 'USDC',
							address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
						},
					},
					totalProfitInCollateral: {
						balance: expect.any(String),
						token: {
							decimals: 8,
							symbol: 'WBTC',
							address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
						},
					},
					totalProfitInDebt: {
						balance: expect.any(String),
						token: {
							decimals: 6,
							symbol: 'USDC',
							address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
						},
					},
					stopLossDynamicPrice: expect.any(String),
					fee: {
						balance: expect.any(String),
						token: {
							decimals: 8,
							symbol: 'WBTC',
							address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
						},
					},
					totalFee: {
						balance: expect.any(String),
						token: {
							decimals: 8,
							symbol: 'WBTC',
							address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
						},
					},
				},
				{
					triggerPrice: expect.any(String),
					realizedProfitInCollateral: {
						balance: expect.any(String),
						token: {
							decimals: 8,
							symbol: 'WBTC',
							address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
						},
					},
					realizedProfitInDebt: {
						balance: expect.any(String),
						token: {
							decimals: 6,
							symbol: 'USDC',
							address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
						},
					},
					totalProfitInCollateral: {
						balance: expect.any(String),
						token: {
							decimals: 8,
							symbol: 'WBTC',
							address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
						},
					},
					totalProfitInDebt: {
						balance: expect.any(String),
						token: {
							decimals: 6,
							symbol: 'USDC',
							address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
						},
					},
					stopLossDynamicPrice: expect.any(String),
					fee: {
						balance: expect.any(String),
						token: {
							decimals: 8,
							symbol: 'WBTC',
							address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
						},
					},
					totalFee: {
						balance: expect.any(String),
						token: {
							decimals: 8,
							symbol: 'WBTC',
							address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
						},
					},
				},
			],
		},
		transaction: {
			to: '0x2e0515d7A3eA0276F28c94C426c5d2D1d85FD4d5',
			data: expect.any(String),
			triggerTxData: expect.any(String),
		},
		encodedTriggerData: expect.any(String),
		warnings: [],
	},
	autoBuyWithoutMaxBuyPriceSpark: {
		simulation: {
			executionLTV: '4100',
			targetLTV: '4900',
			collateralAmountAfterExecution: expect.any(String),
			debtAmountAfterExecution: expect.any(String),
			targetLTVWithDeviation: ['4800', '5000'],
			targetMultiple: expect.any(String),
			executionPrice: expect.any(String),
			position: {
				hasStablecoinDebt: false,
				ltv: expect.any(String),
				collateral: {
					balance: expect.any(String),
					token: {
						decimals: 18,
						symbol: 'wstETH',
						address: '0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0',
					},
				},
				debt: {
					balance: expect.any(String),
					token: {
						decimals: 18,
						symbol: 'WETH',
						address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
					},
				},
				address: '0x6be31243E0FfA8F42D1F64834ECa2AB6DC8F7498',
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
			to: '0x6be31243E0FfA8F42D1F64834ECa2AB6DC8F7498',
			data: expect.any(String),
			triggerTxData: expect.any(String),
		},
		encodedTriggerData: expect.any(String),
		warnings: [],
	},
	wrongDpm: {
		message: 'Validation Errors',
		errors: [
			{
				message: 'Invalid address format',
				path: ['dpm'],
			},
		],
		warnings: [],
	},
	missingPosition: {
		message: 'Validation Errors',
		errors: [
			{
				message: 'Required',
				code: 'invalid_type',
				path: ['position'],
			},
		],
		warnings: [],
	},
	wrongPosition_string: {
		message: 'Validation Errors',
		errors: [
			{
				message: 'Expected object, received string',
				code: 'invalid_type',
				path: ['position'],
			},
		],
		warnings: [],
	},
	wrongPosition_number: {
		message: 'Validation Errors',
		errors: [
			{
				message: 'Expected object, received number',
				code: 'invalid_type',
				path: ['position'],
			},
		],
		warnings: [],
	},
	wrongPosition_array: {
		message: 'Validation Errors',
		errors: [
			{
				message: 'Expected object, received array',
				code: 'invalid_type',
				path: ['position'],
			},
		],
		warnings: [],
	},
	wrongPosition_null: {
		message: 'Validation Errors',
		errors: [
			{
				message: 'Expected object, received null',
				code: 'invalid_type',
				path: ['position'],
			},
		],
		warnings: [],
	},
	wrongCollateral: {
		message: 'Validation Errors',
		errors: [
			{
				message: 'Invalid address format',
				path: ['position', 'collateral'],
			},
		],
		warnings: [],
	},
	wrongDebt: {
		message: 'Validation Errors',
		errors: [
			{
				message: 'Invalid address format',
				path: ['position', 'debt'],
			},
		],
		warnings: [],
	},
	missingTriggerData: {
		message: 'Validation Errors',
		errors: [
			{
				message: 'Required',
				code: 'invalid_type',
				path: ['triggerData'],
			},
		],
		warnings: [],
	},
	wrongTriggerDataStopLoss: {
		message: 'Validation Errors',
		errors: [
			{
				message: 'Invalid input',
				code: 'invalid_union',
				path: ['triggerData'],
			},
		],
		warnings: [],
	},
	wrongTriggerData_string: {
		message: 'Validation Errors',
		errors: [
			{
				message: 'Expected object, received string',
				code: 'invalid_type',
				path: ['triggerData'],
			},
		],
		warnings: [],
	},
	wrongTriggerData_number: {
		message: 'Validation Errors',
		errors: [
			{
				message: 'Expected object, received number',
				code: 'invalid_type',
				path: ['triggerData'],
			},
		],
		warnings: [],
	},
	wrongTriggerData_array: {
		message: 'Validation Errors',
		errors: [
			{
				message: 'Expected object, received array',
				code: 'invalid_type',
				path: ['triggerData'],
			},
		],
		warnings: [],
	},
	wrongTriggerData_null: {
		message: 'Validation Errors',
		errors: [
			{
				message: 'Expected object, received null',
				code: 'invalid_type',
				path: ['triggerData'],
			},
		],
		warnings: [],
	},
	wrongExecutionLTV: {
		message: 'Validation Errors',
		errors: [
			{
				message: 'Invalid input',
				code: 'invalid_union',
				path: ['triggerData', 'executionLTV'],
			},
		],
		warnings: [],
	},
	wrongExecutionPrice: {
		message: 'Validation Errors',
		errors: [
			{
				message: 'Invalid input',
				code: 'invalid_union',
				path: ['triggerData', 'executionPrice'],
			},
		],
		warnings: [],
	},
	wrongMaxBaseFee: {
		message: 'Validation Errors',
		errors: [
			{
				message: 'Invalid input',
				code: 'invalid_union',
				path: ['triggerData', 'maxBaseFee'],
			},
		],
		warnings: [],
	},
	wrongTargetLTV: {
		message: 'Validation Errors',
		errors: [
			{
				message: 'Invalid input',
				code: 'invalid_union',
				path: ['triggerData', 'targetLTV'],
			},
		],
		warnings: [],
	},
	wrongTrailingDistance: {
		message: 'Validation Errors',
		errors: [
			{
				message: 'Invalid input',
				code: 'invalid_union',
				path: ['triggerData', 'trailingDistance'],
			},
		],
		warnings: [],
	},
	wrongWithdrawStep: {
		message: 'Validation Errors',
		errors: [
			{
				message: 'Invalid input',
				code: 'invalid_union',
				path: ['triggerData', 'withdrawStep'],
			},
		],
		warnings: [],
	},
	wrongStopLossTriggerData: {
		message: 'Validation Errors',
		errors: [
			{
				message: 'Invalid input',
				code: 'invalid_union',
				path: ['triggerData', 'stopLoss', 'triggerData'],
			},
		],
		warnings: [],
	},
	wrongStopLossTriggerDataMorpho: {
		message: 'Validation Errors',
		errors: [
			{
				message: 'Required',
				code: 'invalid_type',
				path: ['triggerData', 'stopLoss', 'triggerData'],
			},
		],
		warnings: [],
	},
	wrongToken: {
		message: 'Validation Errors',
		errors: [
			{
				message: 'Invalid address format',
				path: ['triggerData', 'token'],
			},
		],
		warnings: [],
	},
	wrongWithdrawToken: {
		message: 'Validation Errors',
		errors: [
			{
				message: 'Invalid address format',
				path: ['triggerData', 'withdrawToken'],
			},
		],
		warnings: [],
	},
	wrongUseMaxBuyPrice: {
		message: 'Validation Errors',
		errors: [
			{
				message:
					'Max buy price is not set. Please set max buy price or explicitly disable it in trigger data',
				code: 'max-buy-price-is-not-set',
				path: ['triggerData', 'triggerData', 'maxBuyPrice'],
			},
		],
		warnings: [],
	},
	wrongUseMinSellPrice: {
		message: 'Validation Errors',
		errors: [
			{
				message:
					'Min sell price is not set. Please set min sell price or explicitly disable it in trigger data',
				code: 'min-sell-price-is-not-set',
				path: ['triggerData', 'triggerData', 'minSellPrice'],
			},
		],
		warnings: [],
	},
};

export const validPayloadsAaveV3Ethereum = {
	autoBuy: {
		addWithoutMaxBuyPrice: {
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
		addWithMaxBuyPrice: {
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
				maxBuyPrice: '1000000000000',
				targetLTV: '5000',
				useMaxBuyPrice: true,
			},
		},
	},
	autoSell: {
		addWithoutMinSellPrice: {
			action: 'add',
			dpm: '0x16f2c35e062c14f57475de0a466f7e08b03a9c7d',
			protocol: 'aavev3',
			position: {
				collateral: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
				debt: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
			},
			triggerData: {
				executionLTV: '4600',
				maxBaseFee: '300',
				targetLTV: '3800',
				useMinSellPrice: false,
			},
		},
		addWithMinSellPrice: {
			dpm: '0x16f2c35e062c14f57475de0a466f7e08b03a9c7d',
			protocol: 'aavev3',
			position: {
				collateral: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
				debt: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
			},
			action: 'add',
			triggerData: {
				executionLTV: '4600',
				maxBaseFee: '300',
				minSellPrice: '50000000000',
				targetLTV: '3800',
				useMinSellPrice: true,
			},
		},
	},
	stopLoss: {
		closeToDebt: {
			dpm: '0x16f2c35e062c14f57475de0a466f7e08b03a9c7d',
			protocol: 'aavev3',
			position: {
				collateral: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
				debt: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
			},
			action: 'add',
			triggerData: {
				executionLTV: '7685',
				token: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
			},
		},
	},
	trailingStopLoss: {
		closeToDebt: {
			dpm: '0x16f2c35e062c14f57475de0a466f7e08b03a9c7d',
			protocol: 'aavev3',
			position: {
				collateral: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
				debt: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
			},
			action: 'add',
			triggerData: {
				trailingDistance: '8000000000',
				token: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
			},
		},
	},
	autoTakeProfit: {
		closeToDebt: {
			dpm: '0x16f2c35e062c14f57475de0a466f7e08b03a9c7d',
			protocol: 'aavev3',
			position: {
				collateral: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
				debt: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
			},
			action: 'add',
			triggerData: {
				executionLTV: '3200',
				executionPrice: '0',
				stopLoss: {
					triggerData: {
						executionLTV: '7940',
						token: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
					},
					action: 'add',
				},
				withdrawToken: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
				withdrawStep: '500',
			},
		},
	},
};

export const validPayloadsMorpho = {
	autoSell: {
		addWithoutMinSellPrice: {
			dpm: '0x302a28d7968824f386f278a72368856bc4d82ba4',
			protocol: 'morphoblue',
			position: {
				collateral: '0x7f39c581f595b53c5cb19bd0b3f8da6c935e2ca0',
				debt: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
			},
			action: 'add',
			triggerData: {
				executionLTV: '9400',
				maxBaseFee: '300',
				poolId: '0xc54d7acf14de29e0e5527cabd7a576506870346a78a11a6762e2cca66322ec41',
				targetLTV: '9300',
				useMinSellPrice: false,
			},
		},
		addWithMinSellPrice: {
			dpm: '0x302a28d7968824f386f278a72368856bc4d82ba4',
			protocol: 'morphoblue',
			position: {
				collateral: '0x7f39c581f595b53c5cb19bd0b3f8da6c935e2ca0',
				debt: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
			},
			action: 'add',
			triggerData: {
				executionLTV: '9400',
				maxBaseFee: '300',
				minSellPrice: '50000000',
				poolId: '0xc54d7acf14de29e0e5527cabd7a576506870346a78a11a6762e2cca66322ec41',
				targetLTV: '9300',
				useMinSellPrice: true,
			},
		},
	},
	autoBuy: {
		addWithoutMaxBuyPrice: {
			dpm: '0x302a28d7968824f386f278a72368856bc4d82ba4',
			protocol: 'morphoblue',
			position: {
				collateral: '0x7f39c581f595b53c5cb19bd0b3f8da6c935e2ca0',
				debt: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
			},
			action: 'add',
			triggerData: {
				executionLTV: '8200',
				maxBaseFee: '300',
				poolId: '0xc54d7acf14de29e0e5527cabd7a576506870346a78a11a6762e2cca66322ec41',
				targetLTV: '9300',
				useMaxBuyPrice: false,
			},
		},
		addWithMaxBuyPrice: {
			dpm: '0x302a28d7968824f386f278a72368856bc4d82ba4',
			protocol: 'morphoblue',
			position: {
				collateral: '0x7f39c581f595b53c5cb19bd0b3f8da6c935e2ca0',
				debt: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
			},
			action: 'add',
			triggerData: {
				executionLTV: '8200',
				maxBaseFee: '300',
				maxBuyPrice: '200000000',
				poolId: '0xc54d7acf14de29e0e5527cabd7a576506870346a78a11a6762e2cca66322ec41',
				targetLTV: '9300',
				useMaxBuyPrice: true,
			},
		},
	},
	stopLoss: {
		closeToDebt: {
			dpm: '0x302a28d7968824f386f278a72368856bc4d82ba4',
			protocol: 'morphoblue',
			position: {
				collateral: '0x7f39c581f595b53c5cb19bd0b3f8da6c935e2ca0',
				debt: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
			},
			action: 'add',
			triggerData: {
				executionLTV: '9337',
				poolId: '0xc54d7acf14de29e0e5527cabd7a576506870346a78a11a6762e2cca66322ec41',
				token: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
			},
		},
	},
	trailingStopLoss: {
		closeToDebt: {
			dpm: '0x2e0515d7a3ea0276f28c94c426c5d2d1d85fd4d5',
			protocol: 'morphoblue',
			position: {
				collateral: '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599',
				debt: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
			},
			action: 'add',
			triggerData: {
				trailingDistance: '120000000000',
				poolId: '0x3a85e619751152991742810df6ec69ce473daef99e28a64ab2340d7b7ccfee49',
				token: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
			},
		},
	},
	autoTakeProfit: {
		closeToDebt: {
			dpm: '0x2e0515d7a3ea0276f28c94c426c5d2d1d85fd4d5',
			protocol: 'morphoblue',
			position: {
				collateral: '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599',
				debt: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
			},
			action: 'add',
			triggerData: {
				executionLTV: '5700',
				executionPrice: '0',
				poolId: '0x3a85e619751152991742810df6ec69ce473daef99e28a64ab2340d7b7ccfee49',
				stopLoss: {
					triggerData: {
						executionLTV: '8490',
						token: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
						poolId: '0x3a85e619751152991742810df6ec69ce473daef99e28a64ab2340d7b7ccfee49',
					},
					action: 'add',
				},
				withdrawToken: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
				withdrawStep: '500',
			},
		},
	},
};

export const validPayloadsSpark = {
	autoBuy: {
		addWithoutMaxBuyPrice: {
			dpm: '0x6be31243e0ffa8f42d1f64834eca2ab6dc8f7498',
			protocol: 'sparkv3',
			position: {
				collateral: '0x7f39c581f595b53c5cb19bd0b3f8da6c935e2ca0',
				debt: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
			},
			action: 'add',
			triggerData: {
				executionLTV: '4100',
				maxBaseFee: '300',
				targetLTV: '4900',
				useMaxBuyPrice: false,
			},
		},
		addWithMaxBuyPrice: {
			dpm: '0x6be31243e0ffa8f42d1f64834eca2ab6dc8f7498',
			protocol: 'sparkv3',
			position: {
				collateral: '0x7f39c581f595b53c5cb19bd0b3f8da6c935e2ca0',
				debt: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
			},
			action: 'add',
			triggerData: {
				executionLTV: '4100',
				maxBaseFee: '300',
				maxBuyPrice: '300000000',
				targetLTV: '4900',
				useMaxBuyPrice: true,
			},
		},
	},
	autoSell: { addWithoutMinSellPrice: {}, addWithMinSellPrice: {} },
	stopLoss: { closeToDebt: {} },
	trailingStopLoss: { closeToDebt: {} },
	autoTakeProfit: { closeToDebt: {} },
};

export const validPayloadsAaveV3Arbitrum = {
	autoBuy: { addWithoutMaxBuyPrice: {}, addWithMaxBuyPrice: {} },
	autoSell: { addWithoutMinSellPrice: {}, addWithMinSellPrice: {} },
	stopLoss: { closeToDebt: {} },
	trailingStopLoss: { closeToDebt: {} },
	autoTakeProfit: { closeToDebt: {} },
};

export const validPayloadsAaveV3Base = {
	autoBuy: { addWithoutMaxBuyPrice: {}, addWithMaxBuyPrice: {} },
	autoSell: { addWithoutMinSellPrice: {}, addWithMinSellPrice: {} },
	stopLoss: { closeToDebt: {} },
	trailingStopLoss: { closeToDebt: {} },
	autoTakeProfit: { closeToDebt: {} },
};

export const validPayloadsAaveV3Optimism = {
	autoBuy: { addWithoutMaxBuyPrice: {}, addWithMaxBuyPrice: {} },
	autoSell: { addWithoutMinSellPrice: {}, addWithMinSellPrice: {} },
	stopLoss: { closeToDebt: {} },
	trailingStopLoss: { closeToDebt: {} },
	autoTakeProfit: { closeToDebt: {} },
};
