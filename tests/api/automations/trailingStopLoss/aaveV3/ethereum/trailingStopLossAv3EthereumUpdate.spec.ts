import { expect, test } from '@playwright/test';
import {
	validPayloadsAaveV3Ethereum,
	responses,
	trailingStopLossResponse,
} from 'utils/testData_APIs';

const trailingStopLossEndpoint = '/api/triggers/1/aave3/dma-trailing-stop-loss';

const validPayloads = validPayloadsAaveV3Ethereum.trailingStopLoss.updateCloseToCollateral;

const validResponse = trailingStopLossResponse({
	dpm: '0x62320F403EA16a143BE7D78485d9e4674C925CC3',
	collateral: {
		decimals: 18,
		symbol: 'WETH',
		address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
		oraclesAddress: '0x5f4ec3df9cbd43714fe2740f5e3616155c5b8419',
	},
	debt: {
		decimals: 18,
		symbol: 'DAI',
		address: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
		oraclesAddress: '0xaed0c38402a5d19df6e4c03f4e2dced6e29c1ee9',
	},
	hasStablecoinDebt: true,
});

test.describe('API tests - Trailing Stop-Loss - Update - Aave V3 - Base', async () => {
	// New test wallet: 0xDDc68f9dE415ba2fE2FD84bc62Be2d2CFF1098dA
	// Position link: https://staging.summer.fi/ethereum/aave/v3/multiply/ETH-DAI/3143#overview

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
		// New test wallet: 0xDDc68f9dE415ba2fE2FD84bc62Be2d2CFF1098dA
		// Position link: https://staging.summer.fi/ethereum/aave/v3/multiply/ETH-USDC/3144#protection

		const response = await request.post(trailingStopLossEndpoint, {
			data: validPayloadsAaveV3Ethereum.trailingStopLoss.updateCloseToDebt,
		});

		const respJSON = await response.json();

		const updateCloseToDebtResponse = trailingStopLossResponse({
			dpm: '0xEd0f85DF55352394F48a68849862f8A15bDe0f8b',
			collateral: {
				decimals: 18,
				symbol: 'WETH',
				address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
				oraclesAddress: '0x5f4ec3df9cbd43714fe2740f5e3616155c5b8419',
			},
			debt: {
				decimals: 6,
				symbol: 'USDC',
				address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
				oraclesAddress: '0x8fffffd4afb6115b954bd326cbe7b4ba576818f6',
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
					trailingDistance: '130000000000',
					token: '0x6b175474e89094c44da98b954eedeac495271d0f',
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
					trailingDistance: '120000000000',
				},
			},
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(validResponse);
	});

	test('Update non-existing automation', async ({ request }) => {
		const response = await request.post(trailingStopLossEndpoint, {
			data: {
				...validPayloadsAaveV3Ethereum.trailingStopLoss.closeToDebt,
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
