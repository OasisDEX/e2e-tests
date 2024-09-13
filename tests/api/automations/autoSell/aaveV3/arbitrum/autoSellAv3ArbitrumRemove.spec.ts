import { expect, test } from '@playwright/test';
import {
	validPayloadsAaveV3Arbitrum,
	responses,
	autoSellWithoutMinSellPriceResponse,
} from 'utils/testData_APIs';

const autoSellEndpoint = '/api/triggers/42161/aave3/auto-sell';

const validPayloads = validPayloadsAaveV3Arbitrum.autoSell.remove;

const validResponse = autoSellWithoutMinSellPriceResponse({
	dpm: '0x1816c0d0B0a42B9118a53C2f6D0a305eD54EA74C',
	collateral: {
		decimals: 18,
		symbol: 'wstETH',
		address: '0x5979D7b546E38E414F7E9822514be443A4800529',
	},
	debt: {
		decimals: 6,
		symbol: 'USDC',
		address: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831',
	},
	hasStablecoinDebt: true,
	executionLTV: '64',
	targetLTV: '56',
	targetLTVWithDeviation: ['-44', '156'],
});

test.describe('API tests - Auto-Sell - Remove - Aave V3 - Arbitrum', async () => {
	// New test wallet: 0xDDc68f9dE415ba2fE2FD84bc62Be2d2CFF1098dA
	// Position link: https://staging.summer.fi/arbitrum/aave/v3/multiply/WSTETH-USDC/351

	test('Remove existing automation - Valid payload data', async ({ request }) => {
		const response = await request.post(autoSellEndpoint, {
			data: validPayloads,
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject({
			...validResponse,
			warnings: [],
		});
	});

	test('Remove non-existing automation', async ({ request }) => {
		const response = await request.post(autoSellEndpoint, {
			data: {
				...validPayloadsAaveV3Arbitrum.autoSell.addWithoutMinSellPrice,
				action: 'update',
			},
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.autoSellDoesNotExist);
	});

	test('Remove existing automation - Without "dpm"', async ({ request }) => {
		const { dpm, ...payloadWithoutDpm } = validPayloads;

		const response = await request.post(autoSellEndpoint, {
			data: payloadWithoutDpm,
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongDpm);
	});

	test('Remove existing automation - Wrong data type - "dpm"', async ({ request }) => {
		const response = await request.post(autoSellEndpoint, {
			data: { ...validPayloads, dpm: 1 },
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongDpm);
	});

	test('Remove existing automation - Wrong value - "dpm"', async ({ request }) => {
		const response = await request.post(autoSellEndpoint, {
			data: { ...validPayloads, dpm: '0xwrong' },
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongDpm);
	});

	test('Remove existing automation - Without "position"', async ({ request }) => {
		const { position, ...payloadWithoutPosition } = validPayloads;

		const response = await request.post(autoSellEndpoint, {
			data: payloadWithoutPosition,
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.missingPosition);
	});

	test('Remove existing automation - Wrong data type - "position" - string', async ({
		request,
	}) => {
		const response = await request.post(autoSellEndpoint, {
			data: { ...validPayloads, position: 'string' },
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongPosition_string);
	});

	test('Remove existing automation - Wrong data type - "position" - number', async ({
		request,
	}) => {
		const response = await request.post(autoSellEndpoint, {
			data: { ...validPayloads, position: 1 },
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongPosition_number);
	});

	test('Remove existing automation - Wrong data type - "position" - array', async ({ request }) => {
		const response = await request.post(autoSellEndpoint, {
			data: { ...validPayloads, position: [] },
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongPosition_array);
	});

	test('Remove existing automation - Wrong data type - "position" - null', async ({ request }) => {
		const response = await request.post(autoSellEndpoint, {
			data: { ...validPayloads, position: null },
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongPosition_null);
	});

	test('Remove existing automation - Without "collateral (position)"', async ({ request }) => {
		const { position, ...payloadWithoutPosition } = validPayloads;
		const { collateral, ...positionWithoutCollateral } = position;

		const response = await request.post(autoSellEndpoint, {
			data: { ...payloadWithoutPosition, position: positionWithoutCollateral },
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongCollateral);
	});

	test('Remove existing automation - Wrong data type - "collateral (position)"', async ({
		request,
	}) => {
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

	test('Remove existing automation - Wrong value - "collateral (position)"', async ({
		request,
	}) => {
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

	test('Remove existing automation - Without "debt (position)"', async ({ request }) => {
		const { position, ...payloadWithoutPosition } = validPayloads;
		const { debt, ...positionWithoutDebt } = position;

		const response = await request.post(autoSellEndpoint, {
			data: { ...payloadWithoutPosition, position: positionWithoutDebt },
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongDebt);
	});

	test('Remove existing automation - Wrong data type - "debt (position)"', async ({ request }) => {
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

	test('Remove existing automation - Wrong value - "debt (position)"', async ({ request }) => {
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

	test('Remove existing automation - Without "triggerData"', async ({ request }) => {
		const { triggerData, ...payloadWithoutTriggerData } = validPayloads;

		const response = await request.post(autoSellEndpoint, {
			data: payloadWithoutTriggerData,
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.missingTriggerData);
	});

	test('Remove existing automation - Wrong data type - "triggerData" - string', async ({
		request,
	}) => {
		const response = await request.post(autoSellEndpoint, {
			data: {
				...validPayloads,
				triggerData: 'string',
			},
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongTriggerData_string);
	});

	test('Remove existing automation - Wrong data type - "triggerData" - number', async ({
		request,
	}) => {
		const response = await request.post(autoSellEndpoint, {
			data: { ...validPayloads, triggerData: 1 },
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongTriggerData_number);
	});

	test('Remove existing automation - Wrong data type - "triggerData" - array', async ({
		request,
	}) => {
		const response = await request.post(autoSellEndpoint, {
			data: { ...validPayloads, triggerData: [] },
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongTriggerData_array);
	});

	test('Remove existing automation - Wrong data type - "triggerData" - null', async ({
		request,
	}) => {
		const response = await request.post(autoSellEndpoint, {
			data: { ...validPayloads, triggerData: null },
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongTriggerData_null);
	});

	test('Remove existing automation - Without "executionLTV (triggerData)"', async ({ request }) => {
		const { triggerData, ...payloadWithoutTriggerData } = validPayloads;
		const { executionLTV, ...triggerDataWithoutExecutionLTV } = triggerData;

		const response = await request.post(autoSellEndpoint, {
			data: { ...payloadWithoutTriggerData, triggerData: triggerDataWithoutExecutionLTV },
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongExecutionLTV);
	});

	test('Remove existing automation - Without "maxBaseFee (triggerData)"', async ({ request }) => {
		const { triggerData, ...payloadWithoutTriggerData } = validPayloads;
		const { maxBaseFee, ...triggerDataWithoutMaxBaseFee } = triggerData;

		const response = await request.post(autoSellEndpoint, {
			data: { ...payloadWithoutTriggerData, triggerData: triggerDataWithoutMaxBaseFee },
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongMaxBaseFee);
	});

	test('Remove existing automation - Without "targetLTV (triggerData)"', async ({ request }) => {
		const { triggerData, ...payloadWithoutTriggerData } = validPayloads;
		const { targetLTV, ...triggerDataWithoutTargetLTV } = triggerData;

		const response = await request.post(autoSellEndpoint, {
			data: { ...payloadWithoutTriggerData, triggerData: triggerDataWithoutTargetLTV },
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongTargetLTV);
	});

	test('Remove existing automation - Without "useMinSellPrice (triggerData)"', async ({
		request,
	}) => {
		const { triggerData, ...payloadWithoutTriggerData } = validPayloads;
		const { minSellPrice, useMinSellPrice, ...triggerDataWithoutUseMinSellPrice } = triggerData;

		const response = await request.post(autoSellEndpoint, {
			data: { ...payloadWithoutTriggerData, triggerData: triggerDataWithoutUseMinSellPrice },
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongUseMinSellPrice);
	});
});
