import { expect, test } from '@playwright/test';
import {
	validPayloadsMorpho,
	responses,
	autoBuyWithoutMaxBuyPriceResponse,
} from 'utils/testData_APIs';

const autoBuyEndpoint = '/api/triggers/1/morphoblue/auto-buy';

const validPayloads = validPayloadsMorpho.autoBuy.updateMaxBuyPrice;

const validResponse = autoBuyWithoutMaxBuyPriceResponse({
	dpm: '0x2e0515d7A3eA0276F28c94C426c5d2D1d85FD4d5',
	collateral: {
		decimals: 18,
		symbol: 'wstETH',
		address: '0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0',
	},
	debt: {
		decimals: 18,
		symbol: 'WETH',
		address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
	},
	hasStablecoinDebt: false,
	executionLTV: '3000',
	targetLTV: '4300',
	targetLTVWithDeviation: ['4200', '4400'],
});

test.describe('API tests - Auto-Buy - Update - Morpho Blue - Ethereum', async () => {
	// New test wallet: 0xDDc68f9dE415ba2fE2FD84bc62Be2d2CFF1098dA
	// Position link: https://staging.summer.fi/ethereum/morphoblue/borrow/WSTETH-ETH-1/2545

	test('Update existing automation - maxBuyPrice - Valid payload data', async ({ request }) => {
		const response = await request.post(autoBuyEndpoint, {
			data: validPayloads,
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject({
			...validResponse,
			warnings: [],
		});
	});

	test('Update existing automation - executionLTV - Valid payload data', async ({ request }) => {
		const response = await request.post(autoBuyEndpoint, {
			data: {
				...validPayloads,
				triggerData: {
					...validPayloads.triggerData,
					executionLTV: '2500',
				},
			},
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject({
			...validResponse,
			simulation: { ...validResponse.simulation, executionLTV: '2500' },
			warnings: [],
		});
	});

	test('Update existing automation - targetLTV - Valid payload data', async ({ request }) => {
		const response = await request.post(autoBuyEndpoint, {
			data: {
				...validPayloads,
				triggerData: {
					...validPayloads.triggerData,
					targetLTV: '4600',
				},
			},
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject({
			...validResponse,
			simulation: {
				...validResponse.simulation,
				targetLTV: '4600',
				targetLTVWithDeviation: ['4500', '4700'],
			},
			warnings: [],
		});
	});

	test('Update existing automation - Set No threshold - Valid payload data', async ({
		request,
	}) => {
		const { maxBuyPrice, ...triggerdataWithoutmaxBuyPrice } = validPayloads.triggerData;

		const response = await request.post(autoBuyEndpoint, {
			data: {
				...validPayloads,
				triggerData: {
					...triggerdataWithoutmaxBuyPrice,
					useMaxBuyPrice: false,
				},
			},
		});

		const respJSON = await response.json();

		// No warning for Morpho - Minor bug
		//   https://app.shortcut.com/oazo-apps/story/15553/bug-auto-buy-missing-warning-when-selecting-set-no-threshold
		expect(respJSON).toMatchObject({
			...validResponse,
			warnings: [],
		});
	});

	test('Update existing automation - executionLTV, targetLTV & maxBuyPrice - Valid payload data', async ({
		request,
	}) => {
		const response = await request.post(autoBuyEndpoint, {
			data: {
				...validPayloads,
				triggerData: {
					...validPayloads.triggerData,
					executionLTV: '2000',
					targetLTV: '3300',
					maxBuyPrice: '40000000000000',
				},
			},
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject({
			...validResponse,
			simulation: {
				...validResponse.simulation,
				executionLTV: '2000',
				targetLTV: '3300',
				targetLTVWithDeviation: ['3200', '3400'],
			},
			warnings: [],
		});
	});

	test('Update non-existing automation', async ({ request }) => {
		const response = await request.post(autoBuyEndpoint, {
			data: {
				...validPayloadsMorpho.autoBuy.addWithoutMaxBuyPrice,
				action: 'update',
			},
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.autoBuyDoesNotExist);
	});

	test('Add automation - Without "dpm"', async ({ request }) => {
		const { dpm, ...payloadWithoutDpm } = validPayloads;

		const response = await request.post(autoBuyEndpoint, {
			data: payloadWithoutDpm,
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongDpm);
	});

	test('Add automation - Wrong data type - "dpm"', async ({ request }) => {
		const response = await request.post(autoBuyEndpoint, {
			data: { ...validPayloads, dpm: 1 },
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongDpm);
	});

	test('Add automation - Wrong value - "dpm"', async ({ request }) => {
		const response = await request.post(autoBuyEndpoint, {
			data: { ...validPayloads, dpm: '0xwrong' },
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongDpm);
	});

	test('Add automation - Without "position"', async ({ request }) => {
		const { position, ...payloadWithoutPosition } = validPayloads;

		const response = await request.post(autoBuyEndpoint, {
			data: payloadWithoutPosition,
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.missingPosition);
	});

	test('Add automation - Wrong data type - "position" - string', async ({ request }) => {
		const response = await request.post(autoBuyEndpoint, {
			data: { ...validPayloads, position: 'string' },
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongPosition_string);
	});

	test('Add automation - Wrong data type - "position" - number', async ({ request }) => {
		const response = await request.post(autoBuyEndpoint, {
			data: { ...validPayloads, position: 1 },
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongPosition_number);
	});

	test('Add automation - Wrong data type - "position" - array', async ({ request }) => {
		const response = await request.post(autoBuyEndpoint, {
			data: { ...validPayloads, position: [] },
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongPosition_array);
	});

	test('Add automation - Wrong data type - "position" - null', async ({ request }) => {
		const response = await request.post(autoBuyEndpoint, {
			data: { ...validPayloads, position: null },
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongPosition_null);
	});

	test('Add automation - Without "collateral (position)"', async ({ request }) => {
		const { position, ...payloadWithoutPosition } = validPayloads;
		const { collateral, ...positionWithoutCollateral } = position;

		const response = await request.post(autoBuyEndpoint, {
			data: { ...payloadWithoutPosition, position: positionWithoutCollateral },
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongCollateral);
	});

	test('Add automation - Wrong data type - "collateral (position)"', async ({ request }) => {
		const response = await request.post(autoBuyEndpoint, {
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
		const response = await request.post(autoBuyEndpoint, {
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

		const response = await request.post(autoBuyEndpoint, {
			data: { ...payloadWithoutPosition, position: positionWithoutDebt },
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongDebt);
	});

	test('Add automation - Wrong data type - "debt (position)"', async ({ request }) => {
		const response = await request.post(autoBuyEndpoint, {
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
		const response = await request.post(autoBuyEndpoint, {
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

		const response = await request.post(autoBuyEndpoint, {
			data: payloadWithoutTriggerData,
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.missingTriggerData);
	});

	test('Add automation - Wrong data type - "triggerData" - string', async ({ request }) => {
		const response = await request.post(autoBuyEndpoint, {
			data: { ...validPayloads, triggerData: 'string' },
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongTriggerData_string);
	});

	test('Add automation - Wrong data type - "triggerData" - number', async ({ request }) => {
		const response = await request.post(autoBuyEndpoint, {
			data: { ...validPayloads, triggerData: 1 },
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongTriggerData_number);
	});

	test('Add automation - Wrong data type - "triggerData" - array', async ({ request }) => {
		const response = await request.post(autoBuyEndpoint, {
			data: { ...validPayloads, triggerData: [] },
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongTriggerData_array);
	});

	test('Add automation - Wrong data type - "triggerData" - null', async ({ request }) => {
		const response = await request.post(autoBuyEndpoint, {
			data: { ...validPayloads, triggerData: null },
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongTriggerData_null);
	});

	test('Add automation - Without "executionLTV (triggerData)"', async ({ request }) => {
		const { triggerData, ...payloadWithoutTriggerData } = validPayloads;
		const { executionLTV, ...triggerDataWithoutExecutionLTV } = triggerData;

		const response = await request.post(autoBuyEndpoint, {
			data: { ...payloadWithoutTriggerData, triggerData: triggerDataWithoutExecutionLTV },
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongExecutionLTV);
	});

	test('Add automation - Without "maxBaseFee (triggerData)"', async ({ request }) => {
		const { triggerData, ...payloadWithoutTriggerData } = validPayloads;
		const { maxBaseFee, ...triggerDataWithoutMaxBaseFee } = triggerData;

		const response = await request.post(autoBuyEndpoint, {
			data: { ...payloadWithoutTriggerData, triggerData: triggerDataWithoutMaxBaseFee },
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongMaxBaseFee);
	});

	test('Add automation - Without "targetLTV (triggerData)"', async ({ request }) => {
		const { triggerData, ...payloadWithoutTriggerData } = validPayloads;
		const { targetLTV, ...triggerDataWithoutTargetLTV } = triggerData;

		const response = await request.post(autoBuyEndpoint, {
			data: { ...payloadWithoutTriggerData, triggerData: triggerDataWithoutTargetLTV },
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongTargetLTV);
	});

	test('Add automation - Without "useMaxBuyPrice (triggerData)"', async ({ request }) => {
		const { triggerData, ...payloadWithoutTriggerData } = validPayloads;
		const { maxBuyPrice, useMaxBuyPrice, ...triggerDataWithoutUseMaxBuyPrice } = triggerData;

		const response = await request.post(autoBuyEndpoint, {
			data: { ...payloadWithoutTriggerData, triggerData: triggerDataWithoutUseMaxBuyPrice },
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongUseMaxBuyPrice);
	});
});