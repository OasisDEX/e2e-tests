import { expect, test } from '@playwright/test';
import { validPayloadsAaveV3Base, responses, autoTakeProfitResponse } from 'utils/testData_APIs';

const autoTakeProfit = '/api/triggers/8453/aave3/dma-partial-take-profit';

const validPayloads = validPayloadsAaveV3Base.autoTakeProfit.updateProfitInCollateral;

const validResponse = autoTakeProfitResponse({
	dpm: '0xb3287c2890Ed7EA99Cb4d5D899434bB64997a609',
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
});

test.describe('API tests - Auto Take Profit - Update - Aave V3 - Base', async () => {
	// New test wallet: 0xDDc68f9dE415ba2fE2FD84bc62Be2d2CFF1098dA
	// Position link: https://staging.summer.fi/base/aave/v3/borrow/ETH-USDC/677#optimization

	// TODO - Update with another position - preferably in one of the old wallets
	test.skip('Update existing automation - Profit in collateral - Valid payload data', async ({
		request,
	}) => {
		const response = await request.post(autoTakeProfit, {
			data: validPayloads,
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(validResponse);
	});

	test('Update existing automation - Profit in debt - Valid payload data', async ({ request }) => {
		// New test wallet: 0xDDc68f9dE415ba2fE2FD84bc62Be2d2CFF1098dA
		// Position link: https://staging.summer.fi/base/aave/v3/multiply/ETH-USDC/500#protection

		const response = await request.post(autoTakeProfit, {
			data: validPayloadsAaveV3Base.autoTakeProfit.updateProfitInDebt,
		});

		const respJSON = await response.json();

		const debtResponse = autoTakeProfitResponse({
			dpm: '0x20e74013d82fea853AfCa3b4CB1Fd9C2B105F55a',
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
		});

		expect(respJSON).toMatchObject(debtResponse);
	});

	// TODO - Update with another position - preferably in one of the old wallets
	test.skip('Update existing automation - executionPrice - Valid payload data', async ({
		request,
	}) => {
		const response = await request.post(autoTakeProfit, {
			data: {
				...validPayloads,
				triggerData: {
					...validPayloads.triggerData,
					withdrawToken: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
					executionPrice: '8000000000000',
				},
			},
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(validResponse);
	});

	// TODO - Update with another position - preferably in one of the old wallets
	test.skip('Update existing automation - executionLTV - Valid payload data', async ({
		request,
	}) => {
		const response = await request.post(autoTakeProfit, {
			data: {
				...validPayloads,
				triggerData: {
					...validPayloads.triggerData,
					withdrawToken: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
					executionLTV: '2000',
				},
			},
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(validResponse);
	});

	// TODO - Update with another position - preferably in one of the old wallets
	test.skip('Update existing automation - withdrawStep - Valid payload data', async ({
		request,
	}) => {
		const response = await request.post(autoTakeProfit, {
			data: {
				...validPayloads,
				triggerData: {
					...validPayloads.triggerData,
					withdrawToken: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
					withdrawStep: '800',
				},
			},
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(validResponse);
	});

	// TODO - Update with another position - preferably in one of the old wallets
	test.skip('Update existing automation - profit in collateral, executionPrice, executionLTV and withdrawStep - Valid payload data', async ({
		request,
	}) => {
		const response = await request.post(autoTakeProfit, {
			data: {
				...validPayloads,
				triggerData: {
					...validPayloads.triggerData,
					executionPrice: '9500000000000',
					executionLTV: '1100',
					withdrawStep: '600',
				},
			},
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(validResponse);
	});

	test('Update non-existing automation', async ({ request }) => {
		const response = await request.post(autoTakeProfit, {
			data: {
				...validPayloadsAaveV3Base.autoTakeProfit.profitInDebt,
				action: 'update',
			},
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.autoTakeProfitDoesNotExist);
	});

	test('Update existing automation - Without "dpm"', async ({ request }) => {
		const { dpm, ...payloadWithoutDpm } = validPayloads;

		const response = await request.post(autoTakeProfit, {
			data: payloadWithoutDpm,
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongDpm);
	});

	test('Update existing automation - Wrong data type - "dpm"', async ({ request }) => {
		const response = await request.post(autoTakeProfit, {
			data: { ...validPayloads, dpm: 1 },
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongDpm);
	});

	test('Update existing automation - Wrong value - "dpm"', async ({ request }) => {
		const response = await request.post(autoTakeProfit, {
			data: { ...validPayloads, dpm: '0xwrong' },
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongDpm);
	});

	test('Update existing automation - Without "position"', async ({ request }) => {
		const { position, ...payloadWithoutPosition } = validPayloads;

		const response = await request.post(autoTakeProfit, {
			data: payloadWithoutPosition,
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.missingPosition);
	});

	test('Update existing automation - Wrong data type - "position" - string', async ({
		request,
	}) => {
		const response = await request.post(autoTakeProfit, {
			data: { ...validPayloads, position: 'string' },
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongPosition_string);
	});

	test('Update existing automation - Wrong data type - "position" - number', async ({
		request,
	}) => {
		const response = await request.post(autoTakeProfit, {
			data: { ...validPayloads, position: 1 },
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongPosition_number);
	});

	test('Update existing automation - Wrong data type - "position" - array', async ({ request }) => {
		const response = await request.post(autoTakeProfit, {
			data: { ...validPayloads, position: [] },
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongPosition_array);
	});

	test('Update existing automation - Wrong data type - "position" - null', async ({ request }) => {
		const response = await request.post(autoTakeProfit, {
			data: { ...validPayloads, position: null },
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongPosition_null);
	});

	test('Update existing automation - Without "collateral (position)"', async ({ request }) => {
		const { position, ...payloadWithoutPosition } = validPayloads;
		const { collateral, ...positionWithoutCollateral } = position;

		const response = await request.post(autoTakeProfit, {
			data: { ...payloadWithoutPosition, position: positionWithoutCollateral },
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongCollateral);
	});

	test('Update existing automation - Wrong data type - "collateral (position)"', async ({
		request,
	}) => {
		const response = await request.post(autoTakeProfit, {
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
		const response = await request.post(autoTakeProfit, {
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

		const response = await request.post(autoTakeProfit, {
			data: { ...payloadWithoutPosition, position: positionWithoutDebt },
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongDebt);
	});

	test('Update existing automation - Wrong data type - "debt (position)"', async ({ request }) => {
		const response = await request.post(autoTakeProfit, {
			data: {
				...validPayloads,
				position: { ...validPayloads.position, debt: 11 },
			},
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongDebt);
	});

	test('Update existing automation - Wrong value - "debt (position)"', async ({ request }) => {
		const response = await request.post(autoTakeProfit, {
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

		const response = await request.post(autoTakeProfit, {
			data: payloadWithoutTriggerData,
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.missingTriggerData);
	});

	test('Update existing automation - Wrong data type - "triggerData" - string', async ({
		request,
	}) => {
		const response = await request.post(autoTakeProfit, {
			data: { ...validPayloads, triggerData: 'string' },
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongTriggerData_string);
	});

	test('Update existing automation - Wrong data type - "triggerData" - number', async ({
		request,
	}) => {
		const response = await request.post(autoTakeProfit, {
			data: { ...validPayloads, triggerData: 1 },
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongTriggerData_number);
	});

	test('Update existing automation - Wrong data type - "triggerData" - array', async ({
		request,
	}) => {
		const response = await request.post(autoTakeProfit, {
			data: { ...validPayloads, triggerData: [] },
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongTriggerData_array);
	});

	test('Update existing automation - Wrong data type - "triggerData" - null', async ({
		request,
	}) => {
		const response = await request.post(autoTakeProfit, {
			data: { ...validPayloads, triggerData: null },
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongTriggerData_null);
	});

	test('Update existing automation - Without "executionLTV (triggerData)"', async ({ request }) => {
		const { triggerData, ...payloadWithoutTriggerData } = validPayloads;
		const { executionLTV, ...triggerDataWithoutExecutionLTV } = triggerData;

		const response = await request.post(autoTakeProfit, {
			data: { ...payloadWithoutTriggerData, triggerData: triggerDataWithoutExecutionLTV },
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongExecutionLTV);
	});

	test('Update existing automation - Without "executionPrice (triggerData)"', async ({
		request,
	}) => {
		const { triggerData, ...payloadWithoutTriggerData } = validPayloads;
		const { executionPrice, ...triggerDataWithoutExecutionPrice } = triggerData;

		const response = await request.post(autoTakeProfit, {
			data: { ...payloadWithoutTriggerData, triggerData: triggerDataWithoutExecutionPrice },
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongExecutionPrice);
	});

	test('Update existing automation - Without "withdrawToken (triggerData)"', async ({
		request,
	}) => {
		const { triggerData, ...payloadWithoutTriggerData } = validPayloads;
		const { withdrawToken, ...triggerDataWithoutWithdrawToken } = triggerData;

		const response = await request.post(autoTakeProfit, {
			data: { ...payloadWithoutTriggerData, triggerData: triggerDataWithoutWithdrawToken },
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongWithdrawToken);
	});

	test('Update existing automation - Without "withdrawStep (triggerData)"', async ({ request }) => {
		const { triggerData, ...payloadWithoutTriggerData } = validPayloads;
		const { withdrawStep, ...triggerDataWithoutWithdrawStep } = triggerData;

		const response = await request.post(autoTakeProfit, {
			data: { ...payloadWithoutTriggerData, triggerData: triggerDataWithoutWithdrawStep },
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongWithdrawStep);
	});

	// TO BE DONE - More negative scenarios for missing attribues in 'triggerData > StopLoss'
});
