import { expect, test } from '@playwright/test';
import { validPayloadsAaveV3Base, responses } from 'utils/testData_APIs';

const stopLossEndpoint = '/api/triggers/8453/aave3/dma-stop-loss';
const validPayloads = validPayloadsAaveV3Base;

test.describe('API tests - Stop-Loss - Aave V3 - Base', async () => {
	// Old test wallet: 0x10649c79428d718621821Cf6299e91920284743F
	// Position link: https://staging.summer.fi/base/aave/v3/multiply/ETH-USDC/435

	test('Add automation - Close to debt - Valid payload data', async ({ request }) => {
		const response = await request.post(stopLossEndpoint, {
			data: validPayloads.stopLoss.closeToDebt,
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject({
			...responses.stopLoss,
			transaction: {
				...responses.stopLoss.transaction,
				to: '0xf71dA0973121d949E1CEe818eb519BA364406309',
			},
		});
	});

	test('Add automation - Close to collateral - Valid payload data', async ({ request }) => {
		const response = await request.post(stopLossEndpoint, {
			data: {
				...validPayloads.stopLoss.closeToDebt,
				triggerData: {
					...validPayloads.stopLoss.closeToDebt.triggerData,
					token: '0x4200000000000000000000000000000000000006',
				},
			},
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject({
			...responses.stopLoss,
			transaction: {
				...responses.stopLoss.transaction,
				to: '0xf71dA0973121d949E1CEe818eb519BA364406309',
			},
		});
	});

	test('Add automation - Without "dpm"', async ({ request }) => {
		const { dpm, ...payloadWithoutDpm } = validPayloads.stopLoss.closeToDebt;

		const response = await request.post(stopLossEndpoint, {
			data: payloadWithoutDpm,
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongDpm);
	});

	test('Add automation - Wrong data type - "dpm"', async ({ request }) => {
		const response = await request.post(stopLossEndpoint, {
			data: { ...validPayloads.stopLoss.closeToDebt, dpm: 1 },
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongDpm);
	});

	test('Add automation - Wrong value - "dpm"', async ({ request }) => {
		const response = await request.post(stopLossEndpoint, {
			data: { ...validPayloads.stopLoss.closeToDebt, dpm: '0xwrong' },
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongDpm);
	});

	test('Add automation - Without "position"', async ({ request }) => {
		const { position, ...payloadWithoutPosition } = validPayloads.stopLoss.closeToDebt;

		const response = await request.post(stopLossEndpoint, {
			data: payloadWithoutPosition,
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.missingPosition);
	});

	test('Add automation - Wrong data type - "position" - string', async ({ request }) => {
		const response = await request.post(stopLossEndpoint, {
			data: { ...validPayloads.stopLoss.closeToDebt, position: 'string' },
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongPosition_string);
	});

	test('Add automation - Wrong data type - "position" - number', async ({ request }) => {
		const response = await request.post(stopLossEndpoint, {
			data: { ...validPayloads.stopLoss.closeToDebt, position: 1 },
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongPosition_number);
	});

	test('Add automation - Wrong data type - "position" - array', async ({ request }) => {
		const response = await request.post(stopLossEndpoint, {
			data: { ...validPayloads.stopLoss.closeToDebt, position: [] },
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongPosition_array);
	});

	test('Add automation - Wrong data type - "position" - null', async ({ request }) => {
		const response = await request.post(stopLossEndpoint, {
			data: { ...validPayloads.stopLoss.closeToDebt, position: null },
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongPosition_null);
	});

	test('Add automation - Without "collateral (position)"', async ({ request }) => {
		const { position, ...payloadWithoutPosition } = validPayloads.stopLoss.closeToDebt;
		const { collateral, ...positionWithoutCollateral } = position;

		const response = await request.post(stopLossEndpoint, {
			data: { ...payloadWithoutPosition, position: positionWithoutCollateral },
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongCollateral);
	});

	test('Add automation - Wrong data type - "collateral (position)"', async ({ request }) => {
		const response = await request.post(stopLossEndpoint, {
			data: {
				...validPayloads.stopLoss.closeToDebt,
				position: { ...validPayloads.stopLoss.closeToDebt.position, collateral: 11 },
			},
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongCollateral);
	});

	test('Add automation - Wrong value - "collateral (position)"', async ({ request }) => {
		const response = await request.post(stopLossEndpoint, {
			data: {
				...validPayloads.stopLoss.closeToDebt,
				position: {
					...validPayloads.stopLoss.closeToDebt.position,
					collateral: '0xwrong',
				},
			},
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongCollateral);
	});

	test('Add automation - Without "debt (position)"', async ({ request }) => {
		const { position, ...payloadWithoutPosition } = validPayloads.stopLoss.closeToDebt;
		const { debt, ...positionWithoutDebt } = position;

		const response = await request.post(stopLossEndpoint, {
			data: { ...payloadWithoutPosition, position: positionWithoutDebt },
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongDebt);
	});

	test('Add automation - Wrong data type - "debt (position)"', async ({ request }) => {
		const response = await request.post(stopLossEndpoint, {
			data: {
				...validPayloads.stopLoss.closeToDebt,
				position: { ...validPayloads.stopLoss.closeToDebt.position, debt: 11 },
			},
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongDebt);
	});

	test('Add automation - Wrong value - "debt (position)"', async ({ request }) => {
		const response = await request.post(stopLossEndpoint, {
			data: {
				...validPayloads.stopLoss.closeToDebt,
				position: {
					...validPayloads.stopLoss.closeToDebt.position,
					debt: '0xwrong',
				},
			},
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongDebt);
	});

	test('Add automation - Without "triggerData"', async ({ request }) => {
		const { triggerData, ...payloadWithoutTriggerData } = validPayloads.stopLoss.closeToDebt;

		const response = await request.post(stopLossEndpoint, {
			data: payloadWithoutTriggerData,
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongTriggerDataStopLoss);
	});

	test('Add automation - Wrong data type - "triggerData" - string', async ({ request }) => {
		const response = await request.post(stopLossEndpoint, {
			data: { ...validPayloads.stopLoss.closeToDebt, triggerData: 'string' },
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongTriggerDataStopLoss);
	});

	test('Add automation - Wrong data type - "triggerData" - number', async ({ request }) => {
		const response = await request.post(stopLossEndpoint, {
			data: { ...validPayloads.stopLoss.closeToDebt, triggerData: 1 },
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongTriggerDataStopLoss);
	});

	test('Add automation - Wrong data type - "triggerData" - array', async ({ request }) => {
		const response = await request.post(stopLossEndpoint, {
			data: { ...validPayloads.stopLoss.closeToDebt, triggerData: [] },
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongTriggerDataStopLoss);
	});

	test('Add automation - Wrong data type - "triggerData" - null', async ({ request }) => {
		const response = await request.post(stopLossEndpoint, {
			data: { ...validPayloads.stopLoss.closeToDebt, triggerData: null },
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongTriggerDataStopLoss);
	});

	test('Add automation - Without "executionLTV (triggerData)"', async ({ request }) => {
		const { triggerData, ...payloadWithoutTriggerData } = validPayloads.stopLoss.closeToDebt;
		const { executionLTV, ...triggerDataWithoutExecutionLTV } = triggerData;

		const response = await request.post(stopLossEndpoint, {
			data: { ...payloadWithoutTriggerData, triggerData: triggerDataWithoutExecutionLTV },
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongTriggerDataStopLoss);
	});

	test('Add automation - Without "token (triggerData)"', async ({ request }) => {
		const { triggerData, ...payloadWithoutTriggerData } = validPayloads.stopLoss.closeToDebt;
		const { token, ...triggerDataWithoutToken } = triggerData;

		const response = await request.post(stopLossEndpoint, {
			data: { ...payloadWithoutTriggerData, triggerData: triggerDataWithoutToken },
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongTriggerDataStopLoss);
	});
});