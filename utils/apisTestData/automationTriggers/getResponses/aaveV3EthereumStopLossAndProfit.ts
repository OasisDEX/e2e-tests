import { expect } from '#noWalletFixtures';

export const aaveV3EthereumStopLossAndProfitResponse = {
	triggers: {
		aavePartialTakeProfit: {
			triggerTypeName: 'DmaAavePartialTakeProfit',
			triggerType: '133',
			triggerId: '10000000135',
			triggerData:
				'0x000000000000000000000000b727aff37c480a0fdba8a6c97fc4fcf3a19f2ac7000000000000000000000000000000000000000000000000000000000000008500000000000000000000000000000000000000000000000000000000596cfde7000000000000000000000000a0b86991c6218b36c1d19d4a2e9eb0ce3606eb48000000000000000000000000c02aaa39b223fe8d0a0e5c4f27ead9083c756cc241415645563357697468647261775f330000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000008ac0000000000000000000000000000000000000000000000000000000000000aa00000000000000000000000000000000000000000000000000000005dd81341d500000000000000000000000000000000000000000000000000000000000000640000000000000000000000000000000000000000000000000000000000000000',
			decodedParams: {
				triggerType: '133',
				positionAddress: '0xb727aff37c480a0fdba8a6c97fc4fcf3a19f2ac7',
				maxCoverage: '1500315111',
				debtToken: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
				collateralToken: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
				operationName: '0x41415645563357697468647261775f3300000000000000000000000000000000',
				withdrawToDebt: 'false',
				executionLtv: '2220',
				targetLtv: '2720',
				deviation: '100',
				executionPrice: expect.any(String),
			},
			dynamicParams: {
				nextProfit: {
					triggerPrice: expect.any(String),
					realizedProfitInCollateral: {
						balance: expect.any(String),
						token: {
							decimals: 18,
							symbol: 'WETH',
							address: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
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
							symbol: 'WETH',
							address: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
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
					fee: {
						balance: '0',
						token: {
							decimals: 18,
							symbol: 'WETH',
							address: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
						},
					},
					totalFee: {
						balance: '0',
						token: {
							decimals: 18,
							symbol: 'WETH',
							address: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
						},
					},
					stopLossDynamicPrice: expect.any(String),
				},
			},
		},
		aaveStopLossToCollateralDMA: {
			triggerTypeName: 'DmaAaveStopLossToCollateralV2',
			triggerType: '127',
			triggerId: '10000000136',
			triggerData:
				'0x000000000000000000000000b727aff37c480a0fdba8a6c97fc4fcf3a19f2ac7000000000000000000000000000000000000000000000000000000000000007f00000000000000000000000000000000000000000000000000000000596cfde7000000000000000000000000a0b86991c6218b36c1d19d4a2e9eb0ce3606eb48000000000000000000000000c02aaa39b223fe8d0a0e5c4f27ead9083c756cc2436c6f7365416e6452656d61696e414156455633506f736974696f6e000000000000000000000000000000000000000000000000000000000000000000001e14',
			decodedParams: {
				positionAddress: '0xb727aff37c480a0fdba8a6c97fc4fcf3a19f2ac7',
				triggerType: '127',
				maxCoverage: '1500315111',
				executionLtv: '7700',
				debtToken: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
				collateralToken: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
				operationName: '0x436c6f7365416e6452656d61696e414156455633506f736974696f6e00000000',
			},
		},
		aaveStopLossToDebtDMA: {
			triggerTypeName: 'DmaAaveStopLossToDebtV2',
			triggerType: '128',
			triggerId: '10000000116',
			triggerData:
				'0x000000000000000000000000b727aff37c480a0fdba8a6c97fc4fcf3a19f2ac700000000000000000000000000000000000000000000000000000000000000800000000000000000000000000000000000000000000000000000000059674c31000000000000000000000000a0b86991c6218b36c1d19d4a2e9eb0ce3606eb48000000000000000000000000c02aaa39b223fe8d0a0e5c4f27ead9083c756cc2436c6f7365414156455633506f736974696f6e5f3400000000000000000000000000000000000000000000000000000000000000000000000000000000001f72',
			decodedParams: {
				positionAddress: '0xb727aff37c480a0fdba8a6c97fc4fcf3a19f2ac7',
				triggerType: '128',
				maxCoverage: '1499941937',
				executionLtv: '8050',
				debtToken: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
				collateralToken: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
				operationName: '0x436c6f7365414156455633506f736974696f6e5f340000000000000000000000',
			},
		},
		aave3: {
			partialTakeProfit: {
				triggerTypeName: 'DmaAavePartialTakeProfit',
				triggerType: '133',
				triggerId: '10000000135',
				triggerData:
					'0x000000000000000000000000b727aff37c480a0fdba8a6c97fc4fcf3a19f2ac7000000000000000000000000000000000000000000000000000000000000008500000000000000000000000000000000000000000000000000000000596cfde7000000000000000000000000a0b86991c6218b36c1d19d4a2e9eb0ce3606eb48000000000000000000000000c02aaa39b223fe8d0a0e5c4f27ead9083c756cc241415645563357697468647261775f330000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000008ac0000000000000000000000000000000000000000000000000000000000000aa00000000000000000000000000000000000000000000000000000005dd81341d500000000000000000000000000000000000000000000000000000000000000640000000000000000000000000000000000000000000000000000000000000000',
				decodedParams: {
					triggerType: '133',
					positionAddress: '0xb727aff37c480a0fdba8a6c97fc4fcf3a19f2ac7',
					maxCoverage: '1500315111',
					debtToken: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
					collateralToken: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
					operationName: '0x41415645563357697468647261775f3300000000000000000000000000000000',
					withdrawToDebt: 'false',
					executionLtv: '2220',
					targetLtv: '2720',
					deviation: '100',
					executionPrice: expect.any(String),
				},
				dynamicParams: {
					nextProfit: {
						triggerPrice: expect.any(String),
						realizedProfitInCollateral: {
							balance: expect.any(String),
							token: {
								decimals: 18,
								symbol: 'WETH',
								address: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
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
								symbol: 'WETH',
								address: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
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
						fee: {
							balance: '0',
							token: {
								decimals: 18,
								symbol: 'WETH',
								address: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
							},
						},
						totalFee: {
							balance: '0',
							token: {
								decimals: 18,
								symbol: 'WETH',
								address: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
							},
						},
						stopLossDynamicPrice: expect.any(String),
					},
				},
			},
			stopLossToCollateralDMA: {
				triggerTypeName: 'DmaAaveStopLossToCollateralV2',
				triggerType: '127',
				triggerId: '10000000136',
				triggerData:
					'0x000000000000000000000000b727aff37c480a0fdba8a6c97fc4fcf3a19f2ac7000000000000000000000000000000000000000000000000000000000000007f00000000000000000000000000000000000000000000000000000000596cfde7000000000000000000000000a0b86991c6218b36c1d19d4a2e9eb0ce3606eb48000000000000000000000000c02aaa39b223fe8d0a0e5c4f27ead9083c756cc2436c6f7365416e6452656d61696e414156455633506f736974696f6e000000000000000000000000000000000000000000000000000000000000000000001e14',
				decodedParams: {
					positionAddress: '0xb727aff37c480a0fdba8a6c97fc4fcf3a19f2ac7',
					triggerType: '127',
					maxCoverage: '1500315111',
					executionLtv: '7700',
					debtToken: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
					collateralToken: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
					operationName: '0x436c6f7365416e6452656d61696e414156455633506f736974696f6e00000000',
				},
			},
			stopLossToDebtDMA: {
				triggerTypeName: 'DmaAaveStopLossToDebtV2',
				triggerType: '128',
				triggerId: '10000000116',
				triggerData:
					'0x000000000000000000000000b727aff37c480a0fdba8a6c97fc4fcf3a19f2ac700000000000000000000000000000000000000000000000000000000000000800000000000000000000000000000000000000000000000000000000059674c31000000000000000000000000a0b86991c6218b36c1d19d4a2e9eb0ce3606eb48000000000000000000000000c02aaa39b223fe8d0a0e5c4f27ead9083c756cc2436c6f7365414156455633506f736974696f6e5f3400000000000000000000000000000000000000000000000000000000000000000000000000000000001f72',
				decodedParams: {
					positionAddress: '0xb727aff37c480a0fdba8a6c97fc4fcf3a19f2ac7',
					triggerType: '128',
					maxCoverage: '1499941937',
					executionLtv: '8050',
					debtToken: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
					collateralToken: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
					operationName: '0x436c6f7365414156455633506f736974696f6e5f340000000000000000000000',
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
	triggersCount: 3,
	triggerGroup: {
		aavePartialTakeProfit: {
			triggerType: '133',
			triggerId: '10000000135',
			triggerData:
				'0x000000000000000000000000b727aff37c480a0fdba8a6c97fc4fcf3a19f2ac7000000000000000000000000000000000000000000000000000000000000008500000000000000000000000000000000000000000000000000000000596cfde7000000000000000000000000a0b86991c6218b36c1d19d4a2e9eb0ce3606eb48000000000000000000000000c02aaa39b223fe8d0a0e5c4f27ead9083c756cc241415645563357697468647261775f330000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000008ac0000000000000000000000000000000000000000000000000000000000000aa00000000000000000000000000000000000000000000000000000005dd81341d500000000000000000000000000000000000000000000000000000000000000640000000000000000000000000000000000000000000000000000000000000000',
			decodedParams: {
				triggerType: '133',
				positionAddress: '0xb727aff37c480a0fdba8a6c97fc4fcf3a19f2ac7',
				maxCoverage: '1500315111',
				debtToken: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
				collateralToken: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
				operationName: '0x41415645563357697468647261775f3300000000000000000000000000000000',
				withdrawToDebt: 'false',
				executionLtv: '2220',
				targetLtv: '2720',
				deviation: '100',
				executionPrice: expect.any(String),
			},
			dynamicParams: {
				nextProfit: {
					triggerPrice: expect.any(String),
					realizedProfitInCollateral: {
						balance: expect.any(String),
						token: {
							decimals: 18,
							symbol: 'WETH',
							address: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
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
							symbol: 'WETH',
							address: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
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
					fee: {
						balance: '0',
						token: {
							decimals: 18,
							symbol: 'WETH',
							address: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
						},
					},
					totalFee: {
						balance: '0',
						token: {
							decimals: 18,
							symbol: 'WETH',
							address: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
						},
					},
					stopLossDynamicPrice: expect.any(String),
				},
			},
		},
		aaveStopLoss: {
			triggerType: '127',
			triggerId: '10000000136',
			triggerData:
				'0x000000000000000000000000b727aff37c480a0fdba8a6c97fc4fcf3a19f2ac7000000000000000000000000000000000000000000000000000000000000007f00000000000000000000000000000000000000000000000000000000596cfde7000000000000000000000000a0b86991c6218b36c1d19d4a2e9eb0ce3606eb48000000000000000000000000c02aaa39b223fe8d0a0e5c4f27ead9083c756cc2436c6f7365416e6452656d61696e414156455633506f736974696f6e000000000000000000000000000000000000000000000000000000000000000000001e14',
			decodedParams: {
				positionAddress: '0xb727aff37c480a0fdba8a6c97fc4fcf3a19f2ac7',
				triggerType: '127',
				maxCoverage: '1500315111',
				executionLtv: '7700',
				debtToken: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
				collateralToken: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
				operationName: '0x436c6f7365416e6452656d61696e414156455633506f736974696f6e00000000',
			},
		},
	},
	additionalData: {
		params: {
			dpm: '0xB727afF37C480a0FDbA8a6c97fC4FcF3A19f2ac7',
			chainId: 1,
			getDetails: true,
		},
	},
};
