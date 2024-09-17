import { expect } from '#noWalletFixtures';

export const aaveV3BaseStopLossAndProfitGetResponse = {
	triggers: {
		aavePartialTakeProfit: {
			triggerTypeName: 'DmaAavePartialTakeProfit',
			triggerType: '133',
			triggerId: '10000000437',
			triggerData:
				'0x000000000000000000000000b3287c2890ed7ea99cb4d5d899434bb64997a60900000000000000000000000000000000000000000000000000000000000000850000000000000000000000000000000000000000000000000000000059699d95000000000000000000000000833589fcd6edb6e08f4c7c32d4f71b54bda0291300000000000000000000000042000000000000000000000000000000000000064141564556335769746864726177546f446562745f6175746f000000000000000000000000000000000000000000000000000000000000000000000000001518000000000000000000000000000000000000000000000000000000000000170c0000000000000000000000000000000000000000000000000000008bb2c9700000000000000000000000000000000000000000000000000000000000000000640000000000000000000000000000000000000000000000000000000000000001',
			decodedParams: {
				triggerType: '133',
				positionAddress: '0xb3287c2890ed7ea99cb4d5d899434bb64997a609',
				maxCoverage: '1500093845',
				debtToken: '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913',
				collateralToken: '0x4200000000000000000000000000000000000006',
				operationName: '0x4141564556335769746864726177546f446562745f6175746f00000000000000',
				withdrawToDebt: 'true',
				executionLtv: '5400',
				targetLtv: '5900',
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
							address: '0x4200000000000000000000000000000000000006',
						},
					},
					realizedProfitInDebt: {
						balance: expect.any(String),
						token: {
							decimals: 6,
							symbol: 'USDC',
							address: '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913',
						},
					},
					totalProfitInCollateral: {
						balance: expect.any(String),
						token: {
							decimals: 18,
							symbol: 'WETH',
							address: '0x4200000000000000000000000000000000000006',
						},
					},
					totalProfitInDebt: {
						balance: expect.any(String),
						token: {
							decimals: 6,
							symbol: 'USDC',
							address: '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913',
						},
					},
					stopLossDynamicPrice: expect.any(String),
					fee: {
						balance: expect.any(String),
						token: {
							decimals: 18,
							symbol: 'WETH',
							address: '0x4200000000000000000000000000000000000006',
						},
					},
					totalFee: {
						balance: expect.any(String),
						token: {
							decimals: 18,
							symbol: 'WETH',
							address: '0x4200000000000000000000000000000000000006',
						},
					},
				},
			},
		},
		aaveStopLossToCollateralDMA: {
			triggerTypeName: 'DmaAaveStopLossToCollateralV2',
			triggerType: '127',
			triggerId: '10000000438',
			triggerData:
				'0x000000000000000000000000b3287c2890ed7ea99cb4d5d899434bb64997a609000000000000000000000000000000000000000000000000000000000000007f0000000000000000000000000000000000000000000000000000000059699d95000000000000000000000000833589fcd6edb6e08f4c7c32d4f71b54bda029130000000000000000000000004200000000000000000000000000000000000006436c6f7365416e6452656d61696e414156455633506f736974696f6e000000000000000000000000000000000000000000000000000000000000000000001eaf',
			decodedParams: {
				positionAddress: '0xb3287c2890ed7ea99cb4d5d899434bb64997a609',
				triggerType: '127',
				maxCoverage: '1500093845',
				executionLtv: '7855',
				debtToken: '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913',
				collateralToken: '0x4200000000000000000000000000000000000006',
				operationName: '0x436c6f7365416e6452656d61696e414156455633506f736974696f6e00000000',
			},
		},
		aave3: {
			partialTakeProfit: {
				triggerTypeName: 'DmaAavePartialTakeProfit',
				triggerType: '133',
				triggerId: '10000000437',
				triggerData:
					'0x000000000000000000000000b3287c2890ed7ea99cb4d5d899434bb64997a60900000000000000000000000000000000000000000000000000000000000000850000000000000000000000000000000000000000000000000000000059699d95000000000000000000000000833589fcd6edb6e08f4c7c32d4f71b54bda0291300000000000000000000000042000000000000000000000000000000000000064141564556335769746864726177546f446562745f6175746f000000000000000000000000000000000000000000000000000000000000000000000000001518000000000000000000000000000000000000000000000000000000000000170c0000000000000000000000000000000000000000000000000000008bb2c9700000000000000000000000000000000000000000000000000000000000000000640000000000000000000000000000000000000000000000000000000000000001',
				decodedParams: {
					triggerType: '133',
					positionAddress: '0xb3287c2890ed7ea99cb4d5d899434bb64997a609',
					maxCoverage: '1500093845',
					debtToken: '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913',
					collateralToken: '0x4200000000000000000000000000000000000006',
					operationName: '0x4141564556335769746864726177546f446562745f6175746f00000000000000',
					withdrawToDebt: 'true',
					executionLtv: '5400',
					targetLtv: '5900',
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
								address: '0x4200000000000000000000000000000000000006',
							},
						},
						realizedProfitInDebt: {
							balance: expect.any(String),
							token: {
								decimals: 6,
								symbol: 'USDC',
								address: '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913',
							},
						},
						totalProfitInCollateral: {
							balance: expect.any(String),
							token: {
								decimals: 18,
								symbol: 'WETH',
								address: '0x4200000000000000000000000000000000000006',
							},
						},
						totalProfitInDebt: {
							balance: expect.any(String),
							token: {
								decimals: 6,
								symbol: 'USDC',
								address: '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913',
							},
						},
						stopLossDynamicPrice: expect.any(String),
						fee: {
							balance: expect.any(String),
							token: {
								decimals: 18,
								symbol: 'WETH',
								address: '0x4200000000000000000000000000000000000006',
							},
						},
						totalFee: {
							balance: expect.any(String),
							token: {
								decimals: 18,
								symbol: 'WETH',
								address: '0x4200000000000000000000000000000000000006',
							},
						},
					},
				},
			},
			stopLossToCollateralDMA: {
				triggerTypeName: 'DmaAaveStopLossToCollateralV2',
				triggerType: '127',
				triggerId: '10000000438',
				triggerData:
					'0x000000000000000000000000b3287c2890ed7ea99cb4d5d899434bb64997a609000000000000000000000000000000000000000000000000000000000000007f0000000000000000000000000000000000000000000000000000000059699d95000000000000000000000000833589fcd6edb6e08f4c7c32d4f71b54bda029130000000000000000000000004200000000000000000000000000000000000006436c6f7365416e6452656d61696e414156455633506f736974696f6e000000000000000000000000000000000000000000000000000000000000000000001eaf',
				decodedParams: {
					positionAddress: '0xb3287c2890ed7ea99cb4d5d899434bb64997a609',
					triggerType: '127',
					maxCoverage: '1500093845',
					executionLtv: '7855',
					debtToken: '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913',
					collateralToken: '0x4200000000000000000000000000000000000006',
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
			triggerId: '10000000437',
			triggerData:
				'0x000000000000000000000000b3287c2890ed7ea99cb4d5d899434bb64997a60900000000000000000000000000000000000000000000000000000000000000850000000000000000000000000000000000000000000000000000000059699d95000000000000000000000000833589fcd6edb6e08f4c7c32d4f71b54bda0291300000000000000000000000042000000000000000000000000000000000000064141564556335769746864726177546f446562745f6175746f000000000000000000000000000000000000000000000000000000000000000000000000001518000000000000000000000000000000000000000000000000000000000000170c0000000000000000000000000000000000000000000000000000008bb2c9700000000000000000000000000000000000000000000000000000000000000000640000000000000000000000000000000000000000000000000000000000000001',
			decodedParams: {
				triggerType: '133',
				positionAddress: '0xb3287c2890ed7ea99cb4d5d899434bb64997a609',
				maxCoverage: '1500093845',
				debtToken: '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913',
				collateralToken: '0x4200000000000000000000000000000000000006',
				operationName: '0x4141564556335769746864726177546f446562745f6175746f00000000000000',
				withdrawToDebt: 'true',
				executionLtv: '5400',
				targetLtv: '5900',
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
							address: '0x4200000000000000000000000000000000000006',
						},
					},
					realizedProfitInDebt: {
						balance: expect.any(String),
						token: {
							decimals: 6,
							symbol: 'USDC',
							address: '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913',
						},
					},
					totalProfitInCollateral: {
						balance: expect.any(String),
						token: {
							decimals: 18,
							symbol: 'WETH',
							address: '0x4200000000000000000000000000000000000006',
						},
					},
					totalProfitInDebt: {
						balance: expect.any(String),
						token: {
							decimals: 6,
							symbol: 'USDC',
							address: '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913',
						},
					},
					stopLossDynamicPrice: expect.any(String),
					fee: {
						balance: expect.any(String),
						token: {
							decimals: 18,
							symbol: 'WETH',
							address: '0x4200000000000000000000000000000000000006',
						},
					},
					totalFee: {
						balance: expect.any(String),
						token: {
							decimals: 18,
							symbol: 'WETH',
							address: '0x4200000000000000000000000000000000000006',
						},
					},
				},
			},
		},
		aaveStopLoss: {
			triggerType: '127',
			triggerId: '10000000438',
			triggerData:
				'0x000000000000000000000000b3287c2890ed7ea99cb4d5d899434bb64997a609000000000000000000000000000000000000000000000000000000000000007f0000000000000000000000000000000000000000000000000000000059699d95000000000000000000000000833589fcd6edb6e08f4c7c32d4f71b54bda029130000000000000000000000004200000000000000000000000000000000000006436c6f7365416e6452656d61696e414156455633506f736974696f6e000000000000000000000000000000000000000000000000000000000000000000001eaf',
			decodedParams: {
				positionAddress: '0xb3287c2890ed7ea99cb4d5d899434bb64997a609',
				triggerType: '127',
				maxCoverage: '1500093845',
				executionLtv: '7855',
				debtToken: '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913',
				collateralToken: '0x4200000000000000000000000000000000000006',
				operationName: '0x436c6f7365416e6452656d61696e414156455633506f736974696f6e00000000',
			},
		},
	},
	additionalData: {
		params: {
			dpm: '0xb3287c2890Ed7EA99Cb4d5D899434bB64997a609',
			chainId: 8453,
			getDetails: true,
		},
	},
};
