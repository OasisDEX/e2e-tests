import { expect, test } from '@playwright/test';
import {
	validPayloadsMorpho,
	responses,
	autoSellWithoutMinSellPriceResponse,
} from 'utils/testData_APIs';

const autoSellEndpoint = '/api/triggers/1/morphoblue/auto-sell';

const validPayloads = validPayloadsMorpho.autoSell.updateMinSellPrice;

const validResponse = autoSellWithoutMinSellPriceResponse({
	dpm: '0x2e0515d7A3eA0276F28c94C426c5d2D1d85FD4d5',
	collateral: {
		decimals: 8,
		symbol: 'WBTC',
		address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
	},
	debt: {
		decimals: 6,
		symbol: 'USDC',
		address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
	},
	// hasStablecoinDebt: true, --> Morpho bug (?) - Waiting for confirmation
	hasStablecoinDebt: false,
	executionLTV: '8000',
	targetLTV: '7300',
	targetLTVWithDeviation: ['7200', '7400'],
});

test.describe('API tests - Auto-Sell - Update - Morpho Blue - Ethereum', async () => {
	// New test wallet: 0xDDc68f9dE415ba2fE2FD84bc62Be2d2CFF1098dA
	// Position link: https://staging.summer.fi/ethereum/morphoblue/multiply/WBTC-USDC/2545#protection

	test('Update existing automation - minSellPrice - Valid payload data', async ({ request }) => {
		const response = await request.post(autoSellEndpoint, {
			data: validPayloads,
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject({
			...validResponse,
			warnings: [],
		});
	});

	test('Update existing automation - executionLTV - Valid payload data', async ({ request }) => {
		const response = await request.post(autoSellEndpoint, {
			data: {
				...validPayloads,
				triggerData: {
					...validPayloads.triggerData,
					executionLTV: '8100',
					minSellPrice: '500000000000',
				},
			},
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject({
			...validResponse,
			simulation: { ...validResponse.simulation, executionLTV: '8100' },
			warnings: [],
		});
	});

	test('Update existing automation - targetLTV - Valid payload data', async ({ request }) => {
		const response = await request.post(autoSellEndpoint, {
			data: {
				...validPayloads,
				triggerData: {
					...validPayloads.triggerData,
					targetLTV: '7200',
					minSellPrice: '500000000000',
				},
			},
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject({
			...validResponse,
			simulation: {
				...validResponse.simulation,
				targetLTV: '7200',
				targetLTVWithDeviation: ['7100', '7300'],
			},
			warnings: [],
		});
	});

	test('Update existing automation - Set No threshold - Valid payload data', async ({
		request,
	}) => {
		const { minSellPrice, ...triggerdataWithoutminSellPrice } = validPayloads.triggerData;

		const response = await request.post(autoSellEndpoint, {
			data: {
				...validPayloads,
				triggerData: {
					...triggerdataWithoutminSellPrice,
					useMinSellPrice: false,
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

	test('Update existing automation - executionLTV, targetLTV & minSellPrice - Valid payload data @regression', async ({
		request,
	}) => {
		const response = await request.post(autoSellEndpoint, {
			data: {
				...validPayloads,
				triggerData: {
					...validPayloads.triggerData,
					executionLTV: '7800',
					targetLTV: '6700',
					minSellPrice: '300000000000',
				},
			},
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject({
			...validResponse,
			simulation: {
				...validResponse.simulation,
				executionLTV: '7800',
				targetLTV: '6700',
				targetLTVWithDeviation: ['6600', '6800'],
			},
			warnings: [],
		});
	});

	test('Update non-existing automation', async ({ request }) => {
		const response = await request.post(autoSellEndpoint, {
			data: {
				...validPayloadsMorpho.autoSell.addWithoutMinSellPrice,
				action: 'update',
			},
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.autoSellDoesNotExist);
	});

	test('Update automation - Without "dpm"', async ({ request }) => {
		const { dpm, ...payloadWithoutDpm } = validPayloads;

		const response = await request.post(autoSellEndpoint, {
			data: payloadWithoutDpm,
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongDpm);
	});

	test('Update automation - Wrong data type - "dpm"', async ({ request }) => {
		const response = await request.post(autoSellEndpoint, {
			data: { ...validPayloads, dpm: 1 },
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongDpm);
	});

	test('Update automation - Wrong value - "dpm"', async ({ request }) => {
		const response = await request.post(autoSellEndpoint, {
			data: { ...validPayloads, dpm: '0xwrong' },
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongDpm);
	});

	test('Update automation - Without "position"', async ({ request }) => {
		const { position, ...payloadWithoutPosition } = validPayloads;

		const response = await request.post(autoSellEndpoint, {
			data: payloadWithoutPosition,
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.missingPosition);
	});

	test('Update automation - Wrong data type - "position" - string', async ({ request }) => {
		const response = await request.post(autoSellEndpoint, {
			data: { ...validPayloads, position: 'string' },
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongPosition_string);
	});

	test('Update automation - Wrong data type - "position" - number', async ({ request }) => {
		const response = await request.post(autoSellEndpoint, {
			data: { ...validPayloads, position: 1 },
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongPosition_number);
	});

	test('Update automation - Wrong data type - "position" - array', async ({ request }) => {
		const response = await request.post(autoSellEndpoint, {
			data: { ...validPayloads, position: [] },
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongPosition_array);
	});

	test('Update automation - Wrong data type - "position" - null', async ({ request }) => {
		const response = await request.post(autoSellEndpoint, {
			data: { ...validPayloads, position: null },
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongPosition_null);
	});

	test('Update automation - Without "collateral (position)"', async ({ request }) => {
		const { position, ...payloadWithoutPosition } = validPayloads;
		const { collateral, ...positionWithoutCollateral } = position;

		const response = await request.post(autoSellEndpoint, {
			data: { ...payloadWithoutPosition, position: positionWithoutCollateral },
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongCollateral);
	});

	test('Update automation - Wrong data type - "collateral (position)"', async ({ request }) => {
		const response = await request.post(autoSellEndpoint, {
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

	test('Update automation - Wrong value - "collateral (position)"', async ({ request }) => {
		const response = await request.post(autoSellEndpoint, {
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

	test('Update automation - Without "debt (position)"', async ({ request }) => {
		const { position, ...payloadWithoutPosition } = validPayloads;
		const { debt, ...positionWithoutDebt } = position;

		const response = await request.post(autoSellEndpoint, {
			data: { ...payloadWithoutPosition, position: positionWithoutDebt },
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongDebt);
	});

	test('Update automation - Wrong data type - "debt (position)"', async ({ request }) => {
		const response = await request.post(autoSellEndpoint, {
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

	test('Update automation - Wrong value - "debt (position)"', async ({ request }) => {
		const response = await request.post(autoSellEndpoint, {
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

	test('Update automation - Without "triggerData"', async ({ request }) => {
		const { triggerData, ...payloadWithoutTriggerData } = validPayloads;

		const response = await request.post(autoSellEndpoint, {
			data: payloadWithoutTriggerData,
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.missingTriggerData);
	});

	test('Update automation - Wrong data type - "triggerData" - string', async ({ request }) => {
		const response = await request.post(autoSellEndpoint, {
			data: {
				...validPayloads,
				triggerData: 'string',
			},
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongTriggerData_string);
	});

	test('Update automation - Wrong data type - "triggerData" - number', async ({ request }) => {
		const response = await request.post(autoSellEndpoint, {
			data: { ...validPayloads, triggerData: 1 },
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongTriggerData_number);
	});

	test('Update automation - Wrong data type - "triggerData" - array', async ({ request }) => {
		const response = await request.post(autoSellEndpoint, {
			data: { ...validPayloads, triggerData: [] },
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongTriggerData_array);
	});

	test('Update automation - Wrong data type - "triggerData" - null', async ({ request }) => {
		const response = await request.post(autoSellEndpoint, {
			data: { ...validPayloads, triggerData: null },
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongTriggerData_null);
	});

	test('Update automation - Without "executionLTV (triggerData)"', async ({ request }) => {
		const { triggerData, ...payloadWithoutTriggerData } = validPayloads;
		const { executionLTV, ...triggerDataWithoutExecutionLTV } = triggerData;

		const response = await request.post(autoSellEndpoint, {
			data: { ...payloadWithoutTriggerData, triggerData: triggerDataWithoutExecutionLTV },
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongExecutionLTV);
	});

	test('Update automation - Without "maxBaseFee (triggerData)"', async ({ request }) => {
		const { triggerData, ...payloadWithoutTriggerData } = validPayloads;
		const { maxBaseFee, ...triggerDataWithoutMaxBaseFee } = triggerData;

		const response = await request.post(autoSellEndpoint, {
			data: { ...payloadWithoutTriggerData, triggerData: triggerDataWithoutMaxBaseFee },
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongMaxBaseFee);
	});

	test('Update automation - Without "targetLTV (triggerData)"', async ({ request }) => {
		const { triggerData, ...payloadWithoutTriggerData } = validPayloads;
		const { targetLTV, ...triggerDataWithoutTargetLTV } = triggerData;

		const response = await request.post(autoSellEndpoint, {
			data: { ...payloadWithoutTriggerData, triggerData: triggerDataWithoutTargetLTV },
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongTargetLTV);
	});

	test('Update automation - Without "useMinSellPrice (triggerData)"', async ({ request }) => {
		const { triggerData, ...payloadWithoutTriggerData } = validPayloads;
		const { minSellPrice, useMinSellPrice, ...triggerDataWithoutUseMinSellPrice } = triggerData;

		const response = await request.post(autoSellEndpoint, {
			data: { ...payloadWithoutTriggerData, triggerData: triggerDataWithoutUseMinSellPrice },
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongUseMinSellPrice);
	});
});
