import { expect, test } from '@playwright/test';
import { validPayloadsAaveV3Base, responses, trailingStopLossResponse } from 'utils/testData_APIs';

const trailingStopLossEndpoint = '/api/triggers/8453/aave3/dma-trailing-stop-loss';

const validPayloads = validPayloadsAaveV3Base.trailingStopLoss.closeToDebt;

const validResponse = trailingStopLossResponse({
	dpm: '0xf71dA0973121d949E1CEe818eb519BA364406309',
	collateral: {
		decimals: 18,
		symbol: 'WETH',
		address: '0x4200000000000000000000000000000000000006',
		oraclesAddress: '0x71041dddad3595f9ced3dccfbe3d1f4b0a16bb70',
	},
	debt: {
		decimals: 6,
		symbol: 'USDC',
		address: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
		oraclesAddress: '0x7e860098f58bbfc8648a4311b374b1d669a2bc6b',
	},
	hasStablecoinDebt: true,
});

test.describe('API tests - Trailing Stop-Loss - Add - Aave V3 - Base', async () => {
	// Old test wallet: 0x10649c79428d718621821Cf6299e91920284743F
	// Position link: https://staging.summer.fi/base/aave/v3/multiply/ETH-USDC/435

	test('Add automation - Close to debt - Valid payload data', async ({ request }) => {
		const response = await request.post(trailingStopLossEndpoint, {
			data: validPayloads,
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(validResponse);
	});

	test('Add automation - Close to collateral - Valid payload data', async ({ request }) => {
		const response = await request.post(trailingStopLossEndpoint, {
			data: {
				...validPayloads,
				triggerData: {
					...validPayloads.triggerData,
					token: '0x4200000000000000000000000000000000000006',
				},
			},
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(validResponse);
	});

	test('Add automation - Without "dpm"', async ({ request }) => {
		const { dpm, ...payloadWithoutDpm } = validPayloads;

		const response = await request.post(trailingStopLossEndpoint, {
			data: payloadWithoutDpm,
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongDpm);
	});

	test('Add automation - Wrong data type - "dpm"', async ({ request }) => {
		const response = await request.post(trailingStopLossEndpoint, {
			data: { ...validPayloads, dpm: 1 },
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongDpm);
	});

	test('Add automation - Wrong value - "dpm"', async ({ request }) => {
		const response = await request.post(trailingStopLossEndpoint, {
			data: { ...validPayloads, dpm: '0xwrong' },
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongDpm);
	});

	test('Add automation - Without "position"', async ({ request }) => {
		const { position, ...payloadWithoutPosition } = validPayloads;

		const response = await request.post(trailingStopLossEndpoint, {
			data: payloadWithoutPosition,
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.missingPosition);
	});

	test('Add automation - Wrong data type - "position" - string', async ({ request }) => {
		const response = await request.post(trailingStopLossEndpoint, {
			data: { ...validPayloads, position: 'string' },
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongPosition_string);
	});

	test('Add automation - Wrong data type - "position" - number', async ({ request }) => {
		const response = await request.post(trailingStopLossEndpoint, {
			data: { ...validPayloads, position: 1 },
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongPosition_number);
	});

	test('Add automation - Wrong data type - "position" - array', async ({ request }) => {
		const response = await request.post(trailingStopLossEndpoint, {
			data: { ...validPayloads, position: [] },
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongPosition_array);
	});

	test('Add automation - Wrong data type - "position" - null', async ({ request }) => {
		const response = await request.post(trailingStopLossEndpoint, {
			data: { ...validPayloads, position: null },
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongPosition_null);
	});

	test('Add automation - Without "collateral (position)"', async ({ request }) => {
		const { position, ...payloadWithoutPosition } = validPayloads;
		const { collateral, ...positionWithoutCollateral } = position;

		const response = await request.post(trailingStopLossEndpoint, {
			data: { ...payloadWithoutPosition, position: positionWithoutCollateral },
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongCollateral);
	});

	test('Add automation - Wrong data type - "collateral (position)"', async ({ request }) => {
		const response = await request.post(trailingStopLossEndpoint, {
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
		const response = await request.post(trailingStopLossEndpoint, {
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

		const response = await request.post(trailingStopLossEndpoint, {
			data: { ...payloadWithoutPosition, position: positionWithoutDebt },
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongDebt);
	});

	test('Add automation - Wrong data type - "debt (position)"', async ({ request }) => {
		const response = await request.post(trailingStopLossEndpoint, {
			data: {
				...validPayloads,
				position: {
					...validPayloads.position,
					debt: 11,
				},
			},
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongDebt);
	});

	test('Add automation - Wrong value - "debt (position)"', async ({ request }) => {
		const response = await request.post(trailingStopLossEndpoint, {
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

		const response = await request.post(trailingStopLossEndpoint, {
			data: payloadWithoutTriggerData,
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.missingTriggerData);
	});

	test('Add automation - Wrong data type - "triggerData" - string', async ({ request }) => {
		const response = await request.post(trailingStopLossEndpoint, {
			data: { ...validPayloads, triggerData: 'string' },
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongTriggerData_string);
	});

	test('Add automation - Wrong data type - "triggerData" - number', async ({ request }) => {
		const response = await request.post(trailingStopLossEndpoint, {
			data: { ...validPayloads, triggerData: 1 },
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongTriggerData_number);
	});

	test('Add automation - Wrong data type - "triggerData" - array', async ({ request }) => {
		const response = await request.post(trailingStopLossEndpoint, {
			data: { ...validPayloads, triggerData: [] },
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongTriggerData_array);
	});

	test('Add automation - Wrong data type - "triggerData" - null', async ({ request }) => {
		const response = await request.post(trailingStopLossEndpoint, {
			data: { ...validPayloads, triggerData: null },
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongTriggerData_null);
	});

	test('Add automation - Without "trailingDistance (triggerData)"', async ({ request }) => {
		const { triggerData, ...payloadWithoutTriggerData } = validPayloads;
		const { trailingDistance, ...triggerDataWithoutTrailingDistance } = triggerData;

		const response = await request.post(trailingStopLossEndpoint, {
			data: { ...payloadWithoutTriggerData, triggerData: triggerDataWithoutTrailingDistance },
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongTrailingDistance);
	});

	test('Add automation - Without "token (triggerData)"', async ({ request }) => {
		const { triggerData, ...payloadWithoutTriggerData } = validPayloads;
		const { token, ...triggerDataWithoutToken } = triggerData;

		const response = await request.post(trailingStopLossEndpoint, {
			data: { ...payloadWithoutTriggerData, triggerData: triggerDataWithoutToken },
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongToken);
	});

	// SKIP - Trailing Stop-Loss executed - New positions to be used for tests
	test.skip('Add automation - Trigger already exists', async ({ request }) => {
		const response = await request.post(trailingStopLossEndpoint, {
			data: {
				...validPayloadsAaveV3Base.trailingStopLoss.updateCloseToCollateral,
				action: 'add',
			},
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.stopLossAlreadyExist);
	});
});
