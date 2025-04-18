import { expect } from '#noWalletFixtures';

export const getAutomationEndpoint = '/api/triggers';

export const postAutomationEndpoint = ({
	network,
	protocol,
	automation,
}: {
	network: 'arbitrum' | 'base' | 'ethereum' | 'optimism';
	protocol: 'aave3' | 'morphoblue' | 'spark';
	automation:
		| 'auto-buy'
		| 'auto-sell'
		| 'dma-partial-take-profit'
		| 'dma-stop-loss'
		| 'dma-trailing-stop-loss';
}) => {
	const chainId = {
		arbitrum: '42161',
		base: '8453',
		ethereum: '1',
		optimism: '10',
	};
	const endpoint = `/api/triggers/${chainId[network]}/${protocol}/${automation}`;

	return endpoint;
};

export const autoTakeProfitResponse = ({
	dpm,
	collateral,
	debt,
}: {
	dpm: string;
	collateral: { decimals: number; symbol: string; address: string };
	debt: { decimals: number; symbol: string; address: string };
}) => {
	const response = {
		simulation: {
			profits: [
				{
					triggerPrice: expect.any(String),
					realizedProfitInCollateral: {
						balance: expect.any(String),
						token: {
							decimals: collateral.decimals,
							symbol: collateral.symbol,
							address: collateral.address,
						},
					},
					realizedProfitInDebt: {
						balance: expect.any(String),
						token: {
							decimals: debt.decimals,
							symbol: debt.symbol,
							address: debt.address,
						},
					},
					totalProfitInCollateral: {
						balance: expect.any(String),
						token: {
							decimals: collateral.decimals,
							symbol: collateral.symbol,
							address: collateral.address,
						},
					},
					totalProfitInDebt: {
						balance: expect.any(String),
						token: {
							decimals: debt.decimals,
							symbol: debt.symbol,
							address: debt.address,
						},
					},
					stopLossDynamicPrice: expect.any(String),
					fee: {
						balance: expect.any(String),
						token: {
							decimals: collateral.decimals,
							symbol: collateral.symbol,
							address: collateral.address,
						},
					},
					totalFee: {
						balance: expect.any(String),
						token: {
							decimals: collateral.decimals,
							symbol: collateral.symbol,
							address: collateral.address,
						},
					},
				},
				{
					triggerPrice: expect.any(String),
					realizedProfitInCollateral: {
						balance: expect.any(String),
						token: {
							decimals: collateral.decimals,
							symbol: collateral.symbol,
							address: collateral.address,
						},
					},
					realizedProfitInDebt: {
						balance: expect.any(String),
						token: {
							decimals: debt.decimals,
							symbol: debt.symbol,
							address: debt.address,
						},
					},
					totalProfitInCollateral: {
						balance: expect.any(String),
						token: {
							decimals: collateral.decimals,
							symbol: collateral.symbol,
							address: collateral.address,
						},
					},
					totalProfitInDebt: {
						balance: expect.any(String),
						token: {
							decimals: debt.decimals,
							symbol: debt.symbol,
							address: debt.address,
						},
					},
					stopLossDynamicPrice: expect.any(String),
					fee: {
						balance: expect.any(String),
						token: {
							decimals: collateral.decimals,
							symbol: collateral.symbol,
							address: collateral.address,
						},
					},
					totalFee: {
						balance: expect.any(String),
						token: {
							decimals: collateral.decimals,
							symbol: collateral.symbol,
							address: collateral.address,
						},
					},
				},
				{
					triggerPrice: expect.any(String),
					realizedProfitInCollateral: {
						balance: expect.any(String),
						token: {
							decimals: collateral.decimals,
							symbol: collateral.symbol,
							address: collateral.address,
						},
					},
					realizedProfitInDebt: {
						balance: expect.any(String),
						token: {
							decimals: debt.decimals,
							symbol: debt.symbol,
							address: debt.address,
						},
					},
					totalProfitInCollateral: {
						balance: expect.any(String),
						token: {
							decimals: collateral.decimals,
							symbol: collateral.symbol,
							address: collateral.address,
						},
					},
					totalProfitInDebt: {
						balance: expect.any(String),
						token: {
							decimals: debt.decimals,
							symbol: debt.symbol,
							address: debt.address,
						},
					},
					stopLossDynamicPrice: expect.any(String),
					fee: {
						balance: expect.any(String),
						token: {
							decimals: collateral.decimals,
							symbol: collateral.symbol,
							address: collateral.address,
						},
					},
					totalFee: {
						balance: expect.any(String),
						token: {
							decimals: collateral.decimals,
							symbol: collateral.symbol,
							address: collateral.address,
						},
					},
				},
				{
					triggerPrice: expect.any(String),
					realizedProfitInCollateral: {
						balance: expect.any(String),
						token: {
							decimals: collateral.decimals,
							symbol: collateral.symbol,
							address: collateral.address,
						},
					},
					realizedProfitInDebt: {
						balance: expect.any(String),
						token: {
							decimals: debt.decimals,
							symbol: debt.symbol,
							address: debt.address,
						},
					},
					totalProfitInCollateral: {
						balance: expect.any(String),
						token: {
							decimals: collateral.decimals,
							symbol: collateral.symbol,
							address: collateral.address,
						},
					},
					totalProfitInDebt: {
						balance: expect.any(String),
						token: {
							decimals: debt.decimals,
							symbol: debt.symbol,
							address: debt.address,
						},
					},
					stopLossDynamicPrice: expect.any(String),
					fee: {
						balance: expect.any(String),
						token: {
							decimals: collateral.decimals,
							symbol: collateral.symbol,
							address: collateral.address,
						},
					},
					totalFee: {
						balance: expect.any(String),
						token: {
							decimals: collateral.decimals,
							symbol: collateral.symbol,
							address: collateral.address,
						},
					},
				},
				{
					triggerPrice: expect.any(String),
					realizedProfitInCollateral: {
						balance: expect.any(String),
						token: {
							decimals: collateral.decimals,
							symbol: collateral.symbol,
							address: collateral.address,
						},
					},
					realizedProfitInDebt: {
						balance: expect.any(String),
						token: {
							decimals: debt.decimals,
							symbol: debt.symbol,
							address: debt.address,
						},
					},
					totalProfitInCollateral: {
						balance: expect.any(String),
						token: {
							decimals: collateral.decimals,
							symbol: collateral.symbol,
							address: collateral.address,
						},
					},
					totalProfitInDebt: {
						balance: expect.any(String),
						token: {
							decimals: debt.decimals,
							symbol: debt.symbol,
							address: debt.address,
						},
					},
					stopLossDynamicPrice: expect.any(String),
					fee: {
						balance: expect.any(String),
						token: {
							decimals: collateral.decimals,
							symbol: collateral.symbol,
							address: collateral.address,
						},
					},
					totalFee: {
						balance: expect.any(String),
						token: {
							decimals: collateral.decimals,
							symbol: collateral.symbol,
							address: collateral.address,
						},
					},
				},
				{
					triggerPrice: expect.any(String),
					realizedProfitInCollateral: {
						balance: expect.any(String),
						token: {
							decimals: collateral.decimals,
							symbol: collateral.symbol,
							address: collateral.address,
						},
					},
					realizedProfitInDebt: {
						balance: expect.any(String),
						token: {
							decimals: debt.decimals,
							symbol: debt.symbol,
							address: debt.address,
						},
					},
					totalProfitInCollateral: {
						balance: expect.any(String),
						token: {
							decimals: collateral.decimals,
							symbol: collateral.symbol,
							address: collateral.address,
						},
					},
					totalProfitInDebt: {
						balance: expect.any(String),
						token: {
							decimals: debt.decimals,
							symbol: debt.symbol,
							address: debt.address,
						},
					},
					stopLossDynamicPrice: expect.any(String),
					fee: {
						balance: expect.any(String),
						token: {
							decimals: collateral.decimals,
							symbol: collateral.symbol,
							address: collateral.address,
						},
					},
					totalFee: {
						balance: expect.any(String),
						token: {
							decimals: collateral.decimals,
							symbol: collateral.symbol,
							address: collateral.address,
						},
					},
				},
				{
					triggerPrice: expect.any(String),
					realizedProfitInCollateral: {
						balance: expect.any(String),
						token: {
							decimals: collateral.decimals,
							symbol: collateral.symbol,
							address: collateral.address,
						},
					},
					realizedProfitInDebt: {
						balance: expect.any(String),
						token: {
							decimals: debt.decimals,
							symbol: debt.symbol,
							address: debt.address,
						},
					},
					totalProfitInCollateral: {
						balance: expect.any(String),
						token: {
							decimals: collateral.decimals,
							symbol: collateral.symbol,
							address: collateral.address,
						},
					},
					totalProfitInDebt: {
						balance: expect.any(String),
						token: {
							decimals: debt.decimals,
							symbol: debt.symbol,
							address: debt.address,
						},
					},
					stopLossDynamicPrice: expect.any(String),
					fee: {
						balance: expect.any(String),
						token: {
							decimals: collateral.decimals,
							symbol: collateral.symbol,
							address: collateral.address,
						},
					},
					totalFee: {
						balance: expect.any(String),
						token: {
							decimals: collateral.decimals,
							symbol: collateral.symbol,
							address: collateral.address,
						},
					},
				},
				{
					triggerPrice: expect.any(String),
					realizedProfitInCollateral: {
						balance: expect.any(String),
						token: {
							decimals: collateral.decimals,
							symbol: collateral.symbol,
							address: collateral.address,
						},
					},
					realizedProfitInDebt: {
						balance: expect.any(String),
						token: {
							decimals: debt.decimals,
							symbol: debt.symbol,
							address: debt.address,
						},
					},
					totalProfitInCollateral: {
						balance: expect.any(String),
						token: {
							decimals: collateral.decimals,
							symbol: collateral.symbol,
							address: collateral.address,
						},
					},
					totalProfitInDebt: {
						balance: expect.any(String),
						token: {
							decimals: debt.decimals,
							symbol: debt.symbol,
							address: debt.address,
						},
					},
					stopLossDynamicPrice: expect.any(String),
					fee: {
						balance: expect.any(String),
						token: {
							decimals: collateral.decimals,
							symbol: collateral.symbol,
							address: collateral.address,
						},
					},
					totalFee: {
						balance: expect.any(String),
						token: {
							decimals: collateral.decimals,
							symbol: collateral.symbol,
							address: collateral.address,
						},
					},
				},
				{
					triggerPrice: expect.any(String),
					realizedProfitInCollateral: {
						balance: expect.any(String),
						token: {
							decimals: collateral.decimals,
							symbol: collateral.symbol,
							address: collateral.address,
						},
					},
					realizedProfitInDebt: {
						balance: expect.any(String),
						token: {
							decimals: debt.decimals,
							symbol: debt.symbol,
							address: debt.address,
						},
					},
					totalProfitInCollateral: {
						balance: expect.any(String),
						token: {
							decimals: collateral.decimals,
							symbol: collateral.symbol,
							address: collateral.address,
						},
					},
					totalProfitInDebt: {
						balance: expect.any(String),
						token: {
							decimals: debt.decimals,
							symbol: debt.symbol,
							address: debt.address,
						},
					},
					stopLossDynamicPrice: expect.any(String),
					fee: {
						balance: expect.any(String),
						token: {
							decimals: collateral.decimals,
							symbol: collateral.symbol,
							address: collateral.address,
						},
					},
					totalFee: {
						balance: expect.any(String),
						token: {
							decimals: collateral.decimals,
							symbol: collateral.symbol,
							address: collateral.address,
						},
					},
				},
				{
					triggerPrice: expect.any(String),
					realizedProfitInCollateral: {
						balance: expect.any(String),
						token: {
							decimals: collateral.decimals,
							symbol: collateral.symbol,
							address: collateral.address,
						},
					},
					realizedProfitInDebt: {
						balance: expect.any(String),
						token: {
							decimals: debt.decimals,
							symbol: debt.symbol,
							address: debt.address,
						},
					},
					totalProfitInCollateral: {
						balance: expect.any(String),
						token: {
							decimals: collateral.decimals,
							symbol: collateral.symbol,
							address: collateral.address,
						},
					},
					totalProfitInDebt: {
						balance: expect.any(String),
						token: {
							decimals: debt.decimals,
							symbol: debt.symbol,
							address: debt.address,
						},
					},
					stopLossDynamicPrice: expect.any(String),
					fee: {
						balance: expect.any(String),
						token: {
							decimals: collateral.decimals,
							symbol: collateral.symbol,
							address: collateral.address,
						},
					},
					totalFee: {
						balance: expect.any(String),
						token: {
							decimals: collateral.decimals,
							symbol: collateral.symbol,
							address: collateral.address,
						},
					},
				},
				{
					triggerPrice: expect.any(String),
					realizedProfitInCollateral: {
						balance: expect.any(String),
						token: {
							decimals: collateral.decimals,
							symbol: collateral.symbol,
							address: collateral.address,
						},
					},
					realizedProfitInDebt: {
						balance: expect.any(String),
						token: {
							decimals: debt.decimals,
							symbol: debt.symbol,
							address: debt.address,
						},
					},
					totalProfitInCollateral: {
						balance: expect.any(String),
						token: {
							decimals: collateral.decimals,
							symbol: collateral.symbol,
							address: collateral.address,
						},
					},
					totalProfitInDebt: {
						balance: expect.any(String),
						token: {
							decimals: debt.decimals,
							symbol: debt.symbol,
							address: debt.address,
						},
					},
					stopLossDynamicPrice: expect.any(String),
					fee: {
						balance: expect.any(String),
						token: {
							decimals: collateral.decimals,
							symbol: collateral.symbol,
							address: collateral.address,
						},
					},
					totalFee: {
						balance: expect.any(String),
						token: {
							decimals: collateral.decimals,
							symbol: collateral.symbol,
							address: collateral.address,
						},
					},
				},
				{
					triggerPrice: expect.any(String),
					realizedProfitInCollateral: {
						balance: expect.any(String),
						token: {
							decimals: collateral.decimals,
							symbol: collateral.symbol,
							address: collateral.address,
						},
					},
					realizedProfitInDebt: {
						balance: expect.any(String),
						token: {
							decimals: debt.decimals,
							symbol: debt.symbol,
							address: debt.address,
						},
					},
					totalProfitInCollateral: {
						balance: expect.any(String),
						token: {
							decimals: collateral.decimals,
							symbol: collateral.symbol,
							address: collateral.address,
						},
					},
					totalProfitInDebt: {
						balance: expect.any(String),
						token: {
							decimals: debt.decimals,
							symbol: debt.symbol,
							address: debt.address,
						},
					},
					stopLossDynamicPrice: expect.any(String),
					fee: {
						balance: expect.any(String),
						token: {
							decimals: collateral.decimals,
							symbol: collateral.symbol,
							address: collateral.address,
						},
					},
					totalFee: {
						balance: expect.any(String),
						token: {
							decimals: collateral.decimals,
							symbol: collateral.symbol,
							address: collateral.address,
						},
					},
				},
				{
					triggerPrice: expect.any(String),
					realizedProfitInCollateral: {
						balance: expect.any(String),
						token: {
							decimals: collateral.decimals,
							symbol: collateral.symbol,
							address: collateral.address,
						},
					},
					realizedProfitInDebt: {
						balance: expect.any(String),
						token: {
							decimals: debt.decimals,
							symbol: debt.symbol,
							address: debt.address,
						},
					},
					totalProfitInCollateral: {
						balance: expect.any(String),
						token: {
							decimals: collateral.decimals,
							symbol: collateral.symbol,
							address: collateral.address,
						},
					},
					totalProfitInDebt: {
						balance: expect.any(String),
						token: {
							decimals: debt.decimals,
							symbol: debt.symbol,
							address: debt.address,
						},
					},
					stopLossDynamicPrice: expect.any(String),
					fee: {
						balance: expect.any(String),
						token: {
							decimals: collateral.decimals,
							symbol: collateral.symbol,
							address: collateral.address,
						},
					},
					totalFee: {
						balance: expect.any(String),
						token: {
							decimals: collateral.decimals,
							symbol: collateral.symbol,
							address: collateral.address,
						},
					},
				},
				{
					triggerPrice: expect.any(String),
					realizedProfitInCollateral: {
						balance: expect.any(String),
						token: {
							decimals: collateral.decimals,
							symbol: collateral.symbol,
							address: collateral.address,
						},
					},
					realizedProfitInDebt: {
						balance: expect.any(String),
						token: {
							decimals: debt.decimals,
							symbol: debt.symbol,
							address: debt.address,
						},
					},
					totalProfitInCollateral: {
						balance: expect.any(String),
						token: {
							decimals: collateral.decimals,
							symbol: collateral.symbol,
							address: collateral.address,
						},
					},
					totalProfitInDebt: {
						balance: expect.any(String),
						token: {
							decimals: debt.decimals,
							symbol: debt.symbol,
							address: debt.address,
						},
					},
					stopLossDynamicPrice: expect.any(String),
					fee: {
						balance: expect.any(String),
						token: {
							decimals: collateral.decimals,
							symbol: collateral.symbol,
							address: collateral.address,
						},
					},
					totalFee: {
						balance: expect.any(String),
						token: {
							decimals: collateral.decimals,
							symbol: collateral.symbol,
							address: collateral.address,
						},
					},
				},
				{
					triggerPrice: expect.any(String),
					realizedProfitInCollateral: {
						balance: expect.any(String),
						token: {
							decimals: collateral.decimals,
							symbol: collateral.symbol,
							address: collateral.address,
						},
					},
					realizedProfitInDebt: {
						balance: expect.any(String),
						token: {
							decimals: debt.decimals,
							symbol: debt.symbol,
							address: debt.address,
						},
					},
					totalProfitInCollateral: {
						balance: expect.any(String),
						token: {
							decimals: collateral.decimals,
							symbol: collateral.symbol,
							address: collateral.address,
						},
					},
					totalProfitInDebt: {
						balance: expect.any(String),
						token: {
							decimals: debt.decimals,
							symbol: debt.symbol,
							address: debt.address,
						},
					},
					stopLossDynamicPrice: expect.any(String),
					fee: {
						balance: expect.any(String),
						token: {
							decimals: collateral.decimals,
							symbol: collateral.symbol,
							address: collateral.address,
						},
					},
					totalFee: {
						balance: expect.any(String),
						token: {
							decimals: collateral.decimals,
							symbol: collateral.symbol,
							address: collateral.address,
						},
					},
				},
			],
		},
		transaction: {
			to: dpm,
			data: expect.any(String),
			triggerTxData: expect.any(String),
		},
		encodedTriggerData: expect.any(String),
		warnings: [],
	};

	return response;
};

export const autoBuyWithoutMaxBuyPriceResponse = ({
	dpm,
	collateral,
	debt,
	hasStablecoinDebt,
	executionLTV,
	targetLTV,
	targetLTVWithDeviation,
}: {
	dpm: string;
	collateral: { decimals: number; symbol: string; address: string };
	debt: { decimals: number; symbol: string; address: string };
	hasStablecoinDebt: boolean;
	executionLTV: string;
	targetLTV: string;
	targetLTVWithDeviation: string[];
}) => {
	const response = {
		simulation: {
			executionLTV,
			targetLTV,
			collateralAmountAfterExecution: expect.any(String),
			debtAmountAfterExecution: expect.any(String),
			targetLTVWithDeviation,
			targetMultiple: expect.any(String),
			executionPrice: expect.any(String),
			position: {
				hasStablecoinDebt,
				ltv: expect.any(String),
				collateral: {
					balance: expect.any(String),
					token: {
						decimals: collateral.decimals,
						symbol: collateral.symbol,
						address: collateral.address,
					},
				},
				debt: {
					balance: expect.any(String),
					token: {
						decimals: debt.decimals,
						symbol: debt.symbol,
						address: debt.address,
					},
				},
				address: dpm,
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
			to: dpm,
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
	};

	return response;
};

export const autoSellWithoutMinSellPriceResponse = ({
	dpm,
	collateral,
	debt,
	hasStablecoinDebt,
	executionLTV,
	targetLTV,
	targetLTVWithDeviation,
}: {
	dpm: string;
	collateral: { decimals: number; symbol: string; address: string };
	debt: { decimals: number; symbol: string; address: string };
	hasStablecoinDebt: boolean;
	executionLTV: string;
	targetLTV: string;
	targetLTVWithDeviation: string[];
}) => {
	const response = {
		simulation: {
			executionLTV,
			targetLTV,
			collateralAmountAfterExecution: expect.any(String),
			debtAmountAfterExecution: expect.any(String),
			targetLTVWithDeviation,
			targetMultiple: expect.any(String),
			executionPrice: expect.any(String),
			position: {
				hasStablecoinDebt,
				ltv: expect.any(String),
				collateral: {
					balance: expect.any(String),
					token: {
						decimals: collateral.decimals,
						symbol: collateral.symbol,
						address: collateral.address,
					},
				},
				debt: {
					balance: expect.any(String),
					token: {
						decimals: debt.decimals,
						symbol: debt.symbol,
						address: debt.address,
					},
				},
				address: dpm,
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
			to: dpm,
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
	};

	return response;
};

export const trailingStopLossResponse = ({
	dpm,
	collateral,
	debt,
	hasStablecoinDebt,
}: {
	dpm: string;
	collateral: { decimals: number; symbol: string; address: string; oraclesAddress: string };
	debt: {
		decimals: number;
		symbol: string;
		address: string;
		oraclesAddress: string;
		usdcVariant?: 'usdceOptimism' | 'usdbcBase';
	};
	hasStablecoinDebt: boolean;
}) => {
	const usdcVariantId = {
		usdceOptimism: '0x0b2c639c533813f4aa9d7837caf62653d097ff85',
		usdbcBase: '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913',
	};

	const response = {
		simulation: {
			latestPrice: {
				tokenRoundId: expect.any(String),
				denominationRoundId: expect.any(String),
				token: {
					id: collateral.address.toLocaleLowerCase(),
					symbol: collateral.symbol,
					oraclesToken: [
						{
							address: collateral.oraclesAddress,
						},
					],
				},
				denomination: {
					id: debt.usdcVariant ? usdcVariantId[debt.usdcVariant] : debt.address.toLocaleLowerCase(),
					symbol: debt.usdcVariant && debt.usdcVariant === 'usdbcBase' ? 'USDC' : debt.symbol,
					oraclesToken: [
						{
							address: debt.oraclesAddress,
						},
					],
				},
				derivedPrice: expect.any(String),
			},
			position: {
				hasStablecoinDebt,
				ltv: expect.any(String),
				collateral: {
					balance: expect.any(String),
					token: {
						decimals: collateral.decimals,
						symbol: collateral.symbol,
						address: collateral.address,
					},
				},
				debt: {
					balance: expect.any(String),
					token: {
						decimals: debt.decimals,
						symbol: debt.symbol,
						address: debt.address,
					},
				},
				address: dpm,
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
			to: dpm,
			data: expect.any(String),
			triggerTxData: expect.any(String),
		},
		encodedTriggerData: expect.any(String),
		warnings: [],
	};

	return response;
};

export const responses = {
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
	autoBuyDoesNotExist: {
		message: 'Validation Errors',
		errors: [
			{
				message: 'Auto buy trigger does not exist',
				code: 'auto-buy-trigger-does-not-exist',
				path: [],
			},
		],
		warnings: [],
	},
	autoBuyAlreadyExists: {
		message: 'Validation Errors',
		errors: [
			{
				message: 'Auto buy trigger already exists',
				code: 'auto-buy-trigger-already-exists',
				path: [],
			},
		],
		warnings: [],
	},
	autoSellDoesNotExist: {
		message: 'Validation Errors',
		errors: [
			{
				message: 'Auto sell trigger does not exist',
				code: 'auto-sell-trigger-does-not-exist',
				path: [],
			},
		],
		warnings: [],
	},
	autoSellAlreadyExists: {
		message: 'Validation Errors',
		errors: [
			{
				message: 'Auto sell trigger already exists',
				code: 'auto-sell-trigger-already-exists',
				path: [],
			},
		],
		warnings: [],
	},
	autoTakeProfitDoesNotExist: {
		message: 'Validation Errors',
		errors: [
			{
				message: 'Trigger does not exist',
				code: 'trigger-does-not-exist',
				path: [],
			},
		],
		warnings: [],
	},
	autoTakeProfitAlreadyExists: {
		message: 'Validation Errors',
		errors: [
			{
				message: 'Trigger already exists',
				code: 'trigger-already-exists',
				path: [],
			},
		],
		warnings: [],
	},
	stopLossDoesNotExist: {
		message: 'Validation Errors',
		errors: [
			{
				message: 'Stop loss trigger does not exist',
				code: 'stop-loss-trigger-does-not-exist',
				path: [],
			},
		],
		warnings: [],
	},
	stopLossAlreadyExist: {
		message: 'Validation Errors',
		errors: [
			{
				message: 'Stop Loss trigger already exists',
				code: 'stop-loss-trigger-already-exists',
				path: [],
			},
		],
		warnings: [],
	},
	missingChainIdGetRequest: {
		message: 'Validation Errors',
		errors: [
			{
				code: 'invalid_union',
				message: 'Invalid input',
				path: ['chainId'],
			},
		],
	},
	wrongChainIdGetRequest: {
		message: 'Validation Errors',
		errors: [
			{
				code: 'custom',
				message: 'Invalid input',
				path: ['chainId'],
			},
		],
	},
	wrongDpmGetRequest: {
		message: 'Validation Errors',
		errors: [
			{
				code: 'custom',
				fatal: true,
				message: 'Invalid address format',
				path: ['dpm'],
			},
		],
	},
	wrongAccountGetRequest: {
		message: 'Validation Errors',
		errors: [
			{
				code: 'custom',
				fatal: true,
				message: 'Invalid address format',
				path: ['account'],
			},
		],
	},
	wrongPoolIdGetRequest: {
		message: 'Validation Errors',
		errors: [
			{
				code: 'custom',
				fatal: true,
				message: 'Invalid address format',
				path: ['poolId'],
			},
		],
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
				executionLTV: '1500',
				maxBaseFee: '300',
				targetLTV: '5000',
				useMaxBuyPrice: false,
			},
		},
		updateMaxBuyPrice: {
			dpm: '0x551eb8395093fde4b9eef017c93593a3c7a75138',
			protocol: 'aavev3',
			position: {
				collateral: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
				debt: '0x6b175474e89094c44da98b954eedeac495271d0f',
			},
			action: 'update',
			triggerData: {
				executionLTV: '3800',
				maxBaseFee: '300',
				maxBuyPrice: '1000000000000',
				targetLTV: '4400',
				useMaxBuyPrice: true,
			},
		},
		remove: {
			dpm: '0x551eb8395093fde4b9eef017c93593a3c7a75138',
			protocol: 'aavev3',
			position: {
				collateral: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
				debt: '0x6b175474e89094c44da98b954eedeac495271d0f',
			},
			action: 'remove',
			triggerData: {
				executionLTV: '38',
				maxBaseFee: '300',
				targetLTV: '44',
				useMaxBuyPrice: false,
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
				executionLTV: '7900',
				maxBaseFee: '300',
				targetLTV: '3800',
				useMinSellPrice: false,
			},
		},
		updateMinSellPrice: {
			dpm: '0xb42d970a6424583618d0013e0d6ebb039dd1c945',
			protocol: 'aavev3',
			position: {
				collateral: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
				debt: '0x40d16fc0246ad3160ccc09b8d0d3a2cd28ae6c2f',
			},
			action: 'update',
			triggerData: {
				executionLTV: '5000',
				maxBaseFee: '300',
				minSellPrice: '25000000000',
				targetLTV: '4500',
				useMinSellPrice: true,
			},
		},
		remove: {
			dpm: '0xb42d970a6424583618d0013e0d6ebb039dd1c945',
			protocol: 'aavev3',
			position: {
				collateral: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
				debt: '0x40d16fc0246ad3160ccc09b8d0d3a2cd28ae6c2f',
			},
			action: 'remove',
			triggerData: {
				executionLTV: '50',
				maxBaseFee: '300',
				minSellPrice: '20000000000',
				targetLTV: '45',
				useMinSellPrice: false,
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
		updateCloseToCollateral: {
			dpm: '0x6bb713b56e73a115164b4b56ea1f5a76640c4d19',
			protocol: 'aavev3',
			position: {
				collateral: '0xae78736cd615f374d3085123a210448e74fc6393',
				debt: '0x6b175474e89094c44da98b954eedeac495271d0f',
			},
			action: 'update',
			triggerData: {
				executionLTV: '6500',
				token: '0xae78736cd615f374d3085123a210448e74fc6393',
			},
		},
		updateCloseToDebt: {
			dpm: '0xb727aff37c480a0fdba8a6c97fc4fcf3a19f2ac7',
			protocol: 'aavev3',
			position: {
				collateral: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
				debt: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
			},
			action: 'update',
			triggerData: {
				executionLTV: '7700',
				token: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
			},
		},
		remove: {
			dpm: '0xd289c4d1ffc484203739aeb5c3f8844ec51c7ad2',
			protocol: 'aavev3',
			position: {
				collateral: '0xae78736cd615f374d3085123a210448e74fc6393',
				debt: '0x6b175474e89094c44da98b954eedeac495271d0f',
			},
			action: 'remove',
			triggerData: {
				executionLTV: '6912',
				token: '0xae78736cd615f374d3085123a210448e74fc6393',
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
		updateCloseToCollateral: {
			dpm: '0x62320f403ea16a143be7d78485d9e4674c925cc3',
			protocol: 'aavev3',
			position: {
				collateral: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
				debt: '0x6b175474e89094c44da98b954eedeac495271d0f',
			},
			action: 'update',
			triggerData: {
				trailingDistance: '148000000000',
				token: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
			},
		},
		updateCloseToDebt: {
			dpm: '0xed0f85df55352394f48a68849862f8a15bde0f8b',
			protocol: 'aavev3',
			position: {
				collateral: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
				debt: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
			},
			action: 'update',
			triggerData: {
				trailingDistance: '124000000000',
				token: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
			},
		},
		remove: {
			dpm: '0x62320f403ea16a143be7d78485d9e4674c925cc3',
			protocol: 'aavev3',
			position: {
				collateral: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
				debt: '0x6b175474e89094c44da98b954eedeac495271d0f',
			},
			action: 'remove',
			triggerData: {
				trailingDistance: '14800000000000000000',
				token: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
			},
		},
	},
	autoTakeProfit: {
		profitInDebt: {
			dpm: '0x16f2c35e062c14f57475de0a466f7e08b03a9c7d',
			protocol: 'aavev3',
			position: {
				collateral: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
				debt: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
			},
			action: 'add',
			triggerData: {
				executionLTV: '1500',
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
		updateProfitInCollateral: {
			dpm: '0x2e0515d7a3ea0276f28c94c426c5d2d1d85fd4d5',
			protocol: 'aavev3',
			position: {
				collateral: '0x7f39c581f595b53c5cb19bd0b3f8da6c935e2ca0',
				debt: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
			},
			action: 'update',
			triggerData: {
				executionLTV: '1520',
				executionPrice: '700000000000',
				stopLoss: {
					triggerData: {
						executionLTV: '7740',
						token: '0x7f39c581f595b53c5cb19bd0b3f8da6c935e2ca0',
					},
					action: 'update',
				},
				withdrawToken: '0x7f39c581f595b53c5cb19bd0b3f8da6c935e2ca0',
				withdrawStep: '500',
			},
		},
		updateProfitInDebt: {
			dpm: '0xb727aff37c480a0fdba8a6c97fc4fcf3a19f2ac7',
			protocol: 'aavev3',
			position: {
				collateral: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
				debt: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
			},
			action: 'update',
			triggerData: {
				executionLTV: '2220',
				executionPrice: '514130825283',
				stopLoss: {
					triggerData: {
						executionLTV: '7700',
						token: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
					},
					action: 'update',
				},
				withdrawToken: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
				withdrawStep: '500',
			},
		},
		remove: {
			dpm: '0x2e0515d7a3ea0276f28c94c426c5d2d1d85fd4d5',
			protocol: 'aavev3',
			position: {
				collateral: '0x7f39c581f595b53c5cb19bd0b3f8da6c935e2ca0',
				debt: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
			},
			action: 'remove',
			triggerData: {
				executionLTV: '1520',
				executionPrice: '700000000000',
				withdrawToken: '0x7f39c581f595b53c5cb19bd0b3f8da6c935e2ca0',
				withdrawStep: '2020',
			},
		},
	},
};

export const validPayloadsMorpho = {
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
		updateMaxBuyPrice: {
			dpm: '0x2e0515d7a3ea0276f28c94c426c5d2d1d85fd4d5',
			protocol: 'morphoblue',
			position: {
				collateral: '0x7f39c581f595b53c5cb19bd0b3f8da6c935e2ca0',
				debt: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
			},
			action: 'update',
			triggerData: {
				executionLTV: '3000',
				maxBaseFee: '300',
				maxBuyPrice: '280000000',
				poolId: '0xc54d7acf14de29e0e5527cabd7a576506870346a78a11a6762e2cca66322ec41',
				targetLTV: '4300',
				useMaxBuyPrice: true,
			},
		},
		remove: {
			dpm: '0x2e0515d7a3ea0276f28c94c426c5d2d1d85fd4d5',
			protocol: 'morphoblue',
			position: {
				collateral: '0x7f39c581f595b53c5cb19bd0b3f8da6c935e2ca0',
				debt: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
			},
			action: 'remove',
			triggerData: {
				executionLTV: '30',
				maxBaseFee: '300',
				maxBuyPrice: '300000000',
				poolId: '0xc54d7acf14de29e0e5527cabd7a576506870346a78a11a6762e2cca66322ec41',
				targetLTV: '43',
				useMaxBuyPrice: false,
			},
		},
	},
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
		updateMinSellPrice: {
			dpm: '0x2e0515d7a3ea0276f28c94c426c5d2d1d85fd4d5',
			protocol: 'morphoblue',
			position: {
				collateral: '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599',
				debt: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
			},
			action: 'update',
			triggerData: {
				executionLTV: '8000',
				maxBaseFee: '300',
				minSellPrice: '400000000000',
				poolId: '0x3a85e619751152991742810df6ec69ce473daef99e28a64ab2340d7b7ccfee49',
				targetLTV: '7300',
				useMinSellPrice: true,
			},
		},
		remove: {
			dpm: '0x2e0515d7a3ea0276f28c94c426c5d2d1d85fd4d5',
			protocol: 'morphoblue',
			position: {
				collateral: '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599',
				debt: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
			},
			action: 'remove',
			triggerData: {
				executionLTV: '80',
				maxBaseFee: '300',
				minSellPrice: '500000000000',
				poolId: '0x3a85e619751152991742810df6ec69ce473daef99e28a64ab2340d7b7ccfee49',
				targetLTV: '73',
				useMinSellPrice: false,
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
		updateCloseToCollateral: {
			dpm: '0x2e0515d7a3ea0276f28c94c426c5d2d1d85fd4d5',
			protocol: 'morphoblue',
			position: {
				collateral: '0x7f39c581f595b53c5cb19bd0b3f8da6c935e2ca0',
				debt: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
			},
			action: 'update',
			triggerData: {
				executionLTV: '9300',
				poolId: '0xc54d7acf14de29e0e5527cabd7a576506870346a78a11a6762e2cca66322ec41',
				token: '0x7f39c581f595b53c5cb19bd0b3f8da6c935e2ca0',
			},
		},
		updateCloseToDebt: {
			dpm: '0x2e0515d7a3ea0276f28c94c426c5d2d1d85fd4d5',
			protocol: 'morphoblue',
			position: {
				collateral: '0x7f39c581f595b53c5cb19bd0b3f8da6c935e2ca0',
				debt: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
			},
			action: 'update',
			triggerData: {
				executionLTV: '8490',
				poolId: '0xb323495f7e4148be5643a4ea4a8221eef163e4bccfdedc2a6f4696baacbc86cc',
				token: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
			},
		},
		remove: {
			dpm: '0x2e0515d7a3ea0276f28c94c426c5d2d1d85fd4d5',
			protocol: 'morphoblue',
			position: {
				collateral: '0x7f39c581f595b53c5cb19bd0b3f8da6c935e2ca0',
				debt: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
			},
			action: 'remove',
			triggerData: {
				executionLTV: '9300',
				poolId: '0xc54d7acf14de29e0e5527cabd7a576506870346a78a11a6762e2cca66322ec41',
				token: '0x7f39c581f595b53c5cb19bd0b3f8da6c935e2ca0',
			},
		},
	},
	trailingStopLoss: {
		closeToDebt: {
			dpm: '0xb2f1349068c1cb6a596a22a3531b8062778c9da4',
			protocol: 'morphoblue',
			position: {
				collateral: '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599',
				debt: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
			},
			action: 'add',
			triggerData: {
				trailingDistance: '4050000000000',
				poolId: '0x3a85e619751152991742810df6ec69ce473daef99e28a64ab2340d7b7ccfee49',
				token: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
			},
		},
		updateCloseToCollateral: {
			dpm: '0x7126e8e9c26832b441a560f4283e09f9c51ab605',
			protocol: 'morphoblue',
			position: {
				collateral: '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599',
				debt: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
			},
			action: 'update',
			triggerData: {
				trailingDistance: '3500000000000',
				poolId: '0x3a85e619751152991742810df6ec69ce473daef99e28a64ab2340d7b7ccfee49',
				token: '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599',
			},
		},
		updateCloseToDebt: {
			dpm: '0xce049ff57d4146d5be3a55e60ef4523bb70798b6',
			protocol: 'morphoblue',
			position: {
				collateral: '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599',
				debt: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
			},
			action: 'update',
			triggerData: {
				trailingDistance: '3260000000000',
				poolId: '0x3a85e619751152991742810df6ec69ce473daef99e28a64ab2340d7b7ccfee49',
				token: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
			},
		},
		remove: {
			dpm: '0x7126e8e9c26832b441a560f4283e09f9c51ab605',
			protocol: 'morphoblue',
			position: {
				collateral: '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599',
				debt: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
			},
			action: 'remove',
			triggerData: {
				trailingDistance: '350000000000000000000',
				poolId: '0x3a85e619751152991742810df6ec69ce473daef99e28a64ab2340d7b7ccfee49',
				token: '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599',
			},
		},
	},
	autoTakeProfit: {
		profitInDebt: {
			dpm: '0x2e0515d7a3ea0276f28c94c426c5d2d1d85fd4d5',
			protocol: 'morphoblue',
			position: {
				collateral: '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599',
				debt: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
			},
			action: 'add',
			triggerData: {
				executionLTV: '1500',
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
		updateProfitInCollateral: {
			dpm: '0x2e0515d7a3ea0276f28c94c426c5d2d1d85fd4d5',
			protocol: 'morphoblue',
			position: {
				collateral: '0x7f39c581f595b53c5cb19bd0b3f8da6c935e2ca0',
				debt: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
			},
			action: 'update',
			triggerData: {
				executionLTV: '3580',
				executionPrice: '350000000',
				poolId: '0xc54d7acf14de29e0e5527cabd7a576506870346a78a11a6762e2cca66322ec41',
				stopLoss: {
					triggerData: {
						executionLTV: '9300',
						token: '0x7f39c581f595b53c5cb19bd0b3f8da6c935e2ca0',
						poolId: '0xc54d7acf14de29e0e5527cabd7a576506870346a78a11a6762e2cca66322ec41',
					},
					action: 'update',
				},
				withdrawToken: '0x7f39c581f595b53c5cb19bd0b3f8da6c935e2ca0',
				withdrawStep: '500',
			},
		},
		updateProfitInDebt: {
			dpm: '0x2e0515d7a3ea0276f28c94c426c5d2d1d85fd4d5',
			protocol: 'morphoblue',
			position: {
				collateral: '0x7f39c581f595b53c5cb19bd0b3f8da6c935e2ca0',
				debt: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
			},
			action: 'update',
			triggerData: {
				executionLTV: '1740',
				executionPrice: '600000000000',
				poolId: '0xb323495f7e4148be5643a4ea4a8221eef163e4bccfdedc2a6f4696baacbc86cc',
				stopLoss: {
					triggerData: {
						executionLTV: '8490',
						token: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
						poolId: '0xb323495f7e4148be5643a4ea4a8221eef163e4bccfdedc2a6f4696baacbc86cc',
					},
					action: 'update',
				},
				withdrawToken: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
				withdrawStep: '500',
			},
		},
		remove: {
			dpm: '0x2e0515d7a3ea0276f28c94c426c5d2d1d85fd4d5',
			protocol: 'morphoblue',
			position: {
				collateral: '0x7f39c581f595b53c5cb19bd0b3f8da6c935e2ca0',
				debt: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
			},
			action: 'remove',
			triggerData: {
				executionLTV: '3580',
				executionPrice: '350000000',
				poolId: '0xc54d7acf14de29e0e5527cabd7a576506870346a78a11a6762e2cca66322ec41',
				withdrawToken: '0x7f39c581f595b53c5cb19bd0b3f8da6c935e2ca0',
				withdrawStep: '4080',
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
		updateMaxBuyPrice: {
			dpm: '0xce049ff57d4146d5be3a55e60ef4523bb70798b6',
			protocol: 'sparkv3',
			position: {
				collateral: '0x7f39c581f595b53c5cb19bd0b3f8da6c935e2ca0',
				debt: '0x6b175474e89094c44da98b954eedeac495271d0f',
			},
			action: 'update',
			triggerData: {
				executionLTV: '1100',
				maxBaseFee: '300',
				maxBuyPrice: '860000000000',
				targetLTV: '2300',
				useMaxBuyPrice: true,
			},
		},
		remove: {
			dpm: '0xce049ff57d4146d5be3a55e60ef4523bb70798b6',
			protocol: 'sparkv3',
			position: {
				collateral: '0x7f39c581f595b53c5cb19bd0b3f8da6c935e2ca0',
				debt: '0x6b175474e89094c44da98b954eedeac495271d0f',
			},
			action: 'remove',
			triggerData: {
				executionLTV: '17',
				maxBaseFee: '300',
				maxBuyPrice: '600000000000',
				targetLTV: '23',
				useMaxBuyPrice: false,
			},
		},
	},
	autoSell: {
		addWithoutMinSellPrice: {
			dpm: '0x6be31243e0ffa8f42d1f64834eca2ab6dc8f7498',
			protocol: 'sparkv3',
			position: {
				collateral: '0x7f39c581f595b53c5cb19bd0b3f8da6c935e2ca0',
				debt: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
			},
			action: 'add',
			triggerData: {
				executionLTV: '5700',
				maxBaseFee: '300',
				targetLTV: '4900',
				useMinSellPrice: false,
			},
		},
		updateMinSellPrice: {
			dpm: '0xb2f1349068c1cb6a596a22a3531b8062778c9da4',
			protocol: 'sparkv3',
			position: {
				collateral: '0x7f39c581f595b53c5cb19bd0b3f8da6c935e2ca0',
				debt: '0x6b175474e89094c44da98b954eedeac495271d0f',
			},
			action: 'update',
			triggerData: {
				executionLTV: '6000',
				maxBaseFee: '300',
				minSellPrice: '45000000000',
				targetLTV: '5000',
				useMinSellPrice: true,
			},
		},
		remove: {
			dpm: '0xb2f1349068c1cb6a596a22a3531b8062778c9da4',
			protocol: 'sparkv3',
			position: {
				collateral: '0x7f39c581f595b53c5cb19bd0b3f8da6c935e2ca0',
				debt: '0x6b175474e89094c44da98b954eedeac495271d0f',
			},
			action: 'remove',
			triggerData: {
				executionLTV: '60',
				maxBaseFee: '300',
				minSellPrice: '40000000000',
				targetLTV: '50',
				useMinSellPrice: false,
			},
		},
	},
	stopLoss: {
		closeToDebt: {
			dpm: '0x6be31243e0ffa8f42d1f64834eca2ab6dc8f7498',
			protocol: 'sparkv3',
			position: {
				collateral: '0x7f39c581f595b53c5cb19bd0b3f8da6c935e2ca0',
				debt: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
			},
			action: 'add',
			triggerData: {
				executionLTV: '8953',
				token: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
			},
		},
		updateCloseToCollateral: {
			dpm: '0x9ae9e1fcccb4934f29565121f9982a43a00f53ec',
			protocol: 'sparkv3',
			position: {
				collateral: '0x7f39c581f595b53c5cb19bd0b3f8da6c935e2ca0',
				debt: '0x6b175474e89094c44da98b954eedeac495271d0f',
			},
			action: 'update',
			triggerData: {
				executionLTV: '7760',
				token: '0x7f39c581f595b53c5cb19bd0b3f8da6c935e2ca0',
			},
		},
		updateCloseToDebt: {
			dpm: '0xce049ff57d4146d5be3a55e60ef4523bb70798b6',
			protocol: 'sparkv3',
			position: {
				collateral: '0x7f39c581f595b53c5cb19bd0b3f8da6c935e2ca0',
				debt: '0x6b175474e89094c44da98b954eedeac495271d0f',
			},
			action: 'update',
			triggerData: {
				executionLTV: '7790',
				token: '0x6b175474e89094c44da98b954eedeac495271d0f',
			},
		},
		remove: {
			dpm: '0x9ae9e1fcccb4934f29565121f9982a43a00f53ec',
			protocol: 'sparkv3',
			position: {
				collateral: '0x7f39c581f595b53c5cb19bd0b3f8da6c935e2ca0',
				debt: '0x6b175474e89094c44da98b954eedeac495271d0f',
			},
			action: 'remove',
			triggerData: {
				executionLTV: '7760',
				token: '0x7f39c581f595b53c5cb19bd0b3f8da6c935e2ca0',
			},
		},
	},
	trailingStopLoss: {
		closeToDebt: {
			dpm: '0x7126e8e9c26832b441a560f4283e09f9c51ab605',
			protocol: 'sparkv3',
			position: {
				collateral: '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599',
				debt: '0x6b175474e89094c44da98b954eedeac495271d0f',
			},
			action: 'add',
			triggerData: {
				trailingDistance: '350000000000',
				token: '0x6b175474e89094c44da98b954eedeac495271d0f',
			},
		},
		updateCloseToCollateral: {
			dpm: '0xff467bc814985c6bcabef2b0a3b3c237cd9be25f',
			protocol: 'sparkv3',
			position: {
				collateral: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
				debt: '0x6b175474e89094c44da98b954eedeac495271d0f',
			},
			action: 'update',
			triggerData: {
				trailingDistance: '120000000000',
				token: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
			},
		},
		updateCloseToDebt: {
			dpm: '0x705e65c617bdd31476ff3609a13a138a4100ae6c',
			protocol: 'sparkv3',
			position: {
				collateral: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
				debt: '0x6b175474e89094c44da98b954eedeac495271d0f',
			},
			action: 'update',
			triggerData: {
				trailingDistance: '128000000000',
				token: '0x6b175474e89094c44da98b954eedeac495271d0f',
			},
		},
		remove: {
			dpm: '0xff467bc814985c6bcabef2b0a3b3c237cd9be25f',
			protocol: 'sparkv3',
			position: {
				collateral: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
				debt: '0x6b175474e89094c44da98b954eedeac495271d0f',
			},
			action: 'remove',
			triggerData: {
				trailingDistance: '12000000000000000000',
				token: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
			},
		},
	},
	autoTakeProfit: {
		profitInDebt: {
			dpm: '0x6be31243e0ffa8f42d1f64834eca2ab6dc8f7498',
			protocol: 'sparkv3',
			position: {
				collateral: '0x7f39c581f595b53c5cb19bd0b3f8da6c935e2ca0',
				debt: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
			},
			action: 'add',
			triggerData: {
				executionLTV: '4400',
				executionPrice: '0',
				stopLoss: {
					triggerData: {
						executionLTV: '9090',
						token: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
					},
					action: 'add',
				},
				withdrawToken: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
				withdrawStep: '500',
			},
		},
		updateProfitInCollateral: {
			dpm: '0xce049ff57d4146d5be3a55e60ef4523bb70798b6',
			protocol: 'sparkv3',
			position: {
				collateral: '0x7f39c581f595b53c5cb19bd0b3f8da6c935e2ca0',
				debt: '0x6b175474e89094c44da98b954eedeac495271d0f',
			},
			action: 'update',
			triggerData: {
				executionLTV: '910',
				executionPrice: '900000000000',
				stopLoss: {
					triggerData: {
						executionLTV: '7790',
						token: '0x7f39c581f595b53c5cb19bd0b3f8da6c935e2ca0',
					},
					action: 'update',
				},
				withdrawToken: '0x7f39c581f595b53c5cb19bd0b3f8da6c935e2ca0',
				withdrawStep: '500',
			},
		},
		updateProfitInDebt: {
			dpm: '0xb42d970a6424583618d0013e0d6ebb039dd1c945',
			protocol: 'sparkv3',
			position: {
				collateral: '0x7f39c581f595b53c5cb19bd0b3f8da6c935e2ca0',
				debt: '0x6b175474e89094c44da98b954eedeac495271d0f',
			},
			action: 'update',
			triggerData: {
				executionLTV: '910',
				executionPrice: '763487710510',
				stopLoss: {
					triggerData: {
						executionLTV: '7790',
						token: '0x6b175474e89094c44da98b954eedeac495271d0f',
					},
					action: 'update',
				},
				withdrawToken: '0x6b175474e89094c44da98b954eedeac495271d0f',
				withdrawStep: '500',
			},
		},
		remove: {
			dpm: '0xce049ff57d4146d5be3a55e60ef4523bb70798b6',
			protocol: 'sparkv3',
			position: {
				collateral: '0x7f39c581f595b53c5cb19bd0b3f8da6c935e2ca0',
				debt: '0x6b175474e89094c44da98b954eedeac495271d0f',
			},
			action: 'remove',
			triggerData: {
				executionLTV: '2000',
				executionPrice: '650000000000',
				withdrawToken: '0x7f39c581f595b53c5cb19bd0b3f8da6c935e2ca0',
				withdrawStep: '2500',
			},
		},
	},
};

export const validPayloadsAaveV3Arbitrum = {
	autoBuy: {
		addWithoutMaxBuyPrice: {
			dpm: '0xf0464ef55705e5b5cb3b865d92be5341fe85fbb8',
			protocol: 'aavev3',
			position: {
				collateral: '0x82af49447d8a07e3bd95bd0d56f35241523fbab1',
				debt: '0xda10009cbd5d07dd0cecc66161fc93d7c9000da1',
			},
			action: 'add',
			triggerData: {
				executionLTV: '2900',
				maxBaseFee: '300',
				targetLTV: '5800',
				useMaxBuyPrice: false,
			},
		},
		updateMaxBuyPrice: {
			dpm: '0x1816c0d0b0a42b9118a53c2f6d0a305ed54ea74c',
			protocol: 'aavev3',
			position: {
				collateral: '0x5979d7b546e38e414f7e9822514be443a4800529',
				debt: '0xaf88d065e77c8cc2239327c5edb3a432268e5831',
			},
			action: 'update',
			triggerData: {
				executionLTV: '3500',
				maxBaseFee: '300',
				maxBuyPrice: '950000000000',
				targetLTV: '5300',
				useMaxBuyPrice: true,
			},
		},
		remove: {
			dpm: '0x1816c0d0b0a42b9118a53c2f6d0a305ed54ea74c',
			protocol: 'aavev3',
			position: {
				collateral: '0x5979d7b546e38e414f7e9822514be443a4800529',
				debt: '0xaf88d065e77c8cc2239327c5edb3a432268e5831',
			},
			action: 'remove',
			triggerData: {
				executionLTV: '35',
				maxBaseFee: '300',
				maxBuyPrice: '850000000000',
				targetLTV: '53',
				useMaxBuyPrice: false,
			},
		},
	},
	autoSell: {
		addWithoutMinSellPrice: {
			dpm: '0xf0464ef55705e5b5cb3b865d92be5341fe85fbb8',
			protocol: 'aavev3',
			position: {
				collateral: '0x82af49447d8a07e3bd95bd0d56f35241523fbab1',
				debt: '0xda10009cbd5d07dd0cecc66161fc93d7c9000da1',
			},
			action: 'add',
			triggerData: {
				executionLTV: '7200',
				maxBaseFee: '300',
				targetLTV: '5700',
				useMinSellPrice: false,
			},
		},
		updateMinSellPrice: {
			dpm: '0x1816c0d0b0a42b9118a53c2f6d0a305ed54ea74c',
			protocol: 'aavev3',
			position: {
				collateral: '0x5979d7b546e38e414f7e9822514be443a4800529',
				debt: '0xaf88d065e77c8cc2239327c5edb3a432268e5831',
			},
			action: 'update',
			triggerData: {
				executionLTV: '6400',
				maxBaseFee: '300',
				minSellPrice: '50000000000',
				targetLTV: '5600',
				useMinSellPrice: true,
			},
		},
		remove: {
			dpm: '0x1816c0d0b0a42b9118a53c2f6d0a305ed54ea74c',
			protocol: 'aavev3',
			position: {
				collateral: '0x5979d7b546e38e414f7e9822514be443a4800529',
				debt: '0xaf88d065e77c8cc2239327c5edb3a432268e5831',
			},
			action: 'remove',
			triggerData: {
				executionLTV: '64',
				maxBaseFee: '300',
				minSellPrice: '100000000000',
				targetLTV: '56',
				useMinSellPrice: false,
			},
		},
	},
	stopLoss: {
		closeToDebt: {
			dpm: '0xf0464ef55705e5b5cb3b865d92be5341fe85fbb8',
			protocol: 'aavev3',
			position: {
				collateral: '0x82af49447d8a07e3bd95bd0d56f35241523fbab1',
				debt: '0xda10009cbd5d07dd0cecc66161fc93d7c9000da1',
			},
			action: 'add',
			triggerData: {
				executionLTV: '8140',
				token: '0xda10009cbd5d07dd0cecc66161fc93d7c9000da1',
			},
		},
		updateCloseToCollateral: {
			dpm: '0x5658e378371809d1aef8749ebad8d161cd90d33c',
			protocol: 'aavev3',
			position: {
				collateral: '0x82af49447d8a07e3bd95bd0d56f35241523fbab1',
				debt: '0xda10009cbd5d07dd0cecc66161fc93d7c9000da1',
			},
			action: 'update',
			triggerData: {
				executionLTV: '8140',
				token: '0x82af49447d8a07e3bd95bd0d56f35241523fbab1',
			},
		},
		updateCloseToDebt: {
			dpm: '0x8ad95c7bcb4f1f346b04c82c4ec9363922453c53',
			protocol: 'aavev3',
			position: {
				collateral: '0xec70dcb4a1efa46b8f2d97c310c9c4790ba5ffa8',
				debt: '0x82af49447d8a07e3bd95bd0d56f35241523fbab1',
			},
			action: 'update',
			triggerData: {
				executionLTV: '6560',
				token: '0x82af49447d8a07e3bd95bd0d56f35241523fbab1',
			},
		},
		remove: {
			dpm: '0x5658e378371809d1aef8749ebad8d161cd90d33c',
			protocol: 'aavev3',
			position: {
				collateral: '0x82af49447d8a07e3bd95bd0d56f35241523fbab1',
				debt: '0xda10009cbd5d07dd0cecc66161fc93d7c9000da1',
			},
			action: 'remove',
			triggerData: {
				executionLTV: '8140',
				token: '0x82af49447d8a07e3bd95bd0d56f35241523fbab1',
			},
		},
	},
	trailingStopLoss: {
		closeToDebt: {
			dpm: '0xf0464ef55705e5b5cb3b865d92be5341fe85fbb8',
			protocol: 'aavev3',
			position: {
				collateral: '0x82af49447d8a07e3bd95bd0d56f35241523fbab1',
				debt: '0xda10009cbd5d07dd0cecc66161fc93d7c9000da1',
			},
			action: 'add',
			triggerData: {
				trailingDistance: '13000000000',
				token: '0xda10009cbd5d07dd0cecc66161fc93d7c9000da1',
			},
		},
		updateCloseToCollateral: {
			dpm: '0x9a8999d48499743b5ca481210dc568018a3b417a',
			protocol: 'aavev3',
			position: {
				collateral: '0x2f2a2543b76a4166549f7aab2e75bef0aefc5b0f',
				debt: '0xda10009cbd5d07dd0cecc66161fc93d7c9000da1',
			},
			action: 'update',
			triggerData: {
				trailingDistance: '3670000000000',
				token: '0x2f2a2543b76a4166549f7aab2e75bef0aefc5b0f',
			},
		},
		updateCloseToDebt: {
			dpm: '0x849c16eb8bdeca1cb1bc7e83f1b92b1926b427ca',
			protocol: 'aavev3',
			position: {
				collateral: '0x2f2a2543b76a4166549f7aab2e75bef0aefc5b0f',
				debt: '0xaf88d065e77c8cc2239327c5edb3a432268e5831',
			},
			action: 'update',
			triggerData: {
				trailingDistance: '4080000000000',
				token: '0xaf88d065e77c8cc2239327c5edb3a432268e5831',
			},
		},
		remove: {
			dpm: '0x9a8999d48499743b5ca481210dc568018a3b417a',
			protocol: 'aavev3',
			position: {
				collateral: '0x2f2a2543b76a4166549f7aab2e75bef0aefc5b0f',
				debt: '0xda10009cbd5d07dd0cecc66161fc93d7c9000da1',
			},
			action: 'remove',
			triggerData: {
				trailingDistance: '367000000000000000000',
				token: '0x2f2a2543b76a4166549f7aab2e75bef0aefc5b0f',
			},
		},
	},
	autoTakeProfit: {
		profitInDebt: {
			dpm: '0xf0464ef55705e5b5cb3b865d92be5341fe85fbb8',
			protocol: 'aavev3',
			position: {
				collateral: '0x82af49447d8a07e3bd95bd0d56f35241523fbab1',
				debt: '0xda10009cbd5d07dd0cecc66161fc93d7c9000da1',
			},
			action: 'add',
			triggerData: {
				executionLTV: '3000',
				executionPrice: '0',
				stopLoss: {
					triggerData: {
						executionLTV: '7890',
						token: '0xda10009cbd5d07dd0cecc66161fc93d7c9000da1',
					},
					action: 'add',
				},
				withdrawToken: '0xda10009cbd5d07dd0cecc66161fc93d7c9000da1',
				withdrawStep: '500',
			},
		},
		updateProfitInCollateral: {
			dpm: '0x849c16eb8bdeca1cb1bc7e83f1b92b1926b427ca',
			protocol: 'aavev3',
			position: {
				collateral: '0x2f2a2543b76a4166549f7aab2e75bef0aefc5b0f',
				debt: '0xaf88d065e77c8cc2239327c5edb3a432268e5831',
			},
			action: 'update',
			triggerData: {
				executionLTV: '600',
				executionPrice: '20125523638539',
				withdrawToken: '0x2f2a2543b76a4166549f7aab2e75bef0aefc5b0f',
				withdrawStep: '500',
			},
		},
		updateProfitInDebt: {
			dpm: '0x5658e378371809d1aef8749ebad8d161cd90d33c',
			protocol: 'aavev3',
			position: {
				collateral: '0x82af49447d8a07e3bd95bd0d56f35241523fbab1',
				debt: '0xda10009cbd5d07dd0cecc66161fc93d7c9000da1',
			},
			action: 'update',
			triggerData: {
				executionLTV: '500',
				executionPrice: '600000000000',
				stopLoss: {
					triggerData: {
						executionLTV: '8140',
						token: '0xda10009cbd5d07dd0cecc66161fc93d7c9000da1',
					},
					action: 'update',
				},
				withdrawToken: '0xda10009cbd5d07dd0cecc66161fc93d7c9000da1',
				withdrawStep: '500',
			},
		},
		remove: {
			dpm: '0x849c16eb8bdeca1cb1bc7e83f1b92b1926b427ca',
			protocol: 'aavev3',
			position: {
				collateral: '0x2f2a2543b76a4166549f7aab2e75bef0aefc5b0f',
				debt: '0xaf88d065e77c8cc2239327c5edb3a432268e5831',
			},
			action: 'remove',
			triggerData: {
				executionLTV: '1600',
				executionPrice: '9000000000000',
				withdrawToken: '0x2f2a2543b76a4166549f7aab2e75bef0aefc5b0f',
				withdrawStep: '2100',
			},
		},
	},
};

export const validPayloadsAaveV3Base = {
	autoBuy: {
		addWithoutMaxBuyPrice: {
			dpm: '0xf71da0973121d949e1cee818eb519ba364406309',
			protocol: 'aavev3',
			position: {
				collateral: '0x4200000000000000000000000000000000000006',
				debt: '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913',
			},
			action: 'add',
			triggerData: {
				executionLTV: '1200',
				maxBaseFee: '300',
				targetLTV: '3300',
				useMaxBuyPrice: false,
			},
		},
		updateMaxBuyPrice: {
			dpm: '0x5a1f00e5a2c1bf7974688ac1e1343e66598cd526',
			protocol: 'aavev3',
			position: {
				collateral: '0x2ae3f1ec7f1f5012cfeab0185bfc7aa3cf0dec22',
				debt: '0xd9aaec86b65d86f6a7b5b1b0c42ffa531710b6ca',
			},
			action: 'update',
			triggerData: {
				executionLTV: '3000',
				maxBaseFee: '300',
				maxBuyPrice: '1000000000000',
				targetLTV: '5600',
				useMaxBuyPrice: true,
			},
		},
		remove: {
			dpm: '0x5a1f00e5a2c1bf7974688ac1e1343e66598cd526',
			protocol: 'aavev3',
			position: {
				collateral: '0x2ae3f1ec7f1f5012cfeab0185bfc7aa3cf0dec22',
				debt: '0xd9aaec86b65d86f6a7b5b1b0c42ffa531710b6ca',
			},
			action: 'remove',
			triggerData: {
				executionLTV: '51',
				maxBaseFee: '300',
				targetLTV: '56',
				useMaxBuyPrice: false,
			},
		},
	},
	autoSell: {
		addWithoutMinSellPrice: {
			dpm: '0xf71da0973121d949e1cee818eb519ba364406309',
			protocol: 'aavev3',
			position: {
				collateral: '0x4200000000000000000000000000000000000006',
				debt: '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913',
			},
			action: 'add',
			triggerData: {
				executionLTV: '6000',
				maxBaseFee: '300',
				targetLTV: '3300',
				useMinSellPrice: false,
			},
		},
		updateMinSellPrice: {
			dpm: '0x5a1f00e5a2c1bf7974688ac1e1343e66598cd526',
			protocol: 'aavev3',
			position: {
				collateral: '0x2ae3f1ec7f1f5012cfeab0185bfc7aa3cf0dec22',
				debt: '0xd9aaec86b65d86f6a7b5b1b0c42ffa531710b6ca',
			},
			action: 'update',
			triggerData: {
				executionLTV: '6500',
				maxBaseFee: '300',
				minSellPrice: '120000000000',
				targetLTV: '6000',
				useMinSellPrice: true,
			},
		},
		remove: {
			dpm: '0x5a1f00e5a2c1bf7974688ac1e1343e66598cd526',
			protocol: 'aavev3',
			position: {
				collateral: '0x2ae3f1ec7f1f5012cfeab0185bfc7aa3cf0dec22',
				debt: '0xd9aaec86b65d86f6a7b5b1b0c42ffa531710b6ca',
			},
			action: 'remove',
			triggerData: {
				executionLTV: '65',
				maxBaseFee: '300',
				minSellPrice: '100000000000',
				targetLTV: '60',
				useMinSellPrice: false,
			},
		},
	},
	stopLoss: {
		closeToDebt: {
			dpm: '0xf71da0973121d949e1cee818eb519ba364406309',
			protocol: 'aavev3',
			position: {
				collateral: '0x4200000000000000000000000000000000000006',
				debt: '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913',
			},
			action: 'add',
			triggerData: {
				executionLTV: '7890',
				token: '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913',
			},
		},
		updateCloseToCollateral: {
			dpm: '0xb3287c2890ed7ea99cb4d5d899434bb64997a609',
			protocol: 'aavev3',
			position: {
				collateral: '0x4200000000000000000000000000000000000006',
				debt: '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913',
			},
			action: 'update',
			triggerData: {
				executionLTV: '7855',
				token: '0x4200000000000000000000000000000000000006',
			},
		},
		updateCloseToDebt: {
			dpm: '0x20e74013d82fea853afca3b4cb1fd9c2b105f55a',
			protocol: 'aavev3',
			position: {
				collateral: '0x4200000000000000000000000000000000000006',
				debt: '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913',
			},
			action: 'update',
			triggerData: {
				executionLTV: '7721',
				token: '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913',
			},
		},
		remove: {
			dpm: '0xb3287c2890ed7ea99cb4d5d899434bb64997a609',
			protocol: 'aavev3',
			position: {
				collateral: '0x4200000000000000000000000000000000000006',
				debt: '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913',
			},
			action: 'remove',
			triggerData: {
				executionLTV: '7855',
				token: '0x4200000000000000000000000000000000000006',
			},
		},
	},
	trailingStopLoss: {
		closeToDebt: {
			dpm: '0xf71da0973121d949e1cee818eb519ba364406309',
			protocol: 'aavev3',
			position: {
				collateral: '0x4200000000000000000000000000000000000006',
				debt: '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913',
			},
			action: 'add',
			triggerData: {
				trailingDistance: '21000000000',
				token: '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913',
			},
		},
		updateCloseToCollateral: {
			dpm: '0xe70c8069627a9c7933362e25f033ec0771f0f06e',
			protocol: 'aavev3',
			position: {
				collateral: '0x4200000000000000000000000000000000000006',
				debt: '0xd9aaec86b65d86f6a7b5b1b0c42ffa531710b6ca',
			},
			action: 'update',
			triggerData: {
				trailingDistance: '152000000000',
				token: '0x4200000000000000000000000000000000000006',
			},
		},
		updateCloseToDebt: {
			dpm: '0xae294a81d5015d8de3ec55973f207857bd6b1fb4',
			protocol: 'aavev3',
			position: {
				collateral: '0x4200000000000000000000000000000000000006',
				debt: '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913',
			},
			action: 'update',
			triggerData: {
				trailingDistance: '144000000000',
				token: '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913',
			},
		},
		remove: {
			dpm: '0xe70c8069627a9c7933362e25f033ec0771f0f06e',
			protocol: 'aavev3',
			position: {
				collateral: '0x4200000000000000000000000000000000000006',
				debt: '0xd9aaec86b65d86f6a7b5b1b0c42ffa531710b6ca',
			},
			action: 'remove',
			triggerData: {
				trailingDistance: '15200000000000000000',
				token: '0x4200000000000000000000000000000000000006',
			},
		},
	},
	autoTakeProfit: {
		profitInDebt: {
			dpm: '0xf71da0973121d949e1cee818eb519ba364406309',
			protocol: 'aavev3',
			position: {
				collateral: '0x4200000000000000000000000000000000000006',
				debt: '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913',
			},
			action: 'add',
			triggerData: {
				executionLTV: '1500',
				executionPrice: '0',
				stopLoss: {
					triggerData: {
						executionLTV: '7890',
						token: '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913',
					},
					action: 'add',
				},
				withdrawToken: '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913',
				withdrawStep: '500',
			},
		},
		updateProfitInCollateral: {
			dpm: '0xb3287c2890ed7ea99cb4d5d899434bb64997a609',
			protocol: 'aavev3',
			position: {
				collateral: '0x4200000000000000000000000000000000000006',
				debt: '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913',
			},
			action: 'update',
			triggerData: {
				executionLTV: '2000',
				executionPrice: '600000000000',
				stopLoss: {
					triggerData: {
						executionLTV: '7855',
						token: '0x4200000000000000000000000000000000000006',
					},
					action: 'update',
				},
				withdrawToken: '0x4200000000000000000000000000000000000006',
				withdrawStep: '500',
			},
		},
		updateProfitInDebt: {
			dpm: '0x20e74013d82fea853afca3b4cb1fd9c2b105f55a',
			protocol: 'aavev3',
			position: {
				collateral: '0x4200000000000000000000000000000000000006',
				debt: '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913',
			},
			action: 'update',
			triggerData: {
				executionLTV: '700',
				executionPrice: '600000000000',
				stopLoss: {
					triggerData: {
						executionLTV: '7721',
						token: '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913',
					},
					action: 'update',
				},
				withdrawToken: '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913',
				withdrawStep: '500',
			},
		},
		remove: {
			dpm: '0xb3287c2890ed7ea99cb4d5d899434bb64997a609',
			protocol: 'aavev3',
			position: {
				collateral: '0x4200000000000000000000000000000000000006',
				debt: '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913',
			},
			action: 'remove',
			triggerData: {
				executionLTV: '5400',
				executionPrice: '600000000000',
				withdrawToken: '0x4200000000000000000000000000000000000006',
				withdrawStep: '5900',
			},
		},
	},
};

export const validPayloadsAaveV3Optimism = {
	autoBuy: {
		addWithoutMaxBuyPrice: {
			dpm: '0x2047e97451955c98bf8378f6ac2f04d95578990c',
			protocol: 'aavev3',
			position: {
				collateral: '0x4200000000000000000000000000000000000006',
				debt: '0x7f5c764cbc14f9669b88837ca1490cca17c31607',
			},
			action: 'add',
			triggerData: {
				executionLTV: '1500',
				maxBaseFee: '300',
				targetLTV: '3900',
				useMaxBuyPrice: false,
			},
		},
		updateMaxBuyPrice: {
			dpm: '0x171e21cb42c071e6f2b11a60a8041a8a3c1818ba',
			protocol: 'aavev3',
			position: {
				collateral: '0x68f180fcce6836688e9084f035309e29bf0a2095',
				debt: '0x7f5c764cbc14f9669b88837ca1490cca17c31607',
			},
			action: 'update',
			triggerData: {
				executionLTV: '1100',
				maxBaseFee: '300',
				maxBuyPrice: '20000000000000',
				targetLTV: '1600',
				useMaxBuyPrice: true,
			},
		},
		remove: {
			dpm: '0x171e21cb42c071e6f2b11a60a8041a8a3c1818ba',
			protocol: 'aavev3',
			position: {
				collateral: '0x68f180fcce6836688e9084f035309e29bf0a2095',
				debt: '0x7f5c764cbc14f9669b88837ca1490cca17c31607',
			},
			action: 'remove',
			triggerData: {
				executionLTV: '11',
				maxBaseFee: '300',
				targetLTV: '16',
				useMaxBuyPrice: false,
			},
		},
	},
	autoSell: {
		addWithoutMinSellPrice: {
			dpm: '0x2047e97451955c98bf8378f6ac2f04d95578990c',
			protocol: 'aavev3',
			position: {
				collateral: '0x4200000000000000000000000000000000000006',
				debt: '0x7f5c764cbc14f9669b88837ca1490cca17c31607',
			},
			action: 'add',
			triggerData: {
				executionLTV: '6500',
				maxBaseFee: '300',
				targetLTV: '3900',
				useMinSellPrice: false,
			},
		},
		updateMinSellPrice: {
			dpm: '0x429fd4661fe20ad9bade4efdf93e81f1c8560768',
			protocol: 'aavev3',
			position: {
				collateral: '0x4200000000000000000000000000000000000006',
				debt: '0xda10009cbd5d07dd0cecc66161fc93d7c9000da1',
			},
			action: 'update',
			triggerData: {
				executionLTV: '6000',
				maxBaseFee: '300',
				minSellPrice: '55000000000',
				targetLTV: '5500',
				useMinSellPrice: true,
			},
		},
		remove: {
			dpm: '0x429fd4661fe20ad9bade4efdf93e81f1c8560768',
			protocol: 'aavev3',
			position: {
				collateral: '0x4200000000000000000000000000000000000006',
				debt: '0xda10009cbd5d07dd0cecc66161fc93d7c9000da1',
			},
			action: 'remove',
			triggerData: {
				executionLTV: '60',
				maxBaseFee: '300',
				minSellPrice: '50000000000',
				targetLTV: '55',
				useMinSellPrice: false,
			},
		},
	},
	stopLoss: {
		closeToDebt: {
			dpm: '0x2047e97451955c98bf8378f6ac2f04d95578990c',
			protocol: 'aavev3',
			position: {
				collateral: '0x4200000000000000000000000000000000000006',
				debt: '0x7f5c764cbc14f9669b88837ca1490cca17c31607',
			},
			action: 'add',
			triggerData: {
				executionLTV: '7890',
				token: '0x7f5c764cbc14f9669b88837ca1490cca17c31607',
			},
		},
		updateCloseToCollateral: {
			dpm: '0xc4cff680a409ebbd1a73a57f1fac92065e2262d8',
			protocol: 'aavev3',
			position: {
				collateral: '0x4200000000000000000000000000000000000006',
				debt: '0x0b2c639c533813f4aa9d7837caf62653d097ff85',
			},
			action: 'update',
			triggerData: {
				executionLTV: '7887',
				token: '0x4200000000000000000000000000000000000006',
			},
		},
		updateCloseToDebt: {
			dpm: '0xdfbeb6d4e160aafa441690f11a5f2257021882b1',
			protocol: 'aavev3',
			position: {
				collateral: '0x4200000000000000000000000000000000000006',
				debt: '0xda10009cbd5d07dd0cecc66161fc93d7c9000da1',
			},
			action: 'update',
			triggerData: {
				executionLTV: '7801',
				token: '0xda10009cbd5d07dd0cecc66161fc93d7c9000da1',
			},
		},
		remove: {
			dpm: '0xc4cff680a409ebbd1a73a57f1fac92065e2262d8',
			protocol: 'aavev3',
			position: {
				collateral: '0x4200000000000000000000000000000000000006',
				debt: '0x0b2c639c533813f4aa9d7837caf62653d097ff85',
			},
			action: 'remove',
			triggerData: {
				executionLTV: '7887',
				token: '0x4200000000000000000000000000000000000006',
			},
		},
	},
	trailingStopLoss: {
		closeToDebt: {
			dpm: '0x2047e97451955c98bf8378f6ac2f04d95578990c',
			protocol: 'aavev3',
			position: {
				collateral: '0x4200000000000000000000000000000000000006',
				debt: '0x7f5c764cbc14f9669b88837ca1490cca17c31607',
			},
			action: 'add',
			triggerData: {
				trailingDistance: '26000000000',
				token: '0x7f5c764cbc14f9669b88837ca1490cca17c31607',
			},
		},
		updateCloseToCollateral: {
			dpm: '0xc213d697c81e15a2422701c653dc4b9bcad47530',
			protocol: 'aavev3',
			position: {
				collateral: '0x4200000000000000000000000000000000000006',
				debt: '0x0b2c639c533813f4aa9d7837caf62653d097ff85',
			},
			action: 'update',
			triggerData: {
				trailingDistance: '151000000000',
				token: '0x4200000000000000000000000000000000000006',
			},
		},
		updateCloseToDebt: {
			dpm: '0x6e0482bd337eb03d62ed71112814b424b309104f',
			protocol: 'aavev3',
			position: {
				collateral: '0x4200000000000000000000000000000000000006',
				debt: '0xda10009cbd5d07dd0cecc66161fc93d7c9000da1',
			},
			action: 'update',
			triggerData: {
				trailingDistance: '120000000000',
				token: '0xda10009cbd5d07dd0cecc66161fc93d7c9000da1',
			},
		},
		remove: {
			dpm: '0xc213d697c81e15a2422701c653dc4b9bcad47530',
			protocol: 'aavev3',
			position: {
				collateral: '0x4200000000000000000000000000000000000006',
				debt: '0x0b2c639c533813f4aa9d7837caf62653d097ff85',
			},
			action: 'remove',
			triggerData: {
				trailingDistance: '15100000000000000000',
				token: '0x4200000000000000000000000000000000000006',
			},
		},
	},
	autoTakeProfit: {
		profitInDebt: {
			dpm: '0x2047e97451955c98bf8378f6ac2f04d95578990c',
			protocol: 'aavev3',
			position: {
				collateral: '0x4200000000000000000000000000000000000006',
				debt: '0x7f5c764cbc14f9669b88837ca1490cca17c31607',
			},
			action: 'add',
			triggerData: {
				executionLTV: '1800',
				executionPrice: '0',
				stopLoss: {
					triggerData: {
						executionLTV: '7890',
						token: '0x7f5c764cbc14f9669b88837ca1490cca17c31607',
					},
					action: 'add',
				},
				withdrawToken: '0x7f5c764cbc14f9669b88837ca1490cca17c31607',
				withdrawStep: '500',
			},
		},
		updateProfitInCollateral: {
			dpm: '0xc4cff680a409ebbd1a73a57f1fac92065e2262d8',
			protocol: 'aavev3',
			position: {
				collateral: '0x4200000000000000000000000000000000000006',
				debt: '0x0b2c639c533813f4aa9d7837caf62653d097ff85',
			},
			action: 'update',
			triggerData: {
				executionLTV: '800',
				executionPrice: '860000000000',
				stopLoss: {
					triggerData: {
						executionLTV: '7887',
						token: '0x4200000000000000000000000000000000000006',
					},
					action: 'update',
				},
				withdrawToken: '0x4200000000000000000000000000000000000006',
				withdrawStep: '500',
			},
		},
		updateProfitInDebt: {
			dpm: '0xdfbeb6d4e160aafa441690f11a5f2257021882b1',
			protocol: 'aavev3',
			position: {
				collateral: '0x4200000000000000000000000000000000000006',
				debt: '0xda10009cbd5d07dd0cecc66161fc93d7c9000da1',
			},
			action: 'update',
			triggerData: {
				executionLTV: '800',
				executionPrice: '700000000000',
				stopLoss: {
					triggerData: {
						executionLTV: '7801',
						token: '0xda10009cbd5d07dd0cecc66161fc93d7c9000da1',
					},
					action: 'update',
				},
				withdrawToken: '0xda10009cbd5d07dd0cecc66161fc93d7c9000da1',
				withdrawStep: '500',
			},
		},
		remove: {
			dpm: '0xc4cff680a409ebbd1a73a57f1fac92065e2262d8',
			protocol: 'aavev3',
			position: {
				collateral: '0x4200000000000000000000000000000000000006',
				debt: '0x0b2c639c533813f4aa9d7837caf62653d097ff85',
			},
			action: 'remove',
			triggerData: {
				executionLTV: '800',
				executionPrice: '860000000000',
				withdrawToken: '0x4200000000000000000000000000000000000006',
				withdrawStep: '1300',
			},
		},
	},
};
