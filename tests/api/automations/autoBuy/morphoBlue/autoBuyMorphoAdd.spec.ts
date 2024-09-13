import { expect, test } from '@playwright/test';
import {
	validPayloadsMorpho,
	responses,
	autoBuyWithoutMaxBuyPriceResponse,
} from 'utils/testData_APIs';

const autoBuyEndpoint = '/api/triggers/1/morphoblue/auto-buy';

const validPayloads = validPayloadsMorpho;

const validResponse = autoBuyWithoutMaxBuyPriceResponse({
	dpm: '0x302a28D7968824f386F278a72368856BC4d82BA4',
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
	executionLTV: '8200',
	targetLTV: '9300',
	targetLTVWithDeviation: ['9200', '9400'],
});

test.describe('API tests - Auto-Buy - Add - Morpho Blue - Ethereum', async () => {
	// Old test wallet: 0xbEf4befb4F230F43905313077e3824d7386E09F8
	// Position link: https://staging.summer.fi/ethereum/morphoblue/multiply/WSTETH-ETH-1/1467

	test('Add automation - Without Max Buy Price - Valid payload data @regression', async ({
		request,
	}) => {
		const response = await request.post(autoBuyEndpoint, {
			data: validPayloads.autoBuy.addWithoutMaxBuyPrice,
		});

		const respJSON = await response.json();

		// No warning for Morpho - Minor bug
		//   https://app.shortcut.com/oazo-apps/story/15553/bug-auto-buy-missing-warning-when-selecting-set-no-threshold
		expect(respJSON).toMatchObject({
			...validResponse,
			warnings: [],
		});
	});

	test('Add automation - With Max Buy Price - Valid payload data @regression', async ({
		request,
	}) => {
		const response = await request.post(autoBuyEndpoint, {
			data: {
				...validPayloads.autoBuy.addWithoutMaxBuyPrice,
				triggerData: {
					...validPayloads.autoBuy.addWithoutMaxBuyPrice.triggerData,
					maxBuyPrice: '200000000',
					useMaxBuyPrice: true,
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
		const { dpm, ...payloadWithoutDpm } = validPayloads.autoBuy.addWithoutMaxBuyPrice;

		const response = await request.post(autoBuyEndpoint, {
			data: payloadWithoutDpm,
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongDpm);
	});

	test('Add automation - Wrong data type - "dpm"', async ({ request }) => {
		const response = await request.post(autoBuyEndpoint, {
			data: { ...validPayloads.autoBuy.addWithoutMaxBuyPrice, dpm: 1 },
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongDpm);
	});

	test('Add automation - Wrong value - "dpm"', async ({ request }) => {
		const response = await request.post(autoBuyEndpoint, {
			data: { ...validPayloads.autoBuy.addWithoutMaxBuyPrice, dpm: '0xwrong' },
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongDpm);
	});

	test('Add automation - Without "position"', async ({ request }) => {
		const { position, ...payloadWithoutPosition } = validPayloads.autoBuy.addWithoutMaxBuyPrice;

		const response = await request.post(autoBuyEndpoint, {
			data: payloadWithoutPosition,
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.missingPosition);
	});

	test('Add automation - Wrong data type - "position" - string', async ({ request }) => {
		const response = await request.post(autoBuyEndpoint, {
			data: { ...validPayloads.autoBuy.addWithoutMaxBuyPrice, position: 'string' },
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongPosition_string);
	});

	test('Add automation - Wrong data type - "position" - number', async ({ request }) => {
		const response = await request.post(autoBuyEndpoint, {
			data: { ...validPayloads.autoBuy.addWithoutMaxBuyPrice, position: 1 },
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongPosition_number);
	});

	test('Add automation - Wrong data type - "position" - array', async ({ request }) => {
		const response = await request.post(autoBuyEndpoint, {
			data: { ...validPayloads.autoBuy.addWithoutMaxBuyPrice, position: [] },
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongPosition_array);
	});

	test('Add automation - Wrong data type - "position" - null', async ({ request }) => {
		const response = await request.post(autoBuyEndpoint, {
			data: { ...validPayloads.autoBuy.addWithoutMaxBuyPrice, position: null },
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongPosition_null);
	});

	test('Add automation - Without "collateral (position)"', async ({ request }) => {
		const { position, ...payloadWithoutPosition } = validPayloads.autoBuy.addWithoutMaxBuyPrice;
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
				...validPayloads.autoBuy.addWithoutMaxBuyPrice,
				position: {
					...validPayloads.autoBuy.addWithoutMaxBuyPrice.position,
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
				...validPayloads.autoBuy.addWithoutMaxBuyPrice,
				position: {
					...validPayloads.autoBuy.addWithoutMaxBuyPrice.position,
					collateral: '0xwrong',
				},
			},
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongCollateral);
	});

	test('Add automation - Without "debt (position)"', async ({ request }) => {
		const { position, ...payloadWithoutPosition } = validPayloads.autoBuy.addWithoutMaxBuyPrice;
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
				...validPayloads.autoBuy.addWithoutMaxBuyPrice,
				position: {
					...validPayloads.autoBuy.addWithoutMaxBuyPrice.position,
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
				...validPayloads.autoBuy.addWithoutMaxBuyPrice,
				position: {
					...validPayloads.autoBuy.addWithoutMaxBuyPrice.position,
					debt: '0xwrong',
				},
			},
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongDebt);
	});

	test('Add automation - Without "triggerData"', async ({ request }) => {
		const { triggerData, ...payloadWithoutTriggerData } =
			validPayloads.autoBuy.addWithoutMaxBuyPrice;

		const response = await request.post(autoBuyEndpoint, {
			data: payloadWithoutTriggerData,
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.missingTriggerData);
	});

	test('Add automation - Wrong data type - "triggerData" - string', async ({ request }) => {
		const response = await request.post(autoBuyEndpoint, {
			data: { ...validPayloads.autoBuy.addWithoutMaxBuyPrice, triggerData: 'string' },
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongTriggerData_string);
	});

	test('Add automation - Wrong data type - "triggerData" - number', async ({ request }) => {
		const response = await request.post(autoBuyEndpoint, {
			data: { ...validPayloads.autoBuy.addWithoutMaxBuyPrice, triggerData: 1 },
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongTriggerData_number);
	});

	test('Add automation - Wrong data type - "triggerData" - array', async ({ request }) => {
		const response = await request.post(autoBuyEndpoint, {
			data: { ...validPayloads.autoBuy.addWithoutMaxBuyPrice, triggerData: [] },
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongTriggerData_array);
	});

	test('Add automation - Wrong data type - "triggerData" - null', async ({ request }) => {
		const response = await request.post(autoBuyEndpoint, {
			data: { ...validPayloads.autoBuy.addWithoutMaxBuyPrice, triggerData: null },
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongTriggerData_null);
	});

	test('Add automation - Without "executionLTV (triggerData)"', async ({ request }) => {
		const { triggerData, ...payloadWithoutTriggerData } =
			validPayloads.autoBuy.addWithoutMaxBuyPrice;
		const { executionLTV, ...triggerDataWithoutExecutionLTV } = triggerData;

		const response = await request.post(autoBuyEndpoint, {
			data: { ...payloadWithoutTriggerData, triggerData: triggerDataWithoutExecutionLTV },
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongExecutionLTV);
	});

	test('Add automation - Without "maxBaseFee (triggerData)"', async ({ request }) => {
		const { triggerData, ...payloadWithoutTriggerData } =
			validPayloads.autoBuy.addWithoutMaxBuyPrice;
		const { maxBaseFee, ...triggerDataWithoutMaxBaseFee } = triggerData;

		const response = await request.post(autoBuyEndpoint, {
			data: { ...payloadWithoutTriggerData, triggerData: triggerDataWithoutMaxBaseFee },
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongMaxBaseFee);
	});

	test('Add automation - Without "targetLTV (triggerData)"', async ({ request }) => {
		const { triggerData, ...payloadWithoutTriggerData } =
			validPayloads.autoBuy.addWithoutMaxBuyPrice;
		const { targetLTV, ...triggerDataWithoutTargetLTV } = triggerData;

		const response = await request.post(autoBuyEndpoint, {
			data: { ...payloadWithoutTriggerData, triggerData: triggerDataWithoutTargetLTV },
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongTargetLTV);
	});

	test('Add automation - Without "useMaxBuyPrice (triggerData)"', async ({ request }) => {
		const { triggerData, ...payloadWithoutTriggerData } =
			validPayloads.autoBuy.addWithoutMaxBuyPrice;
		const { useMaxBuyPrice, ...triggerDataWithoutUseMaxBuyPrice } = triggerData;

		const response = await request.post(autoBuyEndpoint, {
			data: { ...payloadWithoutTriggerData, triggerData: triggerDataWithoutUseMaxBuyPrice },
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongUseMaxBuyPrice);
	});

	test('Add automation - Trigger already exists', async ({ request }) => {
		const response = await request.post(autoBuyEndpoint, {
			data: { ...validPayloadsMorpho.autoBuy.updateMaxBuyPrice, action: 'add' },
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.autoBuyAlreadyExists);
	});
});
