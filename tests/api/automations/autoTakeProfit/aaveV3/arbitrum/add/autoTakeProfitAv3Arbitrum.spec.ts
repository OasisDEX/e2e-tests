import { expect, test } from '@playwright/test';
import {
	validPayloadsAaveV3Arbitrum,
	responses,
	autoTakeProfitResponse,
} from 'utils/testData_APIs';

const autoTakeProfit = '/api/triggers/42161/aave3/dma-partial-take-profit';

const validPayloads = validPayloadsAaveV3Arbitrum;

const validResponse = autoTakeProfitResponse({
	dpm: '0xF0464Ef55705e5B5cb3b865d92BE5341fe85fBB8',
	collateral: {
		decimals: 18,
		symbol: 'WETH',
		address: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1',
	},
	debt: {
		decimals: 18,
		symbol: 'DAI',
		address: '0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1',
	},
});

test.describe('API tests - Auto Take Profit - Aave V3 - Arbitrum', async () => {
	// Old test wallet: 0x10649c79428d718621821Cf6299e91920284743F
	// Position link: https://staging.summer.fi/arbitrum/aave/v3/multiply/ETH-DAI/1

	test('Add automation - Close to debt - Valid payload data', async ({ request }) => {
		const response = await request.post(autoTakeProfit, {
			data: validPayloads.autoTakeProfit.closeToDebt,
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(validResponse);
	});

	test('Add automation - Close to collateral - Valid payload data', async ({ request }) => {
		const response = await request.post(autoTakeProfit, {
			data: {
				...validPayloads.autoTakeProfit.closeToDebt,
				stopLoss: {
					...validPayloads.autoTakeProfit.closeToDebt.triggerData.stopLoss,
					triggerData: {
						...validPayloads.autoTakeProfit.closeToDebt.triggerData.stopLoss.triggerData,
						token: '0x82af49447d8a07e3bd95bd0d56f35241523fbab1',
					},
				},
				triggerData: {
					...validPayloads.autoTakeProfit.closeToDebt.triggerData,
					withdrawToken: '0x82af49447d8a07e3bd95bd0d56f35241523fbab1',
				},
			},
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(validResponse);
	});

	test('Add automation - Without "dpm"', async ({ request }) => {
		const { dpm, ...payloadWithoutDpm } = validPayloads.autoTakeProfit.closeToDebt;

		const response = await request.post(autoTakeProfit, {
			data: payloadWithoutDpm,
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongDpm);
	});

	test('Add automation - Wrong data type - "dpm"', async ({ request }) => {
		const response = await request.post(autoTakeProfit, {
			data: { ...validPayloads.autoTakeProfit.closeToDebt, dpm: 1 },
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongDpm);
	});

	test('Add automation - Wrong value - "dpm"', async ({ request }) => {
		const response = await request.post(autoTakeProfit, {
			data: { ...validPayloads.autoTakeProfit.closeToDebt, dpm: '0xwrong' },
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongDpm);
	});

	test('Add automation - Without "position"', async ({ request }) => {
		const { position, ...payloadWithoutPosition } = validPayloads.autoTakeProfit.closeToDebt;

		const response = await request.post(autoTakeProfit, {
			data: payloadWithoutPosition,
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.missingPosition);
	});

	test('Add automation - Wrong data type - "position" - string', async ({ request }) => {
		const response = await request.post(autoTakeProfit, {
			data: { ...validPayloads.autoTakeProfit.closeToDebt, position: 'string' },
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongPosition_string);
	});

	test('Add automation - Wrong data type - "position" - number', async ({ request }) => {
		const response = await request.post(autoTakeProfit, {
			data: { ...validPayloads.autoTakeProfit.closeToDebt, position: 1 },
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongPosition_number);
	});

	test('Add automation - Wrong data type - "position" - array', async ({ request }) => {
		const response = await request.post(autoTakeProfit, {
			data: { ...validPayloads.autoTakeProfit.closeToDebt, position: [] },
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongPosition_array);
	});

	test('Add automation - Wrong data type - "position" - null', async ({ request }) => {
		const response = await request.post(autoTakeProfit, {
			data: { ...validPayloads.autoTakeProfit.closeToDebt, position: null },
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongPosition_null);
	});

	test('Add automation - Without "collateral (position)"', async ({ request }) => {
		const { position, ...payloadWithoutPosition } = validPayloads.autoTakeProfit.closeToDebt;
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
				...validPayloads.autoTakeProfit.closeToDebt,
				position: {
					...validPayloads.autoTakeProfit.closeToDebt.position,
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
				...validPayloads.autoTakeProfit.closeToDebt,
				position: {
					...validPayloads.autoTakeProfit.closeToDebt.position,
					collateral: '0xwrong',
				},
			},
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongCollateral);
	});

	test('Add automation - Without "debt (position)"', async ({ request }) => {
		const { position, ...payloadWithoutPosition } = validPayloads.autoTakeProfit.closeToDebt;
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
				...validPayloads.autoTakeProfit.closeToDebt,
				position: { ...validPayloads.autoTakeProfit.closeToDebt.position, debt: 11 },
			},
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongDebt);
	});

	test('Add automation - Wrong value - "debt (position)"', async ({ request }) => {
		const response = await request.post(autoTakeProfit, {
			data: {
				...validPayloads.autoTakeProfit.closeToDebt,
				position: {
					...validPayloads.autoTakeProfit.closeToDebt.position,
					debt: '0xwrong',
				},
			},
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongDebt);
	});

	test('Add automation - Without "triggerData"', async ({ request }) => {
		const { triggerData, ...payloadWithoutTriggerData } = validPayloads.autoTakeProfit.closeToDebt;

		const response = await request.post(autoTakeProfit, {
			data: payloadWithoutTriggerData,
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.missingTriggerData);
	});

	test('Add automation - Wrong data type - "triggerData" - string', async ({ request }) => {
		const response = await request.post(autoTakeProfit, {
			data: { ...validPayloads.autoTakeProfit.closeToDebt, triggerData: 'string' },
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongTriggerData_string);
	});

	test('Add automation - Wrong data type - "triggerData" - number', async ({ request }) => {
		const response = await request.post(autoTakeProfit, {
			data: { ...validPayloads.autoTakeProfit.closeToDebt, triggerData: 1 },
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongTriggerData_number);
	});

	test('Add automation - Wrong data type - "triggerData" - array', async ({ request }) => {
		const response = await request.post(autoTakeProfit, {
			data: { ...validPayloads.autoTakeProfit.closeToDebt, triggerData: [] },
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongTriggerData_array);
	});

	test('Add automation - Wrong data type - "triggerData" - null', async ({ request }) => {
		const response = await request.post(autoTakeProfit, {
			data: { ...validPayloads.autoTakeProfit.closeToDebt, triggerData: null },
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongTriggerData_null);
	});

	test('Add automation - Without "executionLTV (triggerData)"', async ({ request }) => {
		const { triggerData, ...payloadWithoutTriggerData } = validPayloads.autoTakeProfit.closeToDebt;
		const { executionLTV, ...triggerDataWithoutExecutionLTV } = triggerData;

		const response = await request.post(autoTakeProfit, {
			data: { ...payloadWithoutTriggerData, triggerData: triggerDataWithoutExecutionLTV },
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongExecutionLTV);
	});

	test('Add automation - Without "executionPrice (triggerData)"', async ({ request }) => {
		const { triggerData, ...payloadWithoutTriggerData } = validPayloads.autoTakeProfit.closeToDebt;
		const { executionPrice, ...triggerDataWithoutExecutionPrice } = triggerData;

		const response = await request.post(autoTakeProfit, {
			data: { ...payloadWithoutTriggerData, triggerData: triggerDataWithoutExecutionPrice },
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongExecutionPrice);
	});

	test('Add automation - Without "withdrawToken (triggerData)"', async ({ request }) => {
		const { triggerData, ...payloadWithoutTriggerData } = validPayloads.autoTakeProfit.closeToDebt;
		const { withdrawToken, ...triggerDataWithoutWithdrawToken } = triggerData;

		const response = await request.post(autoTakeProfit, {
			data: { ...payloadWithoutTriggerData, triggerData: triggerDataWithoutWithdrawToken },
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongWithdrawToken);
	});

	test('Add automation - Without "withdrawStep (triggerData)"', async ({ request }) => {
		const { triggerData, ...payloadWithoutTriggerData } = validPayloads.autoTakeProfit.closeToDebt;
		const { withdrawStep, ...triggerDataWithoutWithdrawStep } = triggerData;

		const response = await request.post(autoTakeProfit, {
			data: { ...payloadWithoutTriggerData, triggerData: triggerDataWithoutWithdrawStep },
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongWithdrawStep);
	});

	test('Add automation - Without "stopLoss > triggerData (triggerData)"', async ({ request }) => {
		const { triggerData, ...payloadWithoutTriggerData } = validPayloads.autoTakeProfit.closeToDebt;
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

	// TO BE DONE - More negative scenarios for missing attribues in 'triggerData > StopLoss'
});
