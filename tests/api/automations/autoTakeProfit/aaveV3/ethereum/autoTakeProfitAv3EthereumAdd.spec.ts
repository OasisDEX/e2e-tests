import { expect, test } from '@playwright/test';
import {
	validPayloadsAaveV3Ethereum,
	responses,
	autoTakeProfitResponse,
} from 'utils/testData_APIs';

const autoTakeProfit = '/api/triggers/1/aave3/dma-partial-take-profit';

const validPayloads = validPayloadsAaveV3Ethereum.autoTakeProfit.profitInDebt;

const validResponse = autoTakeProfitResponse({
	dpm: '0x16F2C35E062C14F57475dE0A466F7E08b03A9C7D',
	collateral: {
		decimals: 18,
		symbol: 'WETH',
		address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
	},
	debt: {
		decimals: 6,
		symbol: 'USDC',
		address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
	},
});

test.describe('API tests - Auto Take Profit - Add - Aave V3 - Ethereum @regression', async () => {
	// Old test wallet: 0x10649c79428d718621821Cf6299e91920284743F
	// Position link: https://staging.summer.fi/ethereum/aave/v3/multiply/ETH-USDC/1218

	test('Add automation - Close to debt - Valid payload data', async ({ request }) => {
		const response = await request.post(autoTakeProfit, {
			data: validPayloads,
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(validResponse);
	});

	test('Add automation - Close to collateral - Valid payload data', async ({ request }) => {
		const response = await request.post(autoTakeProfit, {
			data: {
				...validPayloads,
				stopLoss: {
					...validPayloads.triggerData.stopLoss,
					triggerData: {
						...validPayloads.triggerData.stopLoss.triggerData,
						token: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
					},
				},
				triggerData: {
					...validPayloads.triggerData,
					withdrawToken: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
				},
			},
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(validResponse);
	});

	test('Add automation - Without "dpm"', async ({ request }) => {
		const { dpm, ...payloadWithoutDpm } = validPayloads;

		const response = await request.post(autoTakeProfit, {
			data: payloadWithoutDpm,
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongDpm);
	});

	test('Add automation - Wrong data type - "dpm"', async ({ request }) => {
		const response = await request.post(autoTakeProfit, {
			data: { ...validPayloads, dpm: 1 },
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongDpm);
	});

	test('Add automation - Wrong value - "dpm"', async ({ request }) => {
		const response = await request.post(autoTakeProfit, {
			data: { ...validPayloads, dpm: '0xwrong' },
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongDpm);
	});

	test('Add automation - Without "position"', async ({ request }) => {
		const { position, ...payloadWithoutPosition } = validPayloads;

		const response = await request.post(autoTakeProfit, {
			data: payloadWithoutPosition,
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.missingPosition);
	});

	test('Add automation - Wrong data type - "position" - string', async ({ request }) => {
		const response = await request.post(autoTakeProfit, {
			data: { ...validPayloads, position: 'string' },
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongPosition_string);
	});

	test('Add automation - Wrong data type - "position" - number', async ({ request }) => {
		const response = await request.post(autoTakeProfit, {
			data: { ...validPayloads, position: 1 },
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongPosition_number);
	});

	test('Add automation - Wrong data type - "position" - array', async ({ request }) => {
		const response = await request.post(autoTakeProfit, {
			data: { ...validPayloads, position: [] },
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongPosition_array);
	});

	test('Add automation - Wrong data type - "position" - null', async ({ request }) => {
		const response = await request.post(autoTakeProfit, {
			data: { ...validPayloads, position: null },
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongPosition_null);
	});

	test('Add automation - Without "collateral (position)"', async ({ request }) => {
		const { position, ...payloadWithoutPosition } = validPayloads;
		const { collateral, ...positionWithoutCollateral } = position;

		const response = await request.post(autoTakeProfit, {
			data: { ...payloadWithoutPosition, position: positionWithoutCollateral },
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongCollateral);
	});

	test('Add automation - Wrong data type - "collateral (position)"', async ({ request }) => {
		const response = await request.post(autoTakeProfit, {
			data: {
				...validPayloads,
				position: {
					...validPayloads.position,
					collateral: 11,
				},
			},
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongCollateral);
	});

	test('Add automation - Wrong value - "collateral (position)"', async ({ request }) => {
		const response = await request.post(autoTakeProfit, {
			data: {
				...validPayloads,
				position: {
					...validPayloads.position,
					collateral: '0xwrong',
				},
			},
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongCollateral);
	});

	test('Add automation - Without "debt (position)"', async ({ request }) => {
		const { position, ...payloadWithoutPosition } = validPayloads;
		const { debt, ...positionWithoutDebt } = position;

		const response = await request.post(autoTakeProfit, {
			data: { ...payloadWithoutPosition, position: positionWithoutDebt },
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongDebt);
	});

	test('Add automation - Wrong data type - "debt (position)"', async ({ request }) => {
		const response = await request.post(autoTakeProfit, {
			data: {
				...validPayloads,
				position: { ...validPayloads.position, debt: 11 },
			},
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongDebt);
	});

	test('Add automation - Wrong value - "debt (position)"', async ({ request }) => {
		const response = await request.post(autoTakeProfit, {
			data: {
				...validPayloads,
				position: {
					...validPayloads.position,
					debt: '0xwrong',
				},
			},
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongDebt);
	});

	test('Add automation - Without "triggerData"', async ({ request }) => {
		const { triggerData, ...payloadWithoutTriggerData } = validPayloads;

		const response = await request.post(autoTakeProfit, {
			data: payloadWithoutTriggerData,
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.missingTriggerData);
	});

	test('Add automation - Wrong data type - "triggerData" - string', async ({ request }) => {
		const response = await request.post(autoTakeProfit, {
			data: { ...validPayloads, triggerData: 'string' },
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongTriggerData_string);
	});

	test('Add automation - Wrong data type - "triggerData" - number', async ({ request }) => {
		const response = await request.post(autoTakeProfit, {
			data: { ...validPayloads, triggerData: 1 },
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongTriggerData_number);
	});

	test('Add automation - Wrong data type - "triggerData" - array', async ({ request }) => {
		const response = await request.post(autoTakeProfit, {
			data: { ...validPayloads, triggerData: [] },
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongTriggerData_array);
	});

	test('Add automation - Wrong data type - "triggerData" - null', async ({ request }) => {
		const response = await request.post(autoTakeProfit, {
			data: { ...validPayloads, triggerData: null },
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongTriggerData_null);
	});

	test('Add automation - Without "executionLTV (triggerData)"', async ({ request }) => {
		const { triggerData, ...payloadWithoutTriggerData } = validPayloads;
		const { executionLTV, ...triggerDataWithoutExecutionLTV } = triggerData;

		const response = await request.post(autoTakeProfit, {
			data: { ...payloadWithoutTriggerData, triggerData: triggerDataWithoutExecutionLTV },
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongExecutionLTV);
	});

	test('Add automation - Without "executionPrice (triggerData)"', async ({ request }) => {
		const { triggerData, ...payloadWithoutTriggerData } = validPayloads;
		const { executionPrice, ...triggerDataWithoutExecutionPrice } = triggerData;

		const response = await request.post(autoTakeProfit, {
			data: { ...payloadWithoutTriggerData, triggerData: triggerDataWithoutExecutionPrice },
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongExecutionPrice);
	});

	test('Add automation - Without "withdrawToken (triggerData)"', async ({ request }) => {
		const { triggerData, ...payloadWithoutTriggerData } = validPayloads;
		const { withdrawToken, ...triggerDataWithoutWithdrawToken } = triggerData;

		const response = await request.post(autoTakeProfit, {
			data: { ...payloadWithoutTriggerData, triggerData: triggerDataWithoutWithdrawToken },
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongWithdrawToken);
	});

	test('Add automation - Without "withdrawStep (triggerData)"', async ({ request }) => {
		const { triggerData, ...payloadWithoutTriggerData } = validPayloads;
		const { withdrawStep, ...triggerDataWithoutWithdrawStep } = triggerData;

		const response = await request.post(autoTakeProfit, {
			data: { ...payloadWithoutTriggerData, triggerData: triggerDataWithoutWithdrawStep },
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongWithdrawStep);
	});

	test('Add automation - Without "stopLoss > triggerData (triggerData)"', async ({ request }) => {
		const { triggerData, ...payloadWithoutTriggerData } = validPayloads;
		const { stopLoss, ...triggerDataWithoutStopLoss } = triggerData;
		const { triggerData: stopLossTriggerData, ...triggerDataStopLossWithoutTriggerData } = stopLoss;

		const response = await request.post(autoTakeProfit, {
			data: {
				...payloadWithoutTriggerData,
				triggerData: {
					...triggerDataWithoutStopLoss,
					stopLoss: triggerDataStopLossWithoutTriggerData,
				},
			},
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongStopLossTriggerData);
	});

	test('Add automation - Trigger already exists', async ({ request }) => {
		const response = await request.post(autoTakeProfit, {
			data: {
				...validPayloadsAaveV3Ethereum.autoTakeProfit.updateProfitInCollateral,
				action: 'add',
			},
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.autoTakeProfitAlreadyExists);
	});

	// TO BE DONE - More negative scenarios for missing attribues in 'triggerData > StopLoss'
});
