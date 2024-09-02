import { expect, test } from '@playwright/test';
import { validPayloadsAaveV3Ethereum, responses } from 'utils/testData_APIs';

const trailingStopLossEndpoint = '/api/triggers/1/aave3/dma-trailing-stop-loss';
const validPayloads = validPayloadsAaveV3Ethereum;

test.describe('API tests - Trailing Stop-Loss - Aave V3 - Ethereum', async () => {
	// Old test wallet: 0x10649c79428d718621821Cf6299e91920284743F
	// Position link: https://staging.summer.fi/ethereum/aave/v3/multiply/ETH-USDC/1218

	test('Add automation - Close to debt - Valid payload data', async ({ request }) => {
		const response = await request.post(trailingStopLossEndpoint, {
			data: validPayloads.trailingStopLoss.closeToDebt,
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.trailingStopLoss);
	});

	test('Add automation - Close to collateral - Valid payload data', async ({ request }) => {
		const response = await request.post(trailingStopLossEndpoint, {
			data: {
				...validPayloads.trailingStopLoss.closeToDebt,
				triggerData: {
					...validPayloads.trailingStopLoss.closeToDebt.triggerData,
					token: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
				},
			},
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.trailingStopLoss);
	});

	test('Add automation - Without "dpm"', async ({ request }) => {
		const { dpm, ...payloadWithoutDpm } = validPayloads.trailingStopLoss.closeToDebt;

		const response = await request.post(trailingStopLossEndpoint, {
			data: payloadWithoutDpm,
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongDpm);
	});

	test('Add automation - Wrong data type - "dpm"', async ({ request }) => {
		const response = await request.post(trailingStopLossEndpoint, {
			data: { ...validPayloads.trailingStopLoss.closeToDebt, dpm: 1 },
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongDpm);
	});

	test('Add automation - Wrong value - "dpm"', async ({ request }) => {
		const response = await request.post(trailingStopLossEndpoint, {
			data: { ...validPayloads.trailingStopLoss.closeToDebt, dpm: '0xwrong' },
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongDpm);
	});

	test('Add automation - Without "position"', async ({ request }) => {
		const { position, ...payloadWithoutPosition } = validPayloads.trailingStopLoss.closeToDebt;

		const response = await request.post(trailingStopLossEndpoint, {
			data: payloadWithoutPosition,
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.missingPosition);
	});

	test('Add automation - Wrong data type - "position" - string', async ({ request }) => {
		const response = await request.post(trailingStopLossEndpoint, {
			data: { ...validPayloads.trailingStopLoss.closeToDebt, position: 'string' },
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongPosition_string);
	});

	test('Add automation - Wrong data type - "position" - number', async ({ request }) => {
		const response = await request.post(trailingStopLossEndpoint, {
			data: { ...validPayloads.trailingStopLoss.closeToDebt, position: 1 },
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongPosition_number);
	});

	test('Add automation - Wrong data type - "position" - array', async ({ request }) => {
		const response = await request.post(trailingStopLossEndpoint, {
			data: { ...validPayloads.trailingStopLoss.closeToDebt, position: [] },
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongPosition_array);
	});

	test('Add automation - Wrong data type - "position" - null', async ({ request }) => {
		const response = await request.post(trailingStopLossEndpoint, {
			data: { ...validPayloads.trailingStopLoss.closeToDebt, position: null },
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongPosition_null);
	});

	test('Add automation - Without "collateral (position)"', async ({ request }) => {
		const { position, ...payloadWithoutPosition } = validPayloads.trailingStopLoss.closeToDebt;
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
				...validPayloads.trailingStopLoss.closeToDebt,
				position: {
					...validPayloads.trailingStopLoss.closeToDebt.position,
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
				...validPayloads.trailingStopLoss.closeToDebt,
				position: {
					...validPayloads.trailingStopLoss.closeToDebt.position,
					collateral: '0xwrong',
				},
			},
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongCollateral);
	});

	test('Add automation - Without "debt (position)"', async ({ request }) => {
		const { position, ...payloadWithoutPosition } = validPayloads.trailingStopLoss.closeToDebt;
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
				...validPayloads.trailingStopLoss.closeToDebt,
				position: {
					...validPayloads.trailingStopLoss.closeToDebt.position,
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
				...validPayloads.trailingStopLoss.closeToDebt,
				position: {
					...validPayloads.trailingStopLoss.closeToDebt.position,
					debt: '0xwrong',
				},
			},
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongDebt);
	});

	test('Add automation - Without "triggerData"', async ({ request }) => {
		const { triggerData, ...payloadWithoutTriggerData } =
			validPayloads.trailingStopLoss.closeToDebt;

		const response = await request.post(trailingStopLossEndpoint, {
			data: payloadWithoutTriggerData,
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.missingTriggerData);
	});

	test('Add automation - Wrong data type - "triggerData" - string', async ({ request }) => {
		const response = await request.post(trailingStopLossEndpoint, {
			data: { ...validPayloads.trailingStopLoss.closeToDebt, triggerData: 'string' },
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongTriggerData_string);
	});

	test('Add automation - Wrong data type - "triggerData" - number', async ({ request }) => {
		const response = await request.post(trailingStopLossEndpoint, {
			data: { ...validPayloads.trailingStopLoss.closeToDebt, triggerData: 1 },
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongTriggerData_number);
	});

	test('Add automation - Wrong data type - "triggerData" - array', async ({ request }) => {
		const response = await request.post(trailingStopLossEndpoint, {
			data: { ...validPayloads.trailingStopLoss.closeToDebt, triggerData: [] },
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongTriggerData_array);
	});

	test('Add automation - Wrong data type - "triggerData" - null', async ({ request }) => {
		const response = await request.post(trailingStopLossEndpoint, {
			data: { ...validPayloads.trailingStopLoss.closeToDebt, triggerData: null },
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongTriggerData_null);
	});

	test('Add automation - Without "trailingDistance (triggerData)"', async ({ request }) => {
		const { triggerData, ...payloadWithoutTriggerData } =
			validPayloads.trailingStopLoss.closeToDebt;
		const { trailingDistance, ...triggerDataWithoutTrailingDistance } = triggerData;

		const response = await request.post(trailingStopLossEndpoint, {
			data: { ...payloadWithoutTriggerData, triggerData: triggerDataWithoutTrailingDistance },
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongTrailingDistance);
	});

	test('Add automation - Without "token (triggerData)"', async ({ request }) => {
		const { triggerData, ...payloadWithoutTriggerData } =
			validPayloads.trailingStopLoss.closeToDebt;
		const { token, ...triggerDataWithoutToken } = triggerData;

		const response = await request.post(trailingStopLossEndpoint, {
			data: { ...payloadWithoutTriggerData, triggerData: triggerDataWithoutToken },
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongToken);
	});
});
