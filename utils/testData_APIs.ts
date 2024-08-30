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

export const validPayloads = {
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
};
