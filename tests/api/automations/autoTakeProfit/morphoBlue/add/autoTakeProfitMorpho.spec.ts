import { expect, test } from '@playwright/test';
import { validPayloadsMorpho, responses } from 'utils/testData_APIs';

const autoTakeProfit = '/api/triggers/1/morphoblue/dma-partial-take-profit';

test.describe('API tests - Auto Take Profit - Aave V3 - Ethereum', async () => {
	// Old test wallet: 0x10649c79428d718621821Cf6299e91920284743F
	// Position link: https://staging.summer.fi/ethereum/morphoblue/borrow/WBTC-USDC/2545

	test('Add automation - Close to debt - Valid payload data', async ({ request }) => {
		const response = await request.post(autoTakeProfit, {
			data: validPayloadsMorpho.autoTakeProfit.closeToDebt,
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.autoTakeProfitMorpho);
	});

	test('Add automation - Close to collateral - Valid payload data', async ({ request }) => {
		const response = await request.post(autoTakeProfit, {
			data: {
				...validPayloadsMorpho.autoTakeProfit.closeToDebt,
				stopLoss: {
					...validPayloadsMorpho.autoTakeProfit.closeToDebt.triggerData.stopLoss,
					triggerData: {
						...validPayloadsMorpho.autoTakeProfit.closeToDebt.triggerData.stopLoss.triggerData,
						token: '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599',
					},
				},
				triggerData: {
					...validPayloadsMorpho.autoTakeProfit.closeToDebt.triggerData,
					withdrawToken: '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599',
				},
			},
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.autoTakeProfitMorpho);
	});

	test('Add automation - Without "dpm"', async ({ request }) => {
		const { dpm, ...payloadWithoutDpm } = validPayloadsMorpho.autoTakeProfit.closeToDebt;

		const response = await request.post(autoTakeProfit, {
			data: payloadWithoutDpm,
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongDpm);
	});

	test('Add automation - Wrong data type - "dpm"', async ({ request }) => {
		const response = await request.post(autoTakeProfit, {
			data: { ...validPayloadsMorpho.autoTakeProfit.closeToDebt, dpm: 1 },
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongDpm);
	});

	test('Add automation - Wrong value - "dpm"', async ({ request }) => {
		const response = await request.post(autoTakeProfit, {
			data: { ...validPayloadsMorpho.autoTakeProfit.closeToDebt, dpm: '0xwrong' },
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongDpm);
	});

	test('Add automation - Without "position"', async ({ request }) => {
		const { position, ...payloadWithoutPosition } = validPayloadsMorpho.autoTakeProfit.closeToDebt;

		const response = await request.post(autoTakeProfit, {
			data: payloadWithoutPosition,
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.missingPosition);
	});

	test('Add automation - Wrong data type - "position" - string', async ({ request }) => {
		const response = await request.post(autoTakeProfit, {
			data: { ...validPayloadsMorpho.autoTakeProfit.closeToDebt, position: 'string' },
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongPosition_string);
	});

	test('Add automation - Wrong data type - "position" - number', async ({ request }) => {
		const response = await request.post(autoTakeProfit, {
			data: { ...validPayloadsMorpho.autoTakeProfit.closeToDebt, position: 1 },
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongPosition_number);
	});

	test('Add automation - Wrong data type - "position" - array', async ({ request }) => {
		const response = await request.post(autoTakeProfit, {
			data: { ...validPayloadsMorpho.autoTakeProfit.closeToDebt, position: [] },
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongPosition_array);
	});

	test('Add automation - Wrong data type - "position" - null', async ({ request }) => {
		const response = await request.post(autoTakeProfit, {
			data: { ...validPayloadsMorpho.autoTakeProfit.closeToDebt, position: null },
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongPosition_null);
	});

	test('Add automation - Without "collateral (position)"', async ({ request }) => {
		const { position, ...payloadWithoutPosition } = validPayloadsMorpho.autoTakeProfit.closeToDebt;
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
				...validPayloadsMorpho.autoTakeProfit.closeToDebt,
				position: {
					...validPayloadsMorpho.autoTakeProfit.closeToDebt.position,
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
				...validPayloadsMorpho.autoTakeProfit.closeToDebt,
				position: {
					...validPayloadsMorpho.autoTakeProfit.closeToDebt.position,
					collateral: '0xwrong',
				},
			},
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongCollateral);
	});

	test('Add automation - Without "debt (position)"', async ({ request }) => {
		const { position, ...payloadWithoutPosition } = validPayloadsMorpho.autoTakeProfit.closeToDebt;
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
				...validPayloadsMorpho.autoTakeProfit.closeToDebt,
				position: { ...validPayloadsMorpho.autoTakeProfit.closeToDebt.position, debt: 11 },
			},
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongDebt);
	});

	test('Add automation - Wrong value - "debt (position)"', async ({ request }) => {
		const response = await request.post(autoTakeProfit, {
			data: {
				...validPayloadsMorpho.autoTakeProfit.closeToDebt,
				position: {
					...validPayloadsMorpho.autoTakeProfit.closeToDebt.position,
					debt: '0xwrong',
				},
			},
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongDebt);
	});

	test('Add automation - Without "triggerData"', async ({ request }) => {
		const { triggerData, ...payloadWithoutTriggerData } =
			validPayloadsMorpho.autoTakeProfit.closeToDebt;

		const response = await request.post(autoTakeProfit, {
			data: payloadWithoutTriggerData,
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.missingTriggerData);
	});

	test('Add automation - Wrong data type - "triggerData" - string', async ({ request }) => {
		const response = await request.post(autoTakeProfit, {
			data: { ...validPayloadsMorpho.autoTakeProfit.closeToDebt, triggerData: 'string' },
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongTriggerData_string);
	});

	test('Add automation - Wrong data type - "triggerData" - number', async ({ request }) => {
		const response = await request.post(autoTakeProfit, {
			data: { ...validPayloadsMorpho.autoTakeProfit.closeToDebt, triggerData: 1 },
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongTriggerData_number);
	});

	test('Add automation - Wrong data type - "triggerData" - array', async ({ request }) => {
		const response = await request.post(autoTakeProfit, {
			data: { ...validPayloadsMorpho.autoTakeProfit.closeToDebt, triggerData: [] },
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongTriggerData_array);
	});

	test('Add automation - Wrong data type - "triggerData" - null', async ({ request }) => {
		const response = await request.post(autoTakeProfit, {
			data: { ...validPayloadsMorpho.autoTakeProfit.closeToDebt, triggerData: null },
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongTriggerData_null);
	});

	test('Add automation - Without "executionLTV (triggerData)"', async ({ request }) => {
		const { triggerData, ...payloadWithoutTriggerData } =
			validPayloadsMorpho.autoTakeProfit.closeToDebt;
		const { executionLTV, ...triggerDataWithoutExecutionLTV } = triggerData;

		const response = await request.post(autoTakeProfit, {
			data: { ...payloadWithoutTriggerData, triggerData: triggerDataWithoutExecutionLTV },
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongExecutionLTV);
	});

	test('Add automation - Without "executionPrice (triggerData)"', async ({ request }) => {
		const { triggerData, ...payloadWithoutTriggerData } =
			validPayloadsMorpho.autoTakeProfit.closeToDebt;
		const { executionPrice, ...triggerDataWithoutExecutionPrice } = triggerData;

		const response = await request.post(autoTakeProfit, {
			data: { ...payloadWithoutTriggerData, triggerData: triggerDataWithoutExecutionPrice },
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongExecutionPrice);
	});

	test('Add automation - Without "withdrawToken (triggerData)"', async ({ request }) => {
		const { triggerData, ...payloadWithoutTriggerData } =
			validPayloadsMorpho.autoTakeProfit.closeToDebt;
		const { withdrawToken, ...triggerDataWithoutWithdrawToken } = triggerData;

		const response = await request.post(autoTakeProfit, {
			data: { ...payloadWithoutTriggerData, triggerData: triggerDataWithoutWithdrawToken },
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongWithdrawToken);
	});

	test('Add automation - Without "withdrawStep (triggerData)"', async ({ request }) => {
		const { triggerData, ...payloadWithoutTriggerData } =
			validPayloadsMorpho.autoTakeProfit.closeToDebt;
		const { withdrawStep, ...triggerDataWithoutWithdrawStep } = triggerData;

		const response = await request.post(autoTakeProfit, {
			data: { ...payloadWithoutTriggerData, triggerData: triggerDataWithoutWithdrawStep },
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongWithdrawStep);
	});

	test('Add automation - Without "stopLoss > triggerData (triggerData)"', async ({ request }) => {
		const { triggerData, ...payloadWithoutTriggerData } =
			validPayloadsMorpho.autoTakeProfit.closeToDebt;
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

		expect(respJSON).toMatchObject(responses.wrongStopLossTriggerDataMorpho);
	});

	// TO BE DONE - More negative scenarios for missing attribues in 'triggerData > StopLoss'
});
