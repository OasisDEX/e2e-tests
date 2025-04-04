import { expect, test } from '@playwright/test';
import {
	validPayloadsAaveV3Base,
	responses,
	autoSellWithoutMinSellPriceResponse,
} from 'utils/testData_APIs';

const autoSellEndpoint = '/api/triggers/8453/aave3/auto-sell';

const validPayloads = validPayloadsAaveV3Base;

const validResponse = autoSellWithoutMinSellPriceResponse({
	dpm: '0xf71dA0973121d949E1CEe818eb519BA364406309',
	collateral: {
		decimals: 18,
		symbol: 'WETH',
		address: '0x4200000000000000000000000000000000000006',
	},
	debt: {
		decimals: 6,
		symbol: 'USDC',
		address: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
	},
	hasStablecoinDebt: true,
	executionLTV: '6000',
	targetLTV: '3300',
	targetLTVWithDeviation: ['3200', '3400'],
});

test.describe('API tests - Auto-Sell - Aave V3 - Base', async () => {
	// Old test wallet: 0x10649c79428d718621821Cf6299e91920284743F
	// Position link: https://staging.summer.fi/base/aave/v3/multiply/ETH-USDC/435

	test('Add automation - Without Min Sell Price - Valid payload data @regression', async ({
		request,
	}) => {
		const response = await request.post(autoSellEndpoint, {
			data: validPayloads.autoSell.addWithoutMinSellPrice,
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(validResponse);
	});

	test('Add automation - With Min Sell Price - Valid payload data @regression', async ({
		request,
	}) => {
		const response = await request.post(autoSellEndpoint, {
			data: {
				...validPayloads.autoSell.addWithoutMinSellPrice,
				triggerData: {
					...validPayloads.autoSell.addWithoutMinSellPrice.triggerData,
					minSellPrice: '60000000000',
					useMinSellPrice: true,
				},
			},
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject({
			...validResponse,
			warnings: [],
		});
	});

	test('Add automation - Without "dpm"', async ({ request }) => {
		const { dpm, ...payloadWithoutDpm } = validPayloads.autoSell.addWithoutMinSellPrice;

		const response = await request.post(autoSellEndpoint, {
			data: payloadWithoutDpm,
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongDpm);
	});

	test('Add automation - Wrong data type - "dpm"', async ({ request }) => {
		const response = await request.post(autoSellEndpoint, {
			data: { ...validPayloads.autoSell.addWithoutMinSellPrice, dpm: 1 },
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongDpm);
	});

	test('Add automation - Wrong value - "dpm"', async ({ request }) => {
		const response = await request.post(autoSellEndpoint, {
			data: { ...validPayloads.autoSell.addWithoutMinSellPrice, dpm: '0xwrong' },
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongDpm);
	});

	test('Add automation - Without "position"', async ({ request }) => {
		const { position, ...payloadWithoutPosition } = validPayloads.autoSell.addWithoutMinSellPrice;

		const response = await request.post(autoSellEndpoint, {
			data: payloadWithoutPosition,
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.missingPosition);
	});

	test('Add automation - Wrong data type - "position" - string', async ({ request }) => {
		const response = await request.post(autoSellEndpoint, {
			data: { ...validPayloads.autoSell.addWithoutMinSellPrice, position: 'string' },
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongPosition_string);
	});

	test('Add automation - Wrong data type - "position" - number', async ({ request }) => {
		const response = await request.post(autoSellEndpoint, {
			data: { ...validPayloads.autoSell.addWithoutMinSellPrice, position: 1 },
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongPosition_number);
	});

	test('Add automation - Wrong data type - "position" - array', async ({ request }) => {
		const response = await request.post(autoSellEndpoint, {
			data: { ...validPayloads.autoSell.addWithoutMinSellPrice, position: [] },
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongPosition_array);
	});

	test('Add automation - Wrong data type - "position" - null', async ({ request }) => {
		const response = await request.post(autoSellEndpoint, {
			data: { ...validPayloads.autoSell.addWithoutMinSellPrice, position: null },
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongPosition_null);
	});

	test('Add automation - Without "collateral (position)"', async ({ request }) => {
		const { position, ...payloadWithoutPosition } = validPayloads.autoSell.addWithoutMinSellPrice;
		const { collateral, ...positionWithoutCollateral } = position;

		const response = await request.post(autoSellEndpoint, {
			data: { ...payloadWithoutPosition, position: positionWithoutCollateral },
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongCollateral);
	});

	test('Add automation - Wrong data type - "collateral (position)"', async ({ request }) => {
		const response = await request.post(autoSellEndpoint, {
			data: {
				...validPayloads.autoSell.addWithoutMinSellPrice,
				position: {
					...validPayloads.autoSell.addWithoutMinSellPrice.position,
					collateral: 11,
				},
			},
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongCollateral);
	});

	test('Add automation - Wrong value - "collateral (position)"', async ({ request }) => {
		const response = await request.post(autoSellEndpoint, {
			data: {
				...validPayloads.autoSell.addWithoutMinSellPrice,
				position: {
					...validPayloads.autoSell.addWithoutMinSellPrice.position,
					collateral: '0xwrong',
				},
			},
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongCollateral);
	});

	test('Add automation - Without "debt (position)"', async ({ request }) => {
		const { position, ...payloadWithoutPosition } = validPayloads.autoSell.addWithoutMinSellPrice;
		const { debt, ...positionWithoutDebt } = position;

		const response = await request.post(autoSellEndpoint, {
			data: { ...payloadWithoutPosition, position: positionWithoutDebt },
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongDebt);
	});

	test('Add automation - Wrong data type - "debt (position)"', async ({ request }) => {
		const response = await request.post(autoSellEndpoint, {
			data: {
				...validPayloads.autoSell.addWithoutMinSellPrice,
				position: {
					...validPayloads.autoSell.addWithoutMinSellPrice.position,
					debt: 11,
				},
			},
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongDebt);
	});

	test('Add automation - Wrong value - "debt (position)"', async ({ request }) => {
		const response = await request.post(autoSellEndpoint, {
			data: {
				...validPayloads.autoSell.addWithoutMinSellPrice,
				position: {
					...validPayloads.autoSell.addWithoutMinSellPrice.position,
					debt: '0xwrong',
				},
			},
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongDebt);
	});

	test('Add automation - Without "triggerData"', async ({ request }) => {
		const { triggerData, ...payloadWithoutTriggerData } =
			validPayloads.autoSell.addWithoutMinSellPrice;

		const response = await request.post(autoSellEndpoint, {
			data: payloadWithoutTriggerData,
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.missingTriggerData);
	});

	test('Add automation - Wrong data type - "triggerData" - string', async ({ request }) => {
		const response = await request.post(autoSellEndpoint, {
			data: {
				...validPayloads.autoSell.addWithoutMinSellPrice,
				triggerData: 'string',
			},
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongTriggerData_string);
	});

	test('Add automation - Wrong data type - "triggerData" - number', async ({ request }) => {
		const response = await request.post(autoSellEndpoint, {
			data: { ...validPayloads.autoSell.addWithoutMinSellPrice, triggerData: 1 },
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongTriggerData_number);
	});

	test('Add automation - Wrong data type - "triggerData" - array', async ({ request }) => {
		const response = await request.post(autoSellEndpoint, {
			data: { ...validPayloads.autoSell.addWithoutMinSellPrice, triggerData: [] },
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongTriggerData_array);
	});

	test('Add automation - Wrong data type - "triggerData" - null', async ({ request }) => {
		const response = await request.post(autoSellEndpoint, {
			data: { ...validPayloads.autoSell.addWithoutMinSellPrice, triggerData: null },
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongTriggerData_null);
	});

	test('Add automation - Without "executionLTV (triggerData)"', async ({ request }) => {
		const { triggerData, ...payloadWithoutTriggerData } =
			validPayloads.autoSell.addWithoutMinSellPrice;
		const { executionLTV, ...triggerDataWithoutExecutionLTV } = triggerData;

		const response = await request.post(autoSellEndpoint, {
			data: { ...payloadWithoutTriggerData, triggerData: triggerDataWithoutExecutionLTV },
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongExecutionLTV);
	});

	test('Add automation - Without "maxBaseFee (triggerData)"', async ({ request }) => {
		const { triggerData, ...payloadWithoutTriggerData } =
			validPayloads.autoSell.addWithoutMinSellPrice;
		const { maxBaseFee, ...triggerDataWithoutMaxBaseFee } = triggerData;

		const response = await request.post(autoSellEndpoint, {
			data: { ...payloadWithoutTriggerData, triggerData: triggerDataWithoutMaxBaseFee },
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongMaxBaseFee);
	});

	test('Add automation - Without "targetLTV (triggerData)"', async ({ request }) => {
		const { triggerData, ...payloadWithoutTriggerData } =
			validPayloads.autoSell.addWithoutMinSellPrice;
		const { targetLTV, ...triggerDataWithoutTargetLTV } = triggerData;

		const response = await request.post(autoSellEndpoint, {
			data: { ...payloadWithoutTriggerData, triggerData: triggerDataWithoutTargetLTV },
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongTargetLTV);
	});

	test('Add automation - Without "useMinSellPrice (triggerData)"', async ({ request }) => {
		const { triggerData, ...payloadWithoutTriggerData } =
			validPayloads.autoSell.addWithoutMinSellPrice;
		const { useMinSellPrice, ...triggerDataWithoutUseMinSellPrice } = triggerData;

		const response = await request.post(autoSellEndpoint, {
			data: { ...payloadWithoutTriggerData, triggerData: triggerDataWithoutUseMinSellPrice },
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongUseMinSellPrice);
	});

	test('Add automation - Trigger already exists', async ({ request }) => {
		const response = await request.post(autoSellEndpoint, {
			data: { ...validPayloadsAaveV3Base.autoSell.updateMinSellPrice, action: 'add' },
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.autoSellAlreadyExists);
	});
});
