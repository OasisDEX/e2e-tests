import { expect, test } from '@playwright/test';
import {
	validPayloadsAaveV3Arbitrum,
	responses,
	trailingStopLossResponse,
} from 'utils/testData_APIs';

const trailingStopLossEndpoint = '/api/triggers/42161/aave3/dma-trailing-stop-loss';

const validPayloads = validPayloadsAaveV3Arbitrum.trailingStopLoss.updateCloseToCollateral;

const validResponse = trailingStopLossResponse({
	dpm: '0x9a8999d48499743B5CA481210dc568018a3B417a',
	collateral: {
		decimals: 8,
		symbol: 'WBTC',
		address: '0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f',
		oraclesAddress: '0x6ce185860a4963106506c203335a2910413708e9',
	},
	debt: {
		decimals: 18,
		symbol: 'DAI',
		address: '0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1',
		oraclesAddress: '0xc5c8e77b397e531b8ec06bfb0048328b30e9ecfb',
	},
	hasStablecoinDebt: true,
});

test.describe('API tests - Trailing Stop-Loss - Update - Aave V3 - Arbitrum', async () => {
	// New test wallet: 0x10649c79428d718621821Cf6299e91920284743F
	// Position link: https://staging.summer.fi/arbitrum/aave/v3/multiply/WBTC-DAI/560#protection

	test('Update existing automation - Close to collateral - Valid payload data', async ({
		request,
	}) => {
		const response = await request.post(trailingStopLossEndpoint, {
			data: validPayloads,
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(validResponse);
	});

	test('Update existing automation - Close to debt - Valid payload data', async ({ request }) => {
		// New test wallet: 0x10649c79428d718621821Cf6299e91920284743F
		// Position link: https://staging.summer.fi/arbitrum/aave/v3/multiply/WBTC-USDC/370#protection

		const response = await request.post(trailingStopLossEndpoint, {
			data: validPayloadsAaveV3Arbitrum.trailingStopLoss.updateCloseToDebt,
		});

		const respJSON = await response.json();

		const updateCloseToDebtResponse = trailingStopLossResponse({
			dpm: '0x849c16eb8BDeCA1cB1Bc7e83F1B92b1926B427Ca',
			collateral: {
				decimals: 8,
				symbol: 'WBTC',
				address: '0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f',
				oraclesAddress: '0x6ce185860a4963106506c203335a2910413708e9',
			},
			debt: {
				decimals: 6,
				symbol: 'USDC',
				address: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831',
				oraclesAddress: '0x50834f3163758fcc1df9973b6e91f0f0f0434ad3',
			},
			hasStablecoinDebt: true,
		});

		expect(respJSON).toMatchObject(updateCloseToDebtResponse);
	});

	test('Update existing automation - Trailing distance - Valid payload data', async ({
		request,
	}) => {
		const response = await request.post(trailingStopLossEndpoint, {
			data: {
				...validPayloads,
				triggerData: {
					trailingDistance: '3700000000000',
					token: '0xda10009cbd5d07dd0cecc66161fc93d7c9000da1',
				},
			},
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(validResponse);
	});

	test('Update existing automation - Close to collateral and trailing distance - Valid payload data', async ({
		request,
	}) => {
		const response = await request.post(trailingStopLossEndpoint, {
			data: {
				...validPayloads,
				triggerData: {
					...validPayloads.triggerData,
					trailingDistance: '3750000000000',
				},
			},
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(validResponse);
	});

	test('Update non-existing automation', async ({ request }) => {
		const response = await request.post(trailingStopLossEndpoint, {
			data: {
				...validPayloadsAaveV3Arbitrum.trailingStopLoss.closeToDebt,
				action: 'update',
			},
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.stopLossDoesNotExist);
	});

	test('Update existing automation - Without "dpm"', async ({ request }) => {
		const { dpm, ...payloadWithoutDpm } = validPayloads;

		const response = await request.post(trailingStopLossEndpoint, {
			data: payloadWithoutDpm,
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongDpm);
	});

	test('Update existing automation - Wrong data type - "dpm"', async ({ request }) => {
		const response = await request.post(trailingStopLossEndpoint, {
			data: { ...validPayloads, dpm: 1 },
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongDpm);
	});

	test('Update existing automation - Wrong value - "dpm"', async ({ request }) => {
		const response = await request.post(trailingStopLossEndpoint, {
			data: { ...validPayloads, dpm: '0xwrong' },
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongDpm);
	});

	test('Update existing automation - Without "position"', async ({ request }) => {
		const { position, ...payloadWithoutPosition } = validPayloads;

		const response = await request.post(trailingStopLossEndpoint, {
			data: payloadWithoutPosition,
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.missingPosition);
	});

	test('Update existing automation - Wrong data type - "position" - string', async ({
		request,
	}) => {
		const response = await request.post(trailingStopLossEndpoint, {
			data: { ...validPayloads, position: 'string' },
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongPosition_string);
	});

	test('Update existing automation - Wrong data type - "position" - number', async ({
		request,
	}) => {
		const response = await request.post(trailingStopLossEndpoint, {
			data: { ...validPayloads, position: 1 },
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongPosition_number);
	});

	test('Update existing automation - Wrong data type - "position" - array', async ({ request }) => {
		const response = await request.post(trailingStopLossEndpoint, {
			data: { ...validPayloads, position: [] },
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongPosition_array);
	});

	test('Update existing automation - Wrong data type - "position" - null', async ({ request }) => {
		const response = await request.post(trailingStopLossEndpoint, {
			data: { ...validPayloads, position: null },
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongPosition_null);
	});

	test('Update existing automation - Without "collateral (position)"', async ({ request }) => {
		const { position, ...payloadWithoutPosition } = validPayloads;
		const { collateral, ...positionWithoutCollateral } = position;

		const response = await request.post(trailingStopLossEndpoint, {
			data: { ...payloadWithoutPosition, position: positionWithoutCollateral },
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongCollateral);
	});

	test('Update existing automation - Wrong data type - "collateral (position)"', async ({
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

	test('Update existing automation - Wrong value - "collateral (position)"', async ({
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

	test('Update existing automation - Without "debt (position)"', async ({ request }) => {
		const { position, ...payloadWithoutPosition } = validPayloads;
		const { debt, ...positionWithoutDebt } = position;

		const response = await request.post(trailingStopLossEndpoint, {
			data: { ...payloadWithoutPosition, position: positionWithoutDebt },
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongDebt);
	});

	test('Update existing automation - Wrong data type - "debt (position)"', async ({ request }) => {
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

	test('Update existing automation - Wrong value - "debt (position)"', async ({ request }) => {
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

	test('Update existing automation - Without "triggerData"', async ({ request }) => {
		const { triggerData, ...payloadWithoutTriggerData } = validPayloads;

		const response = await request.post(trailingStopLossEndpoint, {
			data: payloadWithoutTriggerData,
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.missingTriggerData);
	});

	test('Update existing automation - Wrong data type - "triggerData" - string', async ({
		request,
	}) => {
		const response = await request.post(trailingStopLossEndpoint, {
			data: { ...validPayloads, triggerData: 'string' },
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongTriggerData_string);
	});

	test('Update existing automation - Wrong data type - "triggerData" - number', async ({
		request,
	}) => {
		const response = await request.post(trailingStopLossEndpoint, {
			data: { ...validPayloads, triggerData: 1 },
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongTriggerData_number);
	});

	test('Update existing automation - Wrong data type - "triggerData" - array', async ({
		request,
	}) => {
		const response = await request.post(trailingStopLossEndpoint, {
			data: { ...validPayloads, triggerData: [] },
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongTriggerData_array);
	});

	test('Update existing automation - Wrong data type - "triggerData" - null', async ({
		request,
	}) => {
		const response = await request.post(trailingStopLossEndpoint, {
			data: { ...validPayloads, triggerData: null },
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongTriggerData_null);
	});

	test('Update existing automation - Without "trailingDistance (triggerData)"', async ({
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

	test('Update existing automation - Without "token (triggerData)"', async ({ request }) => {
		const { triggerData, ...payloadWithoutTriggerData } = validPayloads;
		const { token, ...triggerDataWithoutToken } = triggerData;

		const response = await request.post(trailingStopLossEndpoint, {
			data: { ...payloadWithoutTriggerData, triggerData: triggerDataWithoutToken },
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongToken);
	});
});
