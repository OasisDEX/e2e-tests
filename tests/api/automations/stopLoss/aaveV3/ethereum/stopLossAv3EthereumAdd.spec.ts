import { expect, test } from '@playwright/test';
import { validPayloadsAaveV3Ethereum, responses } from 'utils/testData_APIs';

const stopLossEndpoint = '/api/triggers/1/aave3/dma-stop-loss';
const validPayloads = validPayloadsAaveV3Ethereum.stopLoss.closeToDebt;

test.describe('API tests - Stop-Loss - Aave V3 - Ethereum', async () => {
	// Old test wallet: 0x10649c79428d718621821Cf6299e91920284743F
	// Position link: https://staging.summer.fi/ethereum/aave/v3/multiply/ETH-USDC/1218

	test('Add automation - Close to debt - Valid payload data', async ({ request }) => {
		const response = await request.post(stopLossEndpoint, {
			data: validPayloads,
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.stopLoss);
	});

	test('Add automation - Close to collateral - Valid payload data', async ({ request }) => {
		const response = await request.post(stopLossEndpoint, {
			data: {
				...validPayloads,
				triggerData: {
					...validPayloads.triggerData,
					token: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
				},
			},
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.stopLoss);
	});

	test('Add automation - Without "dpm"', async ({ request }) => {
		const { dpm, ...payloadWithoutDpm } = validPayloads;

		const response = await request.post(stopLossEndpoint, {
			data: payloadWithoutDpm,
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongDpm);
	});

	test('Add automation - Wrong data type - "dpm"', async ({ request }) => {
		const response = await request.post(stopLossEndpoint, {
			data: { ...validPayloads, dpm: 1 },
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongDpm);
	});

	test('Add automation - Wrong value - "dpm"', async ({ request }) => {
		const response = await request.post(stopLossEndpoint, {
			data: { ...validPayloads, dpm: '0xwrong' },
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongDpm);
	});

	test('Add automation - Without "position"', async ({ request }) => {
		const { position, ...payloadWithoutPosition } = validPayloads;

		const response = await request.post(stopLossEndpoint, {
			data: payloadWithoutPosition,
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.missingPosition);
	});

	test('Add automation - Wrong data type - "position" - string', async ({ request }) => {
		const response = await request.post(stopLossEndpoint, {
			data: { ...validPayloads, position: 'string' },
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongPosition_string);
	});

	test('Add automation - Wrong data type - "position" - number', async ({ request }) => {
		const response = await request.post(stopLossEndpoint, {
			data: { ...validPayloads, position: 1 },
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongPosition_number);
	});

	test('Add automation - Wrong data type - "position" - array', async ({ request }) => {
		const response = await request.post(stopLossEndpoint, {
			data: { ...validPayloads, position: [] },
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongPosition_array);
	});

	test('Add automation - Wrong data type - "position" - null', async ({ request }) => {
		const response = await request.post(stopLossEndpoint, {
			data: { ...validPayloads, position: null },
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongPosition_null);
	});

	test('Add automation - Without "collateral (position)"', async ({ request }) => {
		const { position, ...payloadWithoutPosition } = validPayloads;
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
				...validPayloads,
				position: { ...validPayloads.position, collateral: 11 },
			},
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongCollateral);
	});

	test('Add automation - Wrong value - "collateral (position)"', async ({ request }) => {
		const response = await request.post(stopLossEndpoint, {
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

		const response = await request.post(stopLossEndpoint, {
			data: { ...payloadWithoutPosition, position: positionWithoutDebt },
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongDebt);
	});

	test('Add automation - Wrong data type - "debt (position)"', async ({ request }) => {
		const response = await request.post(stopLossEndpoint, {
			data: {
				...validPayloads,
				position: { ...validPayloads.position, debt: 11 },
			},
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongDebt);
	});

	test('Add automation - Wrong value - "debt (position)"', async ({ request }) => {
		const response = await request.post(stopLossEndpoint, {
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

		const response = await request.post(stopLossEndpoint, {
			data: payloadWithoutTriggerData,
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongTriggerDataStopLoss);
	});

	test('Add automation - Wrong data type - "triggerData" - string', async ({ request }) => {
		const response = await request.post(stopLossEndpoint, {
			data: { ...validPayloads, triggerData: 'string' },
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongTriggerDataStopLoss);
	});

	test('Add automation - Wrong data type - "triggerData" - number', async ({ request }) => {
		const response = await request.post(stopLossEndpoint, {
			data: { ...validPayloads, triggerData: 1 },
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongTriggerDataStopLoss);
	});

	test('Add automation - Wrong data type - "triggerData" - array', async ({ request }) => {
		const response = await request.post(stopLossEndpoint, {
			data: { ...validPayloads, triggerData: [] },
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongTriggerDataStopLoss);
	});

	test('Add automation - Wrong data type - "triggerData" - null', async ({ request }) => {
		const response = await request.post(stopLossEndpoint, {
			data: { ...validPayloads, triggerData: null },
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongTriggerDataStopLoss);
	});

	test('Add automation - Without "executionLTV (triggerData)"', async ({ request }) => {
		const { triggerData, ...payloadWithoutTriggerData } = validPayloads;
		const { executionLTV, ...triggerDataWithoutExecutionLTV } = triggerData;

		const response = await request.post(stopLossEndpoint, {
			data: { ...payloadWithoutTriggerData, triggerData: triggerDataWithoutExecutionLTV },
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongTriggerDataStopLoss);
	});

	test('Add automation - Without "token (triggerData)"', async ({ request }) => {
		const { triggerData, ...payloadWithoutTriggerData } = validPayloads;
		const { token, ...triggerDataWithoutToken } = triggerData;

		const response = await request.post(stopLossEndpoint, {
			data: { ...payloadWithoutTriggerData, triggerData: triggerDataWithoutToken },
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongTriggerDataStopLoss);
	});
});
