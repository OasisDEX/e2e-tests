import { expect } from '#noWalletFixtures';

export const morphoTrailingStopLossResponse = {
	triggers: {
		aave3: {},
		spark: {},
		'morphoblue-0x3a85e619751152991742810df6ec69ce473daef99e28a64ab2340d7b7ccfee49': {
			trailingStopLoss: {
				triggerTypeName: 'MorphoBlueTrailingStopLoss',
				triggerType: '10009',
				triggerId: '10000000671',
				triggerData:
					'0x0000000000000000000000007126e8e9c26832b441a560f4283e09f9c51ab60500000000000000000000000000000000000000000000000000000000000027190000000000000000000000000000000000000000000000000214e8348c4f0000000000000000000000000000a0b86991c6218b36c1d19d4a2e9eb0ce3606eb480000000000000000000000002260fac5e5542a773aa44fbcfedf7c193bc2c5994d6f7270686f426c7565436c6f7365416e6452656d61696e5f6175746f0000003a85e619751152991742810df6ec69ce473daef99e28a64ab2340d7b7ccfee49000000000000000000000000f4030086522a5beea4988f8ca5b36dbc97bee88c00000000000000000000000000000000000000000000000600000000000052150000000000000000000000008fffffd4afb6115b954bd326cbe7b4ba576818f6000000000000000000000000000000000000000000000003000000000000004d0000000000000000000000000000000000000000000000000000032ee841b8000000000000000000000000000000000000000000000000000000000000000000',
				decodedParams: {
					triggerType: '10009',
					positionAddress: '0x7126e8e9c26832b441a560f4283e09f9c51ab605',
					maxCoverage: '150000000000000000',
					debtToken: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
					collateralToken: '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599',
					operationName: '0x4d6f7270686f426c7565436c6f7365416e6452656d61696e5f6175746f000000',
					collateralOracle: '0xf4030086522a5beea4988f8ca5b36dbc97bee88c',
					collateralAddedRoundId: '110680464442257330709',
					debtOracle: '0x8fffffd4afb6115b954bd326cbe7b4ba576818f6',
					debtAddedRoundId: '55340232221128654925',
					trailingDistance: '3500000000000',
					closeToCollateral: 'false',
				},
				dynamicParams: {
					executionPrice: '2563839191959',
					originalExecutionPrice: '2313617239658',
				},
			},
		},
	},
	flags: {
		aave3: {
			isStopLossEnabled: false,
			isBasicBuyEnabled: false,
			isBasicSellEnabled: false,
			isPartialTakeProfitEnabled: false,
			isTrailingStopLossEnabled: false,
		},
		spark: {
			isStopLossEnabled: false,
			isBasicBuyEnabled: false,
			isBasicSellEnabled: false,
			isPartialTakeProfitEnabled: false,
			isTrailingStopLossEnabled: false,
		},
		'morphoblue-0x3a85e619751152991742810df6ec69ce473daef99e28a64ab2340d7b7ccfee49': {
			isStopLossEnabled: false,
			isBasicBuyEnabled: false,
			isBasicSellEnabled: false,
			isPartialTakeProfitEnabled: false,
			isTrailingStopLossEnabled: true,
		},
		isAaveStopLossEnabled: false,
		isAaveBasicBuyEnabled: false,
		isAaveBasicSellEnabled: false,
		isAavePartialTakeProfitEnabled: false,
		isSparkStopLossEnabled: false,
		isSparkBasicBuyEnabled: false,
		isSparkBasicSellEnabled: false,
		isSparkPartialTakeProfitEnabled: false,
	},
	triggersCount: 1,
	triggerGroup: {
		morphoBlueStopLoss: {
			triggerType: '10009',
			triggerId: '10000000671',
			triggerData:
				'0x0000000000000000000000007126e8e9c26832b441a560f4283e09f9c51ab60500000000000000000000000000000000000000000000000000000000000027190000000000000000000000000000000000000000000000000214e8348c4f0000000000000000000000000000a0b86991c6218b36c1d19d4a2e9eb0ce3606eb480000000000000000000000002260fac5e5542a773aa44fbcfedf7c193bc2c5994d6f7270686f426c7565436c6f7365416e6452656d61696e5f6175746f0000003a85e619751152991742810df6ec69ce473daef99e28a64ab2340d7b7ccfee49000000000000000000000000f4030086522a5beea4988f8ca5b36dbc97bee88c00000000000000000000000000000000000000000000000600000000000052150000000000000000000000008fffffd4afb6115b954bd326cbe7b4ba576818f6000000000000000000000000000000000000000000000003000000000000004d0000000000000000000000000000000000000000000000000000032ee841b8000000000000000000000000000000000000000000000000000000000000000000',
			decodedParams: {
				triggerType: '10009',
				positionAddress: '0x7126e8e9c26832b441a560f4283e09f9c51ab605',
				maxCoverage: '150000000000000000',
				debtToken: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
				collateralToken: '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599',
				operationName: '0x4d6f7270686f426c7565436c6f7365416e6452656d61696e5f6175746f000000',
				collateralOracle: '0xf4030086522a5beea4988f8ca5b36dbc97bee88c',
				collateralAddedRoundId: '110680464442257330709',
				debtOracle: '0x8fffffd4afb6115b954bd326cbe7b4ba576818f6',
				debtAddedRoundId: '55340232221128654925',
				trailingDistance: '3500000000000',
				closeToCollateral: 'false',
			},
			dynamicParams: {
				executionPrice: '2563839191959',
				originalExecutionPrice: '2313617239658',
			},
		},
	},
	additionalData: {
		params: {
			dpm: '0x7126E8E9C26832B441a560f4283e09f9c51AB605',
			poolId: '0x3a85e619751152991742810df6ec69ce473daef99e28a64ab2340d7b7ccfee49',
			chainId: 1,
			getDetails: true,
		},
	},
};