import { expect, test } from '@playwright/test';
import { validPayloadsMorpho, responses, trailingStopLossResponse } from 'utils/testData_APIs';

const trailingStopLossEndpoint = '/api/triggers/1/morphoblue/dma-trailing-stop-loss';

const validPayloads = validPayloadsMorpho.trailingStopLoss.remove;

const validResponse = trailingStopLossResponse({
	dpm: '0x7126E8E9C26832B441a560f4283e09f9c51AB605',
	collateral: {
		decimals: 8,
		symbol: 'WBTC',
		address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
		oraclesAddress: '0xf4030086522a5beea4988f8ca5b36dbc97bee88c',
	},
	debt: {
		decimals: 6,
		symbol: 'USDC',
		address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
		oraclesAddress: '0x8fffffd4afb6115b954bd326cbe7b4ba576818f6',
	},
	// BUG - https://www.notion.so/oazo/144cbc0395cb478a8b81cff326740123?v=2bb430cfe8ca41ff9f6dde3b129ac0fb&p=791b4f641dcc44dc8f7a09b9f4059911&pm=s
	// hasStablecoinDebt: true,
	hasStablecoinDebt: false,
});

test.describe('API tests - Trailing Stop-Loss - Remove - Morpho Blue - Ethereum', async () => {
	// New test wallet: 0xDDc68f9dE415ba2fE2FD84bc62Be2d2CFF1098dA
	// Position link: https://staging.summer.fi/ethereum/morphoblue/multiply/WBTC-USDC/2592#protection

	test('Remove existing automation - Valid payload data', async ({ request }) => {
		const response = await request.post(trailingStopLossEndpoint, {
			data: validPayloads,
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(validResponse);
	});

	test('Remove non-existing automation', async ({ request }) => {
		const response = await request.post(trailingStopLossEndpoint, {
			data: {
				...validPayloadsMorpho.trailingStopLoss.closeToDebt,
				action: 'remove',
			},
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.stopLossDoesNotExist);
	});

	test('Remove existing automation - Without "dpm"', async ({ request }) => {
		const { dpm, ...payloadWithoutDpm } = validPayloads;

		const response = await request.post(trailingStopLossEndpoint, {
			data: payloadWithoutDpm,
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongDpm);
	});

	test('Remove existing automation - Wrong data type - "dpm"', async ({ request }) => {
		const response = await request.post(trailingStopLossEndpoint, {
			data: { ...validPayloads, dpm: 1 },
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongDpm);
	});

	test('Remove existing automation - Wrong value - "dpm"', async ({ request }) => {
		const response = await request.post(trailingStopLossEndpoint, {
			data: { ...validPayloads, dpm: '0xwrong' },
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongDpm);
	});

	test('Remove existing automation - Without "position"', async ({ request }) => {
		const { position, ...payloadWithoutPosition } = validPayloads;

		const response = await request.post(trailingStopLossEndpoint, {
			data: payloadWithoutPosition,
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.missingPosition);
	});

	test('Remove existing automation - Wrong data type - "position" - string', async ({
		request,
	}) => {
		const response = await request.post(trailingStopLossEndpoint, {
			data: { ...validPayloads, position: 'string' },
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongPosition_string);
	});

	test('Remove existing automation - Wrong data type - "position" - number', async ({
		request,
	}) => {
		const response = await request.post(trailingStopLossEndpoint, {
			data: { ...validPayloads, position: 1 },
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongPosition_number);
	});

	test('Remove existing automation - Wrong data type - "position" - array', async ({ request }) => {
		const response = await request.post(trailingStopLossEndpoint, {
			data: { ...validPayloads, position: [] },
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongPosition_array);
	});

	test('Remove existing automation - Wrong data type - "position" - null', async ({ request }) => {
		const response = await request.post(trailingStopLossEndpoint, {
			data: { ...validPayloads, position: null },
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongPosition_null);
	});

	test('Remove existing automation - Without "collateral (position)"', async ({ request }) => {
		const { position, ...payloadWithoutPosition } = validPayloads;
		const { collateral, ...positionWithoutCollateral } = position;

		const response = await request.post(trailingStopLossEndpoint, {
			data: { ...payloadWithoutPosition, position: positionWithoutCollateral },
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongCollateral);
	});

	test('Remove existing automation - Wrong data type - "collateral (position)"', async ({
		request,
	}) => {
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

	test('Remove existing automation - Wrong value - "collateral (position)"', async ({
		request,
	}) => {
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

	test('Remove existing automation - Without "debt (position)"', async ({ request }) => {
		const { position, ...payloadWithoutPosition } = validPayloads;
		const { debt, ...positionWithoutDebt } = position;

		const response = await request.post(trailingStopLossEndpoint, {
			data: { ...payloadWithoutPosition, position: positionWithoutDebt },
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongDebt);
	});

	test('Remove existing automation - Wrong data type - "debt (position)"', async ({ request }) => {
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

	test('Remove existing automation - Wrong value - "debt (position)"', async ({ request }) => {
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

	test('Remove existing automation - Without "triggerData"', async ({ request }) => {
		const { triggerData, ...payloadWithoutTriggerData } = validPayloads;

		const response = await request.post(trailingStopLossEndpoint, {
			data: payloadWithoutTriggerData,
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.missingTriggerData);
	});

	test('Remove existing automation - Wrong data type - "triggerData" - string', async ({
		request,
	}) => {
		const response = await request.post(trailingStopLossEndpoint, {
			data: { ...validPayloads, triggerData: 'string' },
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongTriggerData_string);
	});

	test('Remove existing automation - Wrong data type - "triggerData" - number', async ({
		request,
	}) => {
		const response = await request.post(trailingStopLossEndpoint, {
			data: { ...validPayloads, triggerData: 1 },
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongTriggerData_number);
	});

	test('Remove existing automation - Wrong data type - "triggerData" - array', async ({
		request,
	}) => {
		const response = await request.post(trailingStopLossEndpoint, {
			data: { ...validPayloads, triggerData: [] },
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongTriggerData_array);
	});

	test('Remove existing automation - Wrong data type - "triggerData" - null', async ({
		request,
	}) => {
		const response = await request.post(trailingStopLossEndpoint, {
			data: { ...validPayloads, triggerData: null },
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongTriggerData_null);
	});

	test('Remove existing automation - Without "trailingDistance (triggerData)"', async ({
		request,
	}) => {
		const { triggerData, ...payloadWithoutTriggerData } = validPayloads;
		const { trailingDistance, ...triggerDataWithoutTrailingDistance } = triggerData;

		const response = await request.post(trailingStopLossEndpoint, {
			data: { ...payloadWithoutTriggerData, triggerData: triggerDataWithoutTrailingDistance },
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongTrailingDistance);
	});

	test('Remove existing automation - Without "token (triggerData)"', async ({ request }) => {
		const { triggerData, ...payloadWithoutTriggerData } = validPayloads;
		const { token, ...triggerDataWithoutToken } = triggerData;

		const response = await request.post(trailingStopLossEndpoint, {
			data: { ...payloadWithoutTriggerData, triggerData: triggerDataWithoutToken },
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongToken);
	});
});