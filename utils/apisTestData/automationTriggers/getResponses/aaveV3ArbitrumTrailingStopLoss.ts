import { expect } from '#noWalletFixtures';

export const aaveV3ArbitrumTrailingStopLossGetResponse = {
	triggers: {
		aaveTrailingStopLossDMA: {
			triggerTypeName: 'DmaAaveTrailingStopLoss',
			triggerType: '10006',
			triggerId: '10000000472',
			triggerData:
				'0x0000000000000000000000009a8999d48499743b5ca481210dc568018a3b417a0000000000000000000000000000000000000000000000000000000000002716000000000000000000000000000000000000000000000051540b83eb0f424800000000000000000000000000da10009cbd5d07dd0cecc66161fc93d7c9000da10000000000000000000000002f2a2543b76a4166549f7aab2e75bef0aefc5b0f436c6f7365414156455633506f736974696f6e5f3400000000000000000000000000000000000000000000006ce185860a4963106506c203335a2910413708e90000000000000000000000000000000000000000000000010000000000072024000000000000000000000000c5c8e77b397e531b8ec06bfb0048328b30e9ecfb00000000000000000000000000000000000000000000000100000000000030cc000000000000000000000000000000000000000000000000000003567d0bdc000000000000000000000000000000000000000000000000000000000000000000',
			decodedParams: {
				triggerType: '10006',
				positionAddress: '0x9a8999d48499743b5ca481210dc568018a3b417a',
				maxCoverage: '1500242349140000000000',
				debtToken: '0xda10009cbd5d07dd0cecc66161fc93d7c9000da1',
				collateralToken: '0x2f2a2543b76a4166549f7aab2e75bef0aefc5b0f',
				operationName: '0x436c6f7365414156455633506f736974696f6e5f340000000000000000000000',
				collateralOracle: '0x6ce185860a4963106506c203335a2910413708e9',
				collateralAddedRoundId: '18446744073710018596',
				debtOracle: '0xc5c8e77b397e531b8ec06bfb0048328b30e9ecfb',
				debtAddedRoundId: '18446744073709564108',
				trailingDistance: '3670000000000',
				closeToCollateral: 'false',
			},
			dynamicParams: {
				executionPrice: expect.any(String),
				originalExecutionPrice: expect.any(String),
			},
		},
		aave3: {
			trailingStopLossDMA: {
				triggerTypeName: 'DmaAaveTrailingStopLoss',
				triggerType: '10006',
				triggerId: '10000000472',
				triggerData:
					'0x0000000000000000000000009a8999d48499743b5ca481210dc568018a3b417a0000000000000000000000000000000000000000000000000000000000002716000000000000000000000000000000000000000000000051540b83eb0f424800000000000000000000000000da10009cbd5d07dd0cecc66161fc93d7c9000da10000000000000000000000002f2a2543b76a4166549f7aab2e75bef0aefc5b0f436c6f7365414156455633506f736974696f6e5f3400000000000000000000000000000000000000000000006ce185860a4963106506c203335a2910413708e90000000000000000000000000000000000000000000000010000000000072024000000000000000000000000c5c8e77b397e531b8ec06bfb0048328b30e9ecfb00000000000000000000000000000000000000000000000100000000000030cc000000000000000000000000000000000000000000000000000003567d0bdc000000000000000000000000000000000000000000000000000000000000000000',
				decodedParams: {
					triggerType: '10006',
					positionAddress: '0x9a8999d48499743b5ca481210dc568018a3b417a',
					maxCoverage: '1500242349140000000000',
					debtToken: '0xda10009cbd5d07dd0cecc66161fc93d7c9000da1',
					collateralToken: '0x2f2a2543b76a4166549f7aab2e75bef0aefc5b0f',
					operationName: '0x436c6f7365414156455633506f736974696f6e5f340000000000000000000000',
					collateralOracle: '0x6ce185860a4963106506c203335a2910413708e9',
					collateralAddedRoundId: '18446744073710018596',
					debtOracle: '0xc5c8e77b397e531b8ec06bfb0048328b30e9ecfb',
					debtAddedRoundId: '18446744073709564108',
					trailingDistance: '3670000000000',
					closeToCollateral: 'false',
				},
				dynamicParams: {
					executionPrice: expect.any(String),
					originalExecutionPrice: expect.any(String),
				},
			},
		},
		spark: {},
	},
	flags: {
		aave3: {
			isStopLossEnabled: false,
			isBasicBuyEnabled: false,
			isBasicSellEnabled: false,
			isPartialTakeProfitEnabled: false,
			isTrailingStopLossEnabled: true,
		},
		spark: {
			isStopLossEnabled: false,
			isBasicBuyEnabled: false,
			isBasicSellEnabled: false,
			isPartialTakeProfitEnabled: false,
			isTrailingStopLossEnabled: false,
		},
		isAaveStopLossEnabled: true,
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
		aaveStopLoss: {
			triggerType: '10006',
			triggerId: '10000000472',
			triggerData:
				'0x0000000000000000000000009a8999d48499743b5ca481210dc568018a3b417a0000000000000000000000000000000000000000000000000000000000002716000000000000000000000000000000000000000000000051540b83eb0f424800000000000000000000000000da10009cbd5d07dd0cecc66161fc93d7c9000da10000000000000000000000002f2a2543b76a4166549f7aab2e75bef0aefc5b0f436c6f7365414156455633506f736974696f6e5f3400000000000000000000000000000000000000000000006ce185860a4963106506c203335a2910413708e90000000000000000000000000000000000000000000000010000000000072024000000000000000000000000c5c8e77b397e531b8ec06bfb0048328b30e9ecfb00000000000000000000000000000000000000000000000100000000000030cc000000000000000000000000000000000000000000000000000003567d0bdc000000000000000000000000000000000000000000000000000000000000000000',
			decodedParams: {
				triggerType: '10006',
				positionAddress: '0x9a8999d48499743b5ca481210dc568018a3b417a',
				maxCoverage: '1500242349140000000000',
				debtToken: '0xda10009cbd5d07dd0cecc66161fc93d7c9000da1',
				collateralToken: '0x2f2a2543b76a4166549f7aab2e75bef0aefc5b0f',
				operationName: '0x436c6f7365414156455633506f736974696f6e5f340000000000000000000000',
				collateralOracle: '0x6ce185860a4963106506c203335a2910413708e9',
				collateralAddedRoundId: '18446744073710018596',
				debtOracle: '0xc5c8e77b397e531b8ec06bfb0048328b30e9ecfb',
				debtAddedRoundId: '18446744073709564108',
				trailingDistance: '3670000000000',
				closeToCollateral: 'false',
			},
			dynamicParams: {
				executionPrice: expect.any(String),
				originalExecutionPrice: expect.any(String),
			},
		},
	},
	additionalData: {
		params: {
			account: '0x9a8999d48499743B5CA481210dc568018a3B417a',
			chainId: 42161,
			protocol: 'aavev3',
			getDetails: true,
		},
	},
};
