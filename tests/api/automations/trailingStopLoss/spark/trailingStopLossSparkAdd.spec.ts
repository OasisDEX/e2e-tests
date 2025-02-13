import { expect, test } from '@playwright/test';
import { validPayloadsSpark, responses, trailingStopLossResponse } from 'utils/testData_APIs';

const trailingStopLossEndpoint = '/api/triggers/1/spark/dma-trailing-stop-loss';

const validPayloads = validPayloadsSpark.trailingStopLoss.closeToDebt;

const validResponse = trailingStopLossResponse({
	dpm: '0x7126E8E9C26832B441a560f4283e09f9c51AB605',
	collateral: {
		decimals: 8,
		symbol: 'WBTC',
		address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
		oraclesAddress: '0xf4030086522a5beea4988f8ca5b36dbc97bee88c',
	},
	debt: {
		decimals: 18,
		symbol: 'DAI',
		address: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
		oraclesAddress: '0xaed0c38402a5d19df6e4c03f4e2dced6e29c1ee9',
	},
	hasStablecoinDebt: true,
});

test.describe('API tests - Trailing Stop-Loss - Add - Spark - Ethereum', async () => {
	// New test wallet: 0xDDc68f9dE415ba2fE2FD84bc62Be2d2CFF1098dA
	// Position link: https://staging.summer.fi/ethereum/spark/borrow/WBTC-DAI/2592#protection

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
					token: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
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

	// SKIP - To be tested with another position
	test.skip('Add automation - Trigger already exists', async ({ request }) => {
		const response = await request.post(trailingStopLossEndpoint, {
			data: {
				...validPayloadsSpark.trailingStopLoss.updateCloseToCollateral,
				action: 'add',
			},
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.stopLossAlreadyExist);
	});
});
