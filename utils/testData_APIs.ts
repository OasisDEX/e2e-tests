import { expect } from '#noWalletFixtures';

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
	debt: { decimals: number; symbol: string; address: string; oraclesAddress: string };
	hasStablecoinDebt: boolean;
}) => {
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
					id: debt.address.toLocaleLowerCase(),
					symbol: debt.symbol,
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
				executionLTV: '3200',
				maxBaseFee: '300',
				targetLTV: '5000',
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
				executionLTV: '4600',
				maxBaseFee: '300',
				targetLTV: '3800',
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
	},
	autoTakeProfit: {
		closeToDebt: {
			dpm: '0x16f2c35e062c14f57475de0a466f7e08b03a9c7d',
			protocol: 'aavev3',
			position: {
				collateral: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
				debt: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
			},
			action: 'add',
			triggerData: {
				executionLTV: '3200',
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
	},
	trailingStopLoss: {
		closeToDebt: {
			dpm: '0x2e0515d7a3ea0276f28c94c426c5d2d1d85fd4d5',
			protocol: 'morphoblue',
			position: {
				collateral: '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599',
				debt: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
			},
			action: 'add',
			triggerData: {
				trailingDistance: '120000000000',
				poolId: '0x3a85e619751152991742810df6ec69ce473daef99e28a64ab2340d7b7ccfee49',
				token: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
			},
		},
	},
	autoTakeProfit: {
		closeToDebt: {
			dpm: '0x2e0515d7a3ea0276f28c94c426c5d2d1d85fd4d5',
			protocol: 'morphoblue',
			position: {
				collateral: '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599',
				debt: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
			},
			action: 'add',
			triggerData: {
				executionLTV: '5700',
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
	},
	autoTakeProfit: {
		closeToDebt: {
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
				executionLTV: '4900',
				maxBaseFee: '300',
				targetLTV: '5800',
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
				executionLTV: '6200',
				maxBaseFee: '300',
				targetLTV: '5700',
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
	},
	autoTakeProfit: {
		closeToDebt: {
			dpm: '0xf0464ef55705e5b5cb3b865d92be5341fe85fbb8',
			protocol: 'aavev3',
			position: {
				collateral: '0x82af49447d8a07e3bd95bd0d56f35241523fbab1',
				debt: '0xda10009cbd5d07dd0cecc66161fc93d7c9000da1',
			},
			action: 'add',
			triggerData: {
				executionLTV: '5300',
				executionPrice: '0',
				stopLoss: {
					triggerData: {
						executionLTV: '8140',
						token: '0xda10009cbd5d07dd0cecc66161fc93d7c9000da1',
					},
					action: 'add',
				},
				withdrawToken: '0xda10009cbd5d07dd0cecc66161fc93d7c9000da1',
				withdrawStep: '500',
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
				executionLTV: '2800',
				maxBaseFee: '300',
				targetLTV: '3300',
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
				executionLTV: '3800',
				maxBaseFee: '300',
				targetLTV: '3300',
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
	},
	autoTakeProfit: {
		closeToDebt: {
			dpm: '0xf71da0973121d949e1cee818eb519ba364406309',
			protocol: 'aavev3',
			position: {
				collateral: '0x4200000000000000000000000000000000000006',
				debt: '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913',
			},
			action: 'add',
			triggerData: {
				executionLTV: '2800',
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
				executionLTV: '3100',
				maxBaseFee: '300',
				targetLTV: '3900',
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
				executionLTV: '4400',
				maxBaseFee: '300',
				targetLTV: '3900',
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
	},
	autoTakeProfit: {
		closeToDebt: {
			dpm: '0x2047e97451955c98bf8378f6ac2f04d95578990c',
			protocol: 'aavev3',
			position: {
				collateral: '0x4200000000000000000000000000000000000006',
				debt: '0x7f5c764cbc14f9669b88837ca1490cca17c31607',
			},
			action: 'add',
			triggerData: {
				executionLTV: '3500',
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
	},
};
