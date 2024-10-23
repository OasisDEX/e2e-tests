import { expect } from '#noWalletFixtures';

export const aaveV3ArbitrumStopLossAndProfitGetResponse = {
	triggers: {
		aavePartialTakeProfit: {
			triggerTypeName: 'DmaAavePartialTakeProfit',
			triggerType: '133',
			triggerId: '10000000466',
			triggerData:
				'0x0000000000000000000000005658e378371809d1aef8749ebad8d161cd90d33c00000000000000000000000000000000000000000000000000000000000000850000000000000000000000000000000000000000000000514b260065e1024400000000000000000000000000da10009cbd5d07dd0cecc66161fc93d7c9000da100000000000000000000000082af49447d8a07e3bd95bd0d56f35241523fbab141415645563357697468647261775f6175746f0000000000000000000000000000000000000000000000000000000000000000000000000000000000000003e800000000000000000000000000000000000000000000000000000000000005dc0000000000000000000000000000000000000000000000000000008bb2c9700000000000000000000000000000000000000000000000000000000000000000640000000000000000000000000000000000000000000000000000000000000000',
			decodedParams: {
				triggerType: '133',
				positionAddress: '0x5658e378371809d1aef8749ebad8d161cd90d33c',
				maxCoverage: '1499601286010000000000',
				debtToken: '0xda10009cbd5d07dd0cecc66161fc93d7c9000da1',
				collateralToken: '0x82af49447d8a07e3bd95bd0d56f35241523fbab1',
				operationName: '0x41415645563357697468647261775f6175746f00000000000000000000000000',
				withdrawToDebt: 'false',
				executionLtv: '1000',
				targetLtv: '1500',
				deviation: '100',
				executionPrice: '600000000000',
			},
			dynamicParams: {
				nextProfit: {
					triggerPrice: '600000000000',
					realizedProfitInCollateral: {
						balance: expect.any(String),
						token: {
							decimals: 18,
							symbol: 'WETH',
							address: '0x82af49447d8a07e3bd95bd0d56f35241523fbab1',
						},
					},
					realizedProfitInDebt: {
						balance: expect.any(String),
						token: {
							decimals: 18,
							symbol: 'DAI',
							address: '0xda10009cbd5d07dd0cecc66161fc93d7c9000da1',
						},
					},
					totalProfitInCollateral: {
						balance: expect.any(String),
						token: {
							decimals: 18,
							symbol: 'WETH',
							address: '0x82af49447d8a07e3bd95bd0d56f35241523fbab1',
						},
					},
					totalProfitInDebt: {
						balance: expect.any(String),
						token: {
							decimals: 18,
							symbol: 'DAI',
							address: '0xda10009cbd5d07dd0cecc66161fc93d7c9000da1',
						},
					},
					fee: {
						balance: '0',
						token: {
							decimals: 18,
							symbol: 'WETH',
							address: '0x82af49447d8a07e3bd95bd0d56f35241523fbab1',
						},
					},
					totalFee: {
						balance: '0',
						token: {
							decimals: 18,
							symbol: 'WETH',
							address: '0x82af49447d8a07e3bd95bd0d56f35241523fbab1',
						},
					},
					stopLossDynamicPrice: expect.any(String),
				},
			},
		},
		aaveStopLossToCollateralDMA: {
			triggerTypeName: 'DmaAaveStopLossToCollateralV2',
			triggerType: '127',
			triggerId: '10000000467',
			triggerData:
				'0x0000000000000000000000005658e378371809d1aef8749ebad8d161cd90d33c000000000000000000000000000000000000000000000000000000000000007f0000000000000000000000000000000000000000000000514b260065e1024400000000000000000000000000da10009cbd5d07dd0cecc66161fc93d7c9000da100000000000000000000000082af49447d8a07e3bd95bd0d56f35241523fbab1436c6f7365416e6452656d61696e414156455633506f736974696f6e000000000000000000000000000000000000000000000000000000000000000000001fcc',
			decodedParams: {
				positionAddress: '0x5658e378371809d1aef8749ebad8d161cd90d33c',
				triggerType: '127',
				maxCoverage: '1499601286010000000000',
				executionLtv: '8140',
				debtToken: '0xda10009cbd5d07dd0cecc66161fc93d7c9000da1',
				collateralToken: '0x82af49447d8a07e3bd95bd0d56f35241523fbab1',
				operationName: '0x436c6f7365416e6452656d61696e414156455633506f736974696f6e00000000',
			},
		},
		aave3: {
			partialTakeProfit: {
				triggerTypeName: 'DmaAavePartialTakeProfit',
				triggerType: '133',
				triggerId: '10000000466',
				triggerData:
					'0x0000000000000000000000005658e378371809d1aef8749ebad8d161cd90d33c00000000000000000000000000000000000000000000000000000000000000850000000000000000000000000000000000000000000000514b260065e1024400000000000000000000000000da10009cbd5d07dd0cecc66161fc93d7c9000da100000000000000000000000082af49447d8a07e3bd95bd0d56f35241523fbab141415645563357697468647261775f6175746f0000000000000000000000000000000000000000000000000000000000000000000000000000000000000003e800000000000000000000000000000000000000000000000000000000000005dc0000000000000000000000000000000000000000000000000000008bb2c9700000000000000000000000000000000000000000000000000000000000000000640000000000000000000000000000000000000000000000000000000000000000',
				decodedParams: {
					triggerType: '133',
					positionAddress: '0x5658e378371809d1aef8749ebad8d161cd90d33c',
					maxCoverage: '1499601286010000000000',
					debtToken: '0xda10009cbd5d07dd0cecc66161fc93d7c9000da1',
					collateralToken: '0x82af49447d8a07e3bd95bd0d56f35241523fbab1',
					operationName: '0x41415645563357697468647261775f6175746f00000000000000000000000000',
					withdrawToDebt: 'false',
					executionLtv: '1000',
					targetLtv: '1500',
					deviation: '100',
					executionPrice: '600000000000',
				},
				dynamicParams: {
					nextProfit: {
						triggerPrice: '600000000000',
						realizedProfitInCollateral: {
							balance: expect.any(String),
							token: {
								decimals: 18,
								symbol: 'WETH',
								address: '0x82af49447d8a07e3bd95bd0d56f35241523fbab1',
							},
						},
						realizedProfitInDebt: {
							balance: expect.any(String),
							token: {
								decimals: 18,
								symbol: 'DAI',
								address: '0xda10009cbd5d07dd0cecc66161fc93d7c9000da1',
							},
						},
						totalProfitInCollateral: {
							balance: expect.any(String),
							token: {
								decimals: 18,
								symbol: 'WETH',
								address: '0x82af49447d8a07e3bd95bd0d56f35241523fbab1',
							},
						},
						totalProfitInDebt: {
							balance: expect.any(String),
							token: {
								decimals: 18,
								symbol: 'DAI',
								address: '0xda10009cbd5d07dd0cecc66161fc93d7c9000da1',
							},
						},
						fee: {
							balance: '0',
							token: {
								decimals: 18,
								symbol: 'WETH',
								address: '0x82af49447d8a07e3bd95bd0d56f35241523fbab1',
							},
						},
						totalFee: {
							balance: '0',
							token: {
								decimals: 18,
								symbol: 'WETH',
								address: '0x82af49447d8a07e3bd95bd0d56f35241523fbab1',
							},
						},
						stopLossDynamicPrice: expect.any(String),
					},
				},
			},
			stopLossToCollateralDMA: {
				triggerTypeName: 'DmaAaveStopLossToCollateralV2',
				triggerType: '127',
				triggerId: '10000000467',
				triggerData:
					'0x0000000000000000000000005658e378371809d1aef8749ebad8d161cd90d33c000000000000000000000000000000000000000000000000000000000000007f0000000000000000000000000000000000000000000000514b260065e1024400000000000000000000000000da10009cbd5d07dd0cecc66161fc93d7c9000da100000000000000000000000082af49447d8a07e3bd95bd0d56f35241523fbab1436c6f7365416e6452656d61696e414156455633506f736974696f6e000000000000000000000000000000000000000000000000000000000000000000001fcc',
				decodedParams: {
					positionAddress: '0x5658e378371809d1aef8749ebad8d161cd90d33c',
					triggerType: '127',
					maxCoverage: '1499601286010000000000',
					executionLtv: '8140',
					debtToken: '0xda10009cbd5d07dd0cecc66161fc93d7c9000da1',
					collateralToken: '0x82af49447d8a07e3bd95bd0d56f35241523fbab1',
					operationName: '0x436c6f7365416e6452656d61696e414156455633506f736974696f6e00000000',
				},
			},
		},
		spark: {},
	},
	flags: {
		aave3: {
			isStopLossEnabled: true,
			isBasicBuyEnabled: false,
			isBasicSellEnabled: false,
			isPartialTakeProfitEnabled: true,
			isTrailingStopLossEnabled: false,
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
		isAavePartialTakeProfitEnabled: true,
		isSparkStopLossEnabled: false,
		isSparkBasicBuyEnabled: false,
		isSparkBasicSellEnabled: false,
		isSparkPartialTakeProfitEnabled: false,
	},
	triggersCount: 2,
	triggerGroup: {
		aavePartialTakeProfit: {
			triggerType: '133',
			triggerId: '10000000466',
			triggerData:
				'0x0000000000000000000000005658e378371809d1aef8749ebad8d161cd90d33c00000000000000000000000000000000000000000000000000000000000000850000000000000000000000000000000000000000000000514b260065e1024400000000000000000000000000da10009cbd5d07dd0cecc66161fc93d7c9000da100000000000000000000000082af49447d8a07e3bd95bd0d56f35241523fbab141415645563357697468647261775f6175746f0000000000000000000000000000000000000000000000000000000000000000000000000000000000000003e800000000000000000000000000000000000000000000000000000000000005dc0000000000000000000000000000000000000000000000000000008bb2c9700000000000000000000000000000000000000000000000000000000000000000640000000000000000000000000000000000000000000000000000000000000000',
			decodedParams: {
				triggerType: '133',
				positionAddress: '0x5658e378371809d1aef8749ebad8d161cd90d33c',
				maxCoverage: '1499601286010000000000',
				debtToken: '0xda10009cbd5d07dd0cecc66161fc93d7c9000da1',
				collateralToken: '0x82af49447d8a07e3bd95bd0d56f35241523fbab1',
				operationName: '0x41415645563357697468647261775f6175746f00000000000000000000000000',
				withdrawToDebt: 'false',
				executionLtv: '1000',
				targetLtv: '1500',
				deviation: '100',
				executionPrice: '600000000000',
			},
			dynamicParams: {
				nextProfit: {
					triggerPrice: '600000000000',
					realizedProfitInCollateral: {
						balance: expect.any(String),
						token: {
							decimals: 18,
							symbol: 'WETH',
							address: '0x82af49447d8a07e3bd95bd0d56f35241523fbab1',
						},
					},
					realizedProfitInDebt: {
						balance: expect.any(String),
						token: {
							decimals: 18,
							symbol: 'DAI',
							address: '0xda10009cbd5d07dd0cecc66161fc93d7c9000da1',
						},
					},
					totalProfitInCollateral: {
						balance: expect.any(String),
						token: {
							decimals: 18,
							symbol: 'WETH',
							address: '0x82af49447d8a07e3bd95bd0d56f35241523fbab1',
						},
					},
					totalProfitInDebt: {
						balance: expect.any(String),
						token: {
							decimals: 18,
							symbol: 'DAI',
							address: '0xda10009cbd5d07dd0cecc66161fc93d7c9000da1',
						},
					},
					fee: {
						balance: '0',
						token: {
							decimals: 18,
							symbol: 'WETH',
							address: '0x82af49447d8a07e3bd95bd0d56f35241523fbab1',
						},
					},
					totalFee: {
						balance: '0',
						token: {
							decimals: 18,
							symbol: 'WETH',
							address: '0x82af49447d8a07e3bd95bd0d56f35241523fbab1',
						},
					},
					stopLossDynamicPrice: expect.any(String),
				},
			},
		},
		aaveStopLoss: {
			triggerType: '127',
			triggerId: '10000000467',
			triggerData:
				'0x0000000000000000000000005658e378371809d1aef8749ebad8d161cd90d33c000000000000000000000000000000000000000000000000000000000000007f0000000000000000000000000000000000000000000000514b260065e1024400000000000000000000000000da10009cbd5d07dd0cecc66161fc93d7c9000da100000000000000000000000082af49447d8a07e3bd95bd0d56f35241523fbab1436c6f7365416e6452656d61696e414156455633506f736974696f6e000000000000000000000000000000000000000000000000000000000000000000001fcc',
			decodedParams: {
				positionAddress: '0x5658e378371809d1aef8749ebad8d161cd90d33c',
				triggerType: '127',
				maxCoverage: '1499601286010000000000',
				executionLtv: '8140',
				debtToken: '0xda10009cbd5d07dd0cecc66161fc93d7c9000da1',
				collateralToken: '0x82af49447d8a07e3bd95bd0d56f35241523fbab1',
				operationName: '0x436c6f7365416e6452656d61696e414156455633506f736974696f6e00000000',
			},
		},
	},
	additionalData: {
		params: {
			account: '0x5658E378371809d1aEF8749eBAD8D161CD90D33c',
			chainId: 42161,
			protocol: 'aavev3',
			getDetails: true,
		},
	},
};
