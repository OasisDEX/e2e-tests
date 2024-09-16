import { expect } from '#noWalletFixtures';

export const morphoStopLossBuyAndProfitResponse = {
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
		'morphoblue-0xc54d7acf14de29e0e5527cabd7a576506870346a78a11a6762e2cca66322ec41': {
			basicBuy: {
				triggerTypeName: 'MorphoBlueBasicBuyV2',
				triggerType: '139',
				triggerId: '10000000626',
				triggerData:
					'0x0000000000000000000000002e0515d7a3ea0276f28c94c426c5d2d1d85fd4d5000000000000000000000000000000000000000000000000000000000000008b00000000000000000000000000000000000000000000000008b5130d153eec00000000000000000000000000c02aaa39b223fe8d0a0e5c4f27ead9083c756cc20000000000000000000000007f39c581f595b53c5cb19bd0b3f8da6c935e2ca04d6f7270686f426c756541646a7573745269736b55705f320000000000000000c54d7acf14de29e0e5527cabd7a576506870346a78a11a6762e2cca66322ec41000000000000000000000000000000000000000000000000000000000000001200000000000000000000000000000000000000000000000000000000000000120000000000000000000000000000000000000000000000000000000000000bb800000000000000000000000000000000000000000000000000000000000010cc000000000000000000000000000000000241c76b735b154119e2dd30000000000000000000000000000000000000000000000000000000000000000000000064000000000000000000000000000000000000000000000000000000000000012c',
				decodedParams: {
					maxBuyPrice: '300000000',
					positionAddress: '0x2e0515d7a3ea0276f28c94c426c5d2d1d85fd4d5',
					triggerType: '139',
					maxCoverage: '627428670000000000',
					debtToken: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
					collateralToken: '0x7f39c581f595b53c5cb19bd0b3f8da6c935e2ca0',
					operationName: '0x4d6f7270686f426c756541646a7573745269736b55705f320000000000000000',
					executionLtv: '3000',
					targetLtv: '4300',
					deviation: '100',
					maxBaseFeeInGwei: '300',
				},
			},
			partialTakeProfit: {
				triggerTypeName: 'MorphoBluePartialTakeProfit',
				triggerType: '141',
				triggerId: '10000000658',
				triggerData:
					'0x0000000000000000000000002e0515d7a3ea0276f28c94c426c5d2d1d85fd4d5000000000000000000000000000000000000000000000000000000000000008d00000000000000000000000000000000000000000000000008e438747f816000000000000000000000000000c02aaa39b223fe8d0a0e5c4f27ead9083c756cc20000000000000000000000007f39c581f595b53c5cb19bd0b3f8da6c935e2ca04d6f7270686f426c75655769746864726177546f446562745f6175746f5f3200c54d7acf14de29e0e5527cabd7a576506870346a78a11a6762e2cca66322ec410000000000000000000000000000000000000000000000000000000000000dfc0000000000000000000000000000000000000000000000000000000000000ff00000000000000000000000000000000000000000000000000000000014dc938000000000000000000000000000000000000000000000000000000000000000640000000000000000000000000000000000000000000000000000000000000001',
				decodedParams: {
					triggerType: '141',
					positionAddress: '0x2e0515d7a3ea0276f28c94c426c5d2d1d85fd4d5',
					maxCoverage: '640699120000000000',
					debtToken: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
					collateralToken: '0x7f39c581f595b53c5cb19bd0b3f8da6c935e2ca0',
					operationName: '0x4d6f7270686f426c75655769746864726177546f446562745f6175746f5f3200',
					withdrawToDebt: 'true',
					executionLtv: '3580',
					targetLtv: '4080',
					deviation: '100',
					poolId: '0xc54d7acf14de29e0e5527cabd7a576506870346a78a11a6762e2cca66322ec41',
					executionPrice: '350000000',
				},
				dynamicParams: {
					nextProfit: {
						triggerPrice: '350000000',
						realizedProfitInCollateral: {
							balance: expect.any(String),
							token: {
								decimals: 18,
								symbol: 'wstETH',
								address: '0x7f39c581f595b53c5cb19bd0b3f8da6c935e2ca0',
							},
						},
						realizedProfitInDebt: {
							balance: '4516726112067095',
							token: {
								decimals: 18,
								symbol: 'WETH',
								address: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
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
							balance: '4516726112067095',
							token: {
								decimals: 18,
								symbol: 'WETH',
								address: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
							},
						},
						stopLossDynamicPrice: '153548387',
						fee: {
							balance: '2588747414501',
							token: {
								decimals: 18,
								symbol: 'wstETH',
								address: '0x7f39c581f595b53c5cb19bd0b3f8da6c935e2ca0',
							},
						},
						totalFee: {
							balance: '2588747414501',
							token: {
								decimals: 18,
								symbol: 'wstETH',
								address: '0x7f39c581f595b53c5cb19bd0b3f8da6c935e2ca0',
							},
						},
					},
				},
			},
			stopLoss: {
				triggerTypeName: 'MorphoBlueStopLossV2',
				triggerType: '142',
				triggerId: '10000000659',
				triggerData:
					'0x0000000000000000000000002e0515d7a3ea0276f28c94c426c5d2d1d85fd4d5000000000000000000000000000000000000000000000000000000000000008e00000000000000000000000000000000000000000000000008e438747f816000000000000000000000000000c02aaa39b223fe8d0a0e5c4f27ead9083c756cc20000000000000000000000007f39c581f595b53c5cb19bd0b3f8da6c935e2ca04d6f7270686f426c7565436c6f7365416e6452656d61696e5f6175746f000000c54d7acf14de29e0e5527cabd7a576506870346a78a11a6762e2cca66322ec4100000000000000000000000000000000000000000000000000000000000024540000000000000000000000000000000000000000000000000000000000000000',
				decodedParams: {
					positionAddress: '0x2e0515d7a3ea0276f28c94c426c5d2d1d85fd4d5',
					triggerType: '142',
					maxCoverage: '640699120000000000',
					executionLtv: '9300',
					debtToken: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
					collateralToken: '0x7f39c581f595b53c5cb19bd0b3f8da6c935e2ca0',
					operationName: '0x4d6f7270686f426c7565436c6f7365416e6452656d61696e5f6175746f000000',
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
		'morphoblue-0xc54d7acf14de29e0e5527cabd7a576506870346a78a11a6762e2cca66322ec41': {
			isStopLossEnabled: true,
			isBasicBuyEnabled: true,
			isBasicSellEnabled: false,
			isPartialTakeProfitEnabled: true,
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
		morphoBlueBasicBuy: {
			triggerType: '139',
			triggerId: '10000000626',
			triggerData:
				'0x0000000000000000000000002e0515d7a3ea0276f28c94c426c5d2d1d85fd4d5000000000000000000000000000000000000000000000000000000000000008b00000000000000000000000000000000000000000000000008b5130d153eec00000000000000000000000000c02aaa39b223fe8d0a0e5c4f27ead9083c756cc20000000000000000000000007f39c581f595b53c5cb19bd0b3f8da6c935e2ca04d6f7270686f426c756541646a7573745269736b55705f320000000000000000c54d7acf14de29e0e5527cabd7a576506870346a78a11a6762e2cca66322ec41000000000000000000000000000000000000000000000000000000000000001200000000000000000000000000000000000000000000000000000000000000120000000000000000000000000000000000000000000000000000000000000bb800000000000000000000000000000000000000000000000000000000000010cc000000000000000000000000000000000241c76b735b154119e2dd30000000000000000000000000000000000000000000000000000000000000000000000064000000000000000000000000000000000000000000000000000000000000012c',
			decodedParams: {
				maxBuyPrice: '300000000',
				positionAddress: '0x2e0515d7a3ea0276f28c94c426c5d2d1d85fd4d5',
				triggerType: '139',
				maxCoverage: '627428670000000000',
				debtToken: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
				collateralToken: '0x7f39c581f595b53c5cb19bd0b3f8da6c935e2ca0',
				operationName: '0x4d6f7270686f426c756541646a7573745269736b55705f320000000000000000',
				executionLtv: '3000',
				targetLtv: '4300',
				deviation: '100',
				maxBaseFeeInGwei: '300',
			},
		},
		morphoBluePartialTakeProfit: {
			triggerType: '141',
			triggerId: '10000000658',
			triggerData:
				'0x0000000000000000000000002e0515d7a3ea0276f28c94c426c5d2d1d85fd4d5000000000000000000000000000000000000000000000000000000000000008d00000000000000000000000000000000000000000000000008e438747f816000000000000000000000000000c02aaa39b223fe8d0a0e5c4f27ead9083c756cc20000000000000000000000007f39c581f595b53c5cb19bd0b3f8da6c935e2ca04d6f7270686f426c75655769746864726177546f446562745f6175746f5f3200c54d7acf14de29e0e5527cabd7a576506870346a78a11a6762e2cca66322ec410000000000000000000000000000000000000000000000000000000000000dfc0000000000000000000000000000000000000000000000000000000000000ff00000000000000000000000000000000000000000000000000000000014dc938000000000000000000000000000000000000000000000000000000000000000640000000000000000000000000000000000000000000000000000000000000001',
			decodedParams: {
				triggerType: '141',
				positionAddress: '0x2e0515d7a3ea0276f28c94c426c5d2d1d85fd4d5',
				maxCoverage: '640699120000000000',
				debtToken: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
				collateralToken: '0x7f39c581f595b53c5cb19bd0b3f8da6c935e2ca0',
				operationName: '0x4d6f7270686f426c75655769746864726177546f446562745f6175746f5f3200',
				withdrawToDebt: 'true',
				executionLtv: '3580',
				targetLtv: '4080',
				deviation: '100',
				poolId: '0xc54d7acf14de29e0e5527cabd7a576506870346a78a11a6762e2cca66322ec41',
				executionPrice: '350000000',
			},
			dynamicParams: {
				nextProfit: {
					triggerPrice: '350000000',
					realizedProfitInCollateral: {
						balance: expect.any(String),
						token: {
							decimals: 18,
							symbol: 'wstETH',
							address: '0x7f39c581f595b53c5cb19bd0b3f8da6c935e2ca0',
						},
					},
					realizedProfitInDebt: {
						balance: '4516726112067095',
						token: {
							decimals: 18,
							symbol: 'WETH',
							address: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
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
						balance: '4516726112067095',
						token: {
							decimals: 18,
							symbol: 'WETH',
							address: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
						},
					},
					stopLossDynamicPrice: '153548387',
					fee: {
						balance: '2588747414501',
						token: {
							decimals: 18,
							symbol: 'wstETH',
							address: '0x7f39c581f595b53c5cb19bd0b3f8da6c935e2ca0',
						},
					},
					totalFee: {
						balance: '2588747414501',
						token: {
							decimals: 18,
							symbol: 'wstETH',
							address: '0x7f39c581f595b53c5cb19bd0b3f8da6c935e2ca0',
						},
					},
				},
			},
		},
		morphoBlueStopLoss: {
			triggerType: '142',
			triggerId: '10000000659',
			triggerData:
				'0x0000000000000000000000002e0515d7a3ea0276f28c94c426c5d2d1d85fd4d5000000000000000000000000000000000000000000000000000000000000008e00000000000000000000000000000000000000000000000008e438747f816000000000000000000000000000c02aaa39b223fe8d0a0e5c4f27ead9083c756cc20000000000000000000000007f39c581f595b53c5cb19bd0b3f8da6c935e2ca04d6f7270686f426c7565436c6f7365416e6452656d61696e5f6175746f000000c54d7acf14de29e0e5527cabd7a576506870346a78a11a6762e2cca66322ec4100000000000000000000000000000000000000000000000000000000000024540000000000000000000000000000000000000000000000000000000000000000',
			decodedParams: {
				positionAddress: '0x2e0515d7a3ea0276f28c94c426c5d2d1d85fd4d5',
				triggerType: '142',
				maxCoverage: '640699120000000000',
				executionLtv: '9300',
				debtToken: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
				collateralToken: '0x7f39c581f595b53c5cb19bd0b3f8da6c935e2ca0',
				operationName: '0x4d6f7270686f426c7565436c6f7365416e6452656d61696e5f6175746f000000',
			},
		},
	},
	additionalData: {
		params: {
			dpm: '0x2e0515d7A3eA0276F28c94C426c5d2D1d85FD4d5',
			poolId: '0xc54d7acf14de29e0e5527cabd7a576506870346a78a11a6762e2cca66322ec41',
			chainId: 1,
			getDetails: true,
		},
	},
};
