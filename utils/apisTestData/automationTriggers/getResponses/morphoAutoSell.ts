import { expect } from '#noWalletFixtures';

export const morphoAutoSellGetResponse = {
	triggers: {
		aavePartialTakeProfit: {
			triggerTypeName: 'DmaAavePartialTakeProfit',
			triggerType: '133',
			triggerId: '10000000656',
			triggerData:
				'0x0000000000000000000000002e0515d7a3ea0276f28c94c426c5d2d1d85fd4d5000000000000000000000000000000000000000000000000000000000000008500000000000000000000000000000000000000000000000000000000596a9a1b000000000000000000000000a0b86991c6218b36c1d19d4a2e9eb0ce3606eb480000000000000000000000007f39c581f595b53c5cb19bd0b3f8da6c935e2ca04141564556335769746864726177546f446562745f6175746f000000000000000000000000000000000000000000000000000000000000000000000000000bc20000000000000000000000000000000000000000000000000000000000000db6000000000000000000000000000000000000000000000000000000a2fb40580000000000000000000000000000000000000000000000000000000000000000640000000000000000000000000000000000000000000000000000000000000001',
			decodedParams: {
				triggerType: '133',
				positionAddress: '0x2e0515d7a3ea0276f28c94c426c5d2d1d85fd4d5',
				maxCoverage: '1500158491',
				debtToken: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
				collateralToken: '0x7f39c581f595b53c5cb19bd0b3f8da6c935e2ca0',
				operationName: '0x4141564556335769746864726177546f446562745f6175746f00000000000000',
				withdrawToDebt: 'true',
				executionLtv: '3010',
				targetLtv: '3510',
				deviation: '100',
				executionPrice: '700000000000',
			},
			dynamicParams: {
				nextProfit: {
					triggerPrice: '700000000000',
					realizedProfitInCollateral: {
						balance: expect.any(String),
						token: {
							decimals: 18,
							symbol: 'wstETH',
							address: '0x7f39c581f595b53c5cb19bd0b3f8da6c935e2ca0',
						},
					},
					realizedProfitInDebt: {
						balance: expect.any(String),
						token: {
							decimals: 6,
							symbol: 'USDC',
							address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
						},
					},
					totalProfitInCollateral: {
						balance: expect.any(String),
						token: {
							decimals: 18,
							symbol: 'wstETH',
							address: '0x7f39c581f595b53c5cb19bd0b3f8da6c935e2ca0',
						},
					},
					totalProfitInDebt: {
						balance: expect.any(String),
						token: {
							decimals: 6,
							symbol: 'USDC',
							address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
						},
					},
					stopLossDynamicPrice: '317441860465',
					fee: {
						balance: expect.any(String),
						token: {
							decimals: 18,
							symbol: 'wstETH',
							address: '0x7f39c581f595b53c5cb19bd0b3f8da6c935e2ca0',
						},
					},
					totalFee: {
						balance: expect.any(String),
						token: {
							decimals: 18,
							symbol: 'wstETH',
							address: '0x7f39c581f595b53c5cb19bd0b3f8da6c935e2ca0',
						},
					},
				},
			},
		},
		aaveStopLossToCollateralDMA: {
			triggerTypeName: 'DmaAaveStopLossToCollateralV2',
			triggerType: '127',
			triggerId: '10000000657',
			triggerData:
				'0x0000000000000000000000002e0515d7a3ea0276f28c94c426c5d2d1d85fd4d5000000000000000000000000000000000000000000000000000000000000007f00000000000000000000000000000000000000000000000000000000596a9a1b000000000000000000000000a0b86991c6218b36c1d19d4a2e9eb0ce3606eb480000000000000000000000007f39c581f595b53c5cb19bd0b3f8da6c935e2ca0436c6f7365416e6452656d61696e414156455633506f736974696f6e000000000000000000000000000000000000000000000000000000000000000000001e3c',
			decodedParams: {
				positionAddress: '0x2e0515d7a3ea0276f28c94c426c5d2d1d85fd4d5',
				triggerType: '127',
				maxCoverage: '1500158491',
				executionLtv: '7740',
				debtToken: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
				collateralToken: '0x7f39c581f595b53c5cb19bd0b3f8da6c935e2ca0',
				operationName: '0x436c6f7365416e6452656d61696e414156455633506f736974696f6e00000000',
			},
		},
		aave3: {
			partialTakeProfit: {
				triggerTypeName: 'DmaAavePartialTakeProfit',
				triggerType: '133',
				triggerId: '10000000656',
				triggerData:
					'0x0000000000000000000000002e0515d7a3ea0276f28c94c426c5d2d1d85fd4d5000000000000000000000000000000000000000000000000000000000000008500000000000000000000000000000000000000000000000000000000596a9a1b000000000000000000000000a0b86991c6218b36c1d19d4a2e9eb0ce3606eb480000000000000000000000007f39c581f595b53c5cb19bd0b3f8da6c935e2ca04141564556335769746864726177546f446562745f6175746f000000000000000000000000000000000000000000000000000000000000000000000000000bc20000000000000000000000000000000000000000000000000000000000000db6000000000000000000000000000000000000000000000000000000a2fb40580000000000000000000000000000000000000000000000000000000000000000640000000000000000000000000000000000000000000000000000000000000001',
				decodedParams: {
					triggerType: '133',
					positionAddress: '0x2e0515d7a3ea0276f28c94c426c5d2d1d85fd4d5',
					maxCoverage: '1500158491',
					debtToken: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
					collateralToken: '0x7f39c581f595b53c5cb19bd0b3f8da6c935e2ca0',
					operationName: '0x4141564556335769746864726177546f446562745f6175746f00000000000000',
					withdrawToDebt: 'true',
					executionLtv: '3010',
					targetLtv: '3510',
					deviation: '100',
					executionPrice: '700000000000',
				},
				dynamicParams: {
					nextProfit: {
						triggerPrice: '700000000000',
						realizedProfitInCollateral: {
							balance: expect.any(String),
							token: {
								decimals: 18,
								symbol: 'wstETH',
								address: '0x7f39c581f595b53c5cb19bd0b3f8da6c935e2ca0',
							},
						},
						realizedProfitInDebt: {
							balance: expect.any(String),
							token: {
								decimals: 6,
								symbol: 'USDC',
								address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
							},
						},
						totalProfitInCollateral: {
							balance: expect.any(String),
							token: {
								decimals: 18,
								symbol: 'wstETH',
								address: '0x7f39c581f595b53c5cb19bd0b3f8da6c935e2ca0',
							},
						},
						totalProfitInDebt: {
							balance: expect.any(String),
							token: {
								decimals: 6,
								symbol: 'USDC',
								address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
							},
						},
						stopLossDynamicPrice: '317441860465',
						fee: {
							balance: expect.any(String),
							token: {
								decimals: 18,
								symbol: 'wstETH',
								address: '0x7f39c581f595b53c5cb19bd0b3f8da6c935e2ca0',
							},
						},
						totalFee: {
							balance: expect.any(String),
							token: {
								decimals: 18,
								symbol: 'wstETH',
								address: '0x7f39c581f595b53c5cb19bd0b3f8da6c935e2ca0',
							},
						},
					},
				},
			},
			stopLossToCollateralDMA: {
				triggerTypeName: 'DmaAaveStopLossToCollateralV2',
				triggerType: '127',
				triggerId: '10000000657',
				triggerData:
					'0x0000000000000000000000002e0515d7a3ea0276f28c94c426c5d2d1d85fd4d5000000000000000000000000000000000000000000000000000000000000007f00000000000000000000000000000000000000000000000000000000596a9a1b000000000000000000000000a0b86991c6218b36c1d19d4a2e9eb0ce3606eb480000000000000000000000007f39c581f595b53c5cb19bd0b3f8da6c935e2ca0436c6f7365416e6452656d61696e414156455633506f736974696f6e000000000000000000000000000000000000000000000000000000000000000000001e3c',
				decodedParams: {
					positionAddress: '0x2e0515d7a3ea0276f28c94c426c5d2d1d85fd4d5',
					triggerType: '127',
					maxCoverage: '1500158491',
					executionLtv: '7740',
					debtToken: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
					collateralToken: '0x7f39c581f595b53c5cb19bd0b3f8da6c935e2ca0',
					operationName: '0x436c6f7365416e6452656d61696e414156455633506f736974696f6e00000000',
				},
			},
		},
		spark: {},
		'morphoblue-0x3a85e619751152991742810df6ec69ce473daef99e28a64ab2340d7b7ccfee49': {
			basicSell: {
				triggerTypeName: 'MorphoBlueBasicSellV2',
				triggerType: '140',
				triggerId: '10000000648',
				triggerData:
					'0x0000000000000000000000002e0515d7a3ea0276f28c94c426c5d2d1d85fd4d5000000000000000000000000000000000000000000000000000000000000008c0000000000000000000000000000000000000000000000000214e8348c4f0000000000000000000000000000a0b86991c6218b36c1d19d4a2e9eb0ce3606eb480000000000000000000000002260fac5e5542a773aa44fbcfedf7c193bc2c5994d6f7270686f426c756541646a7573745269736b446f776e00000000000000003a85e619751152991742810df6ec69ce473daef99e28a64ab2340d7b7ccfee490000000000000000000000000000000000000000000000000000000000001f400000000000000000000000000000000000000000000000000000000000001c8400000000000000000000000000000000259da6542d43623d04c51120000000000000000000000000000000000000000000000000000000000000000000000064000000000000000000000000000000000000000000000000000000000000012c',
				decodedParams: {
					minSellPrice: '500000000000',
					positionAddress: '0x2e0515d7a3ea0276f28c94c426c5d2d1d85fd4d5',
					triggerType: '140',
					maxCoverage: '150000000000000000',
					debtToken: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
					collateralToken: '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599',
					operationName: '0x4d6f7270686f426c756541646a7573745269736b446f776e0000000000000000',
					executionLtv: '8000',
					targetLtv: '7300',
					deviation: '100',
					maxBaseFeeInGwei: '300',
				},
			},
		},
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
		'morphoblue-0x3a85e619751152991742810df6ec69ce473daef99e28a64ab2340d7b7ccfee49': {
			isStopLossEnabled: false,
			isBasicBuyEnabled: false,
			isBasicSellEnabled: true,
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
	triggersCount: 8,
	triggerGroup: {
		aavePartialTakeProfit: {
			triggerType: '133',
			triggerId: '10000000656',
			triggerData:
				'0x0000000000000000000000002e0515d7a3ea0276f28c94c426c5d2d1d85fd4d5000000000000000000000000000000000000000000000000000000000000008500000000000000000000000000000000000000000000000000000000596a9a1b000000000000000000000000a0b86991c6218b36c1d19d4a2e9eb0ce3606eb480000000000000000000000007f39c581f595b53c5cb19bd0b3f8da6c935e2ca04141564556335769746864726177546f446562745f6175746f000000000000000000000000000000000000000000000000000000000000000000000000000bc20000000000000000000000000000000000000000000000000000000000000db6000000000000000000000000000000000000000000000000000000a2fb40580000000000000000000000000000000000000000000000000000000000000000640000000000000000000000000000000000000000000000000000000000000001',
			decodedParams: {
				triggerType: '133',
				positionAddress: '0x2e0515d7a3ea0276f28c94c426c5d2d1d85fd4d5',
				maxCoverage: '1500158491',
				debtToken: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
				collateralToken: '0x7f39c581f595b53c5cb19bd0b3f8da6c935e2ca0',
				operationName: '0x4141564556335769746864726177546f446562745f6175746f00000000000000',
				withdrawToDebt: 'true',
				executionLtv: '3010',
				targetLtv: '3510',
				deviation: '100',
				executionPrice: '700000000000',
			},
			dynamicParams: {
				nextProfit: {
					triggerPrice: '700000000000',
					realizedProfitInCollateral: {
						balance: expect.any(String),
						token: {
							decimals: 18,
							symbol: 'wstETH',
							address: '0x7f39c581f595b53c5cb19bd0b3f8da6c935e2ca0',
						},
					},
					realizedProfitInDebt: {
						balance: expect.any(String),
						token: {
							decimals: 6,
							symbol: 'USDC',
							address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
						},
					},
					totalProfitInCollateral: {
						balance: expect.any(String),
						token: {
							decimals: 18,
							symbol: 'wstETH',
							address: '0x7f39c581f595b53c5cb19bd0b3f8da6c935e2ca0',
						},
					},
					totalProfitInDebt: {
						balance: expect.any(String),
						token: {
							decimals: 6,
							symbol: 'USDC',
							address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
						},
					},
					stopLossDynamicPrice: '317441860465',
					fee: {
						balance: expect.any(String),
						token: {
							decimals: 18,
							symbol: 'wstETH',
							address: '0x7f39c581f595b53c5cb19bd0b3f8da6c935e2ca0',
						},
					},
					totalFee: {
						balance: expect.any(String),
						token: {
							decimals: 18,
							symbol: 'wstETH',
							address: '0x7f39c581f595b53c5cb19bd0b3f8da6c935e2ca0',
						},
					},
				},
			},
		},
		aaveStopLoss: {
			triggerType: '127',
			triggerId: '10000000657',
			triggerData:
				'0x0000000000000000000000002e0515d7a3ea0276f28c94c426c5d2d1d85fd4d5000000000000000000000000000000000000000000000000000000000000007f00000000000000000000000000000000000000000000000000000000596a9a1b000000000000000000000000a0b86991c6218b36c1d19d4a2e9eb0ce3606eb480000000000000000000000007f39c581f595b53c5cb19bd0b3f8da6c935e2ca0436c6f7365416e6452656d61696e414156455633506f736974696f6e000000000000000000000000000000000000000000000000000000000000000000001e3c',
			decodedParams: {
				positionAddress: '0x2e0515d7a3ea0276f28c94c426c5d2d1d85fd4d5',
				triggerType: '127',
				maxCoverage: '1500158491',
				executionLtv: '7740',
				debtToken: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
				collateralToken: '0x7f39c581f595b53c5cb19bd0b3f8da6c935e2ca0',
				operationName: '0x436c6f7365416e6452656d61696e414156455633506f736974696f6e00000000',
			},
		},
		morphoBlueBasicSell: {
			triggerType: '140',
			triggerId: '10000000648',
			triggerData:
				'0x0000000000000000000000002e0515d7a3ea0276f28c94c426c5d2d1d85fd4d5000000000000000000000000000000000000000000000000000000000000008c0000000000000000000000000000000000000000000000000214e8348c4f0000000000000000000000000000a0b86991c6218b36c1d19d4a2e9eb0ce3606eb480000000000000000000000002260fac5e5542a773aa44fbcfedf7c193bc2c5994d6f7270686f426c756541646a7573745269736b446f776e00000000000000003a85e619751152991742810df6ec69ce473daef99e28a64ab2340d7b7ccfee490000000000000000000000000000000000000000000000000000000000001f400000000000000000000000000000000000000000000000000000000000001c8400000000000000000000000000000000259da6542d43623d04c51120000000000000000000000000000000000000000000000000000000000000000000000064000000000000000000000000000000000000000000000000000000000000012c',
			decodedParams: {
				minSellPrice: '500000000000',
				positionAddress: '0x2e0515d7a3ea0276f28c94c426c5d2d1d85fd4d5',
				triggerType: '140',
				maxCoverage: '150000000000000000',
				debtToken: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
				collateralToken: '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599',
				operationName: '0x4d6f7270686f426c756541646a7573745269736b446f776e0000000000000000',
				executionLtv: '8000',
				targetLtv: '7300',
				deviation: '100',
				maxBaseFeeInGwei: '300',
			},
		},
	},
	additionalData: {
		params: {
			dpm: '0x2e0515d7A3eA0276F28c94C426c5d2D1d85FD4d5',
			poolId: '0x3a85e619751152991742810df6ec69ce473daef99e28a64ab2340d7b7ccfee49',
			chainId: 1,
			getDetails: true,
		},
	},
};
