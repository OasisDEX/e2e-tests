import { expect } from '#noWalletFixtures';

export const aaveV3EthereumTrailingStopLossResponse = {
	triggers: {
		aaveTrailingStopLossDMA: {
			triggerTypeName: 'DmaAaveTrailingStopLoss',
			triggerType: '10006',
			triggerId: '10000000669',
			triggerData:
				'0x00000000000000000000000062320f403ea16a143be7d78485d9e4674c925cc3000000000000000000000000000000000000000000000000000000000000271600000000000000000000000000000000000000000000005148cb832cd1e4fc000000000000000000000000006b175474e89094c44da98b954eedeac495271d0f000000000000000000000000c02aaa39b223fe8d0a0e5c4f27ead9083c756cc2436c6f7365414156455633506f736974696f6e5f3400000000000000000000000000000000000000000000005f4ec3df9cbd43714fe2740f5e3616155c5b84190000000000000000000000000000000000000000000000060000000000005a13000000000000000000000000aed0c38402a5d19df6e4c03f4e2dced6e29c1ee9000000000000000000000000000000000000000000000006000000000000314000000000000000000000000000000000000000000000000000000022757cc8000000000000000000000000000000000000000000000000000000000000000000',
			decodedParams: {
				triggerType: '10006',
				positionAddress: '0x62320f403ea16a143be7d78485d9e4674c925cc3',
				maxCoverage: '1499431700390000000000',
				debtToken: '0x6b175474e89094c44da98b954eedeac495271d0f',
				collateralToken: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
				operationName: '0x436c6f7365414156455633506f736974696f6e5f340000000000000000000000',
				collateralOracle: '0x5f4ec3df9cbd43714fe2740f5e3616155c5b8419',
				collateralAddedRoundId: '110680464442257332755',
				debtOracle: '0xaed0c38402a5d19df6e4c03f4e2dced6e29c1ee9',
				debtAddedRoundId: '110680464442257322304',
				trailingDistance: '148000000000',
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
				triggerId: '10000000669',
				triggerData:
					'0x00000000000000000000000062320f403ea16a143be7d78485d9e4674c925cc3000000000000000000000000000000000000000000000000000000000000271600000000000000000000000000000000000000000000005148cb832cd1e4fc000000000000000000000000006b175474e89094c44da98b954eedeac495271d0f000000000000000000000000c02aaa39b223fe8d0a0e5c4f27ead9083c756cc2436c6f7365414156455633506f736974696f6e5f3400000000000000000000000000000000000000000000005f4ec3df9cbd43714fe2740f5e3616155c5b84190000000000000000000000000000000000000000000000060000000000005a13000000000000000000000000aed0c38402a5d19df6e4c03f4e2dced6e29c1ee9000000000000000000000000000000000000000000000006000000000000314000000000000000000000000000000000000000000000000000000022757cc8000000000000000000000000000000000000000000000000000000000000000000',
				decodedParams: {
					triggerType: '10006',
					positionAddress: '0x62320f403ea16a143be7d78485d9e4674c925cc3',
					maxCoverage: '1499431700390000000000',
					debtToken: '0x6b175474e89094c44da98b954eedeac495271d0f',
					collateralToken: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
					operationName: '0x436c6f7365414156455633506f736974696f6e5f340000000000000000000000',
					collateralOracle: '0x5f4ec3df9cbd43714fe2740f5e3616155c5b8419',
					collateralAddedRoundId: '110680464442257332755',
					debtOracle: '0xaed0c38402a5d19df6e4c03f4e2dced6e29c1ee9',
					debtAddedRoundId: '110680464442257322304',
					trailingDistance: '148000000000',
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
			isStopLossEnabled: true,
			isBasicBuyEnabled: false,
			isBasicSellEnabled: false,
			isPartialTakeProfitEnabled: false,
			isTrailingStopLossEnabled: false,
		},
		isAaveStopLossEnabled: true,
		isAaveBasicBuyEnabled: false,
		isAaveBasicSellEnabled: false,
		isAavePartialTakeProfitEnabled: false,
		isSparkStopLossEnabled: true,
		isSparkBasicBuyEnabled: false,
		isSparkBasicSellEnabled: false,
		isSparkPartialTakeProfitEnabled: false,
	},
	triggersCount: 2,
	triggerGroup: {
		aaveStopLoss: {
			triggerType: '10006',
			triggerId: '10000000669',
			triggerData:
				'0x00000000000000000000000062320f403ea16a143be7d78485d9e4674c925cc3000000000000000000000000000000000000000000000000000000000000271600000000000000000000000000000000000000000000005148cb832cd1e4fc000000000000000000000000006b175474e89094c44da98b954eedeac495271d0f000000000000000000000000c02aaa39b223fe8d0a0e5c4f27ead9083c756cc2436c6f7365414156455633506f736974696f6e5f3400000000000000000000000000000000000000000000005f4ec3df9cbd43714fe2740f5e3616155c5b84190000000000000000000000000000000000000000000000060000000000005a13000000000000000000000000aed0c38402a5d19df6e4c03f4e2dced6e29c1ee9000000000000000000000000000000000000000000000006000000000000314000000000000000000000000000000000000000000000000000000022757cc8000000000000000000000000000000000000000000000000000000000000000000',
			decodedParams: {
				triggerType: '10006',
				positionAddress: '0x62320f403ea16a143be7d78485d9e4674c925cc3',
				maxCoverage: '1499431700390000000000',
				debtToken: '0x6b175474e89094c44da98b954eedeac495271d0f',
				collateralToken: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
				operationName: '0x436c6f7365414156455633506f736974696f6e5f340000000000000000000000',
				collateralOracle: '0x5f4ec3df9cbd43714fe2740f5e3616155c5b8419',
				collateralAddedRoundId: '110680464442257332755',
				debtOracle: '0xaed0c38402a5d19df6e4c03f4e2dced6e29c1ee9',
				debtAddedRoundId: '110680464442257322304',
				trailingDistance: '148000000000',
				closeToCollateral: 'false',
			},
			dynamicParams: {
				executionPrice: expect.any(String),
				originalExecutionPrice: expect.any(String),
			},
		},
		sparkStopLoss: {
			triggerType: '130',
			triggerId: '10000000832',
			triggerData:
				'0x00000000000000000000000062320f403ea16a143be7d78485d9e4674c925cc3000000000000000000000000000000000000000000000000000000000000008200000000000000000000000000000000000000000000005150ae84a8cdf000000000000000000000000000006b175474e89094c44da98b954eedeac495271d0f000000000000000000000000cbb7c0000ab88b473b1f5afd9ef808440eed33bf537061726b436c6f7365506f736974696f6e5f340000000000000000000000000000000000000000000000000000000000000000000000000000000000000eed',
			decodedParams: {
				collateralToken: '0xcbb7c0000ab88b473b1f5afd9ef808440eed33bf',
				debtToken: '0x6b175474e89094c44da98b954eedeac495271d0f',
				executionLtv: '3821',
				maxCoverage: '1500000000000000000000',
				operationName: '0x537061726b436c6f7365506f736974696f6e5f34000000000000000000000000',
				positionAddress: '0x62320f403ea16a143be7d78485d9e4674c925cc3',
				triggerType: '130',
			},
		},
	},
	additionalData: {
		params: {
			account: '0x62320F403EA16a143BE7D78485d9e4674C925CC3',
			chainId: 1,
			protocol: 'aavev3',
			getDetails: true,
		},
	},
};
