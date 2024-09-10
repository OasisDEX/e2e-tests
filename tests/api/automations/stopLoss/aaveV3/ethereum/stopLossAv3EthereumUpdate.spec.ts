import { expect, test } from '@playwright/test';
import { validPayloadsAaveV3Ethereum, responses } from 'utils/testData_APIs';

const stopLossEndpoint = '/api/triggers/1/aave3/dma-stop-loss';
const validPayloads = validPayloadsAaveV3Ethereum.stopLoss.updateCloseToCollateral;

test.describe('API tests - Stop-Loss - Update - Aave V3 - Ethereum', async () => {
	// Very old test wallet: 0x10649c79428d718621821Cf6299e91920284743F
	// Position link: https://staging.summer.fi/ethereum/aave/v3/multiply/RETH-DAI/1276#protection

	test('Update automation - Close to collateral - Valid payload data', async ({ request }) => {
		const response = await request.post(stopLossEndpoint, {
			data: validPayloads,
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject({
			...responses.stopLoss,
			transaction: {
				...responses.stopLoss.transaction,
				to: '0x6Bb713b56e73A115164b4B56ea1f5A76640c4D19',
			},
		});
	});

	test('Update automation - executionLTV - Valid payload data', async ({ request }) => {
		const response = await request.post(stopLossEndpoint, {
			data: {
				...validPayloads,
				triggerData: { executionLTV: '7000', token: '0x6b175474e89094c44da98b954eedeac495271d0f' },
			},
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject({
			...responses.stopLoss,
			transaction: {
				...responses.stopLoss.transaction,
				to: '0x6Bb713b56e73A115164b4B56ea1f5A76640c4D19',
			},
		});
	});

	test('Update automation - Close to collateral & executionLTV - Valid payload data', async ({
		request,
	}) => {
		const response = await request.post(stopLossEndpoint, {
			data: {
				...validPayloads,
				triggerData: { executionLTV: '7100', token: '0x6b175474e89094c44da98b954eedeac495271d0f' },
			},
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject({
			...responses.stopLoss,
			transaction: {
				...responses.stopLoss.transaction,
				to: '0x6Bb713b56e73A115164b4B56ea1f5A76640c4D19',
			},
		});
	});

	test('Update automation - Close to debt - Valid payload data', async ({ request }) => {
		// Old test wallet: 0xbEf4befb4F230F43905313077e3824d7386E09F8
		// Position link: https://staging.summer.fi/ethereum/aave/v3/multiply/ETH-USDC/1586#protection
		const response = await request.post(stopLossEndpoint, {
			data: validPayloadsAaveV3Ethereum.stopLoss.updateCloseToDebt,
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject({
			...responses.stopLoss,
			transaction: {
				...responses.stopLoss.transaction,
				to: '0xB727afF37C480a0FDbA8a6c97fC4FcF3A19f2ac7',
			},
		});
	});

	test('Update non-existing automation', async ({ request }) => {
		const response = await request.post(stopLossEndpoint, {
			data: {
				...validPayloadsAaveV3Ethereum.stopLoss.closeToDebt,
				action: 'update',
			},
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.stopLossDoesNotExist);
	});

	test('Update automation - Without "dpm"', async ({ request }) => {
		const { dpm, ...payloadWithoutDpm } = validPayloads;

		const response = await request.post(stopLossEndpoint, {
			data: payloadWithoutDpm,
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongDpm);
	});

	test('Update automation - Wrong data type - "dpm"', async ({ request }) => {
		const response = await request.post(stopLossEndpoint, {
			data: { ...validPayloads, dpm: 1 },
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongDpm);
	});

	test('Update automation - Wrong value - "dpm"', async ({ request }) => {
		const response = await request.post(stopLossEndpoint, {
			data: { ...validPayloads, dpm: '0xwrong' },
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongDpm);
	});

	test('Update automation - Without "position"', async ({ request }) => {
		const { position, ...payloadWithoutPosition } = validPayloads;

		const response = await request.post(stopLossEndpoint, {
			data: payloadWithoutPosition,
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.missingPosition);
	});

	test('Update automation - Wrong data type - "position" - string', async ({ request }) => {
		const response = await request.post(stopLossEndpoint, {
			data: { ...validPayloads, position: 'string' },
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongPosition_string);
	});

	test('Update automation - Wrong data type - "position" - number', async ({ request }) => {
		const response = await request.post(stopLossEndpoint, {
			data: { ...validPayloads, position: 1 },
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongPosition_number);
	});

	test('Update automation - Wrong data type - "position" - array', async ({ request }) => {
		const response = await request.post(stopLossEndpoint, {
			data: { ...validPayloads, position: [] },
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongPosition_array);
	});

	test('Update automation - Wrong data type - "position" - null', async ({ request }) => {
		const response = await request.post(stopLossEndpoint, {
			data: { ...validPayloads, position: null },
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongPosition_null);
	});

	test('Update automation - Without "collateral (position)"', async ({ request }) => {
		const { position, ...payloadWithoutPosition } = validPayloads;
		const { collateral, ...positionWithoutCollateral } = position;

		const response = await request.post(stopLossEndpoint, {
			data: { ...payloadWithoutPosition, position: positionWithoutCollateral },
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongCollateral);
	});

	test('Update automation - Wrong data type - "collateral (position)"', async ({ request }) => {
		const response = await request.post(stopLossEndpoint, {
			data: {
				...validPayloads,
				position: { ...validPayloads.position, collateral: 11 },
			},
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongCollateral);
	});

	test('Update automation - Wrong value - "collateral (position)"', async ({ request }) => {
		const response = await request.post(stopLossEndpoint, {
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

		const response = await request.post(stopLossEndpoint, {
			data: { ...payloadWithoutPosition, position: positionWithoutDebt },
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongDebt);
	});

	test('Update automation - Wrong data type - "debt (position)"', async ({ request }) => {
		const response = await request.post(stopLossEndpoint, {
			data: {
				...validPayloads,
				position: { ...validPayloads.position, debt: 11 },
			},
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongDebt);
	});

	test('Update automation - Wrong value - "debt (position)"', async ({ request }) => {
		const response = await request.post(stopLossEndpoint, {
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

		const response = await request.post(stopLossEndpoint, {
			data: payloadWithoutTriggerData,
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongTriggerDataStopLoss);
	});

	test('Update automation - Wrong data type - "triggerData" - string', async ({ request }) => {
		const response = await request.post(stopLossEndpoint, {
			data: { ...validPayloads, triggerData: 'string' },
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongTriggerDataStopLoss);
	});

	test('Update automation - Wrong data type - "triggerData" - number', async ({ request }) => {
		const response = await request.post(stopLossEndpoint, {
			data: { ...validPayloads, triggerData: 1 },
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongTriggerDataStopLoss);
	});

	test('Update automation - Wrong data type - "triggerData" - array', async ({ request }) => {
		const response = await request.post(stopLossEndpoint, {
			data: { ...validPayloads, triggerData: [] },
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongTriggerDataStopLoss);
	});

	test('Update automation - Wrong data type - "triggerData" - null', async ({ request }) => {
		const response = await request.post(stopLossEndpoint, {
			data: { ...validPayloads, triggerData: null },
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongTriggerDataStopLoss);
	});

	test('Update automation - Without "executionLTV (triggerData)"', async ({ request }) => {
		const { triggerData, ...payloadWithoutTriggerData } = validPayloads;
		const { executionLTV, ...triggerDataWithoutExecutionLTV } = triggerData;

		const response = await request.post(stopLossEndpoint, {
			data: { ...payloadWithoutTriggerData, triggerData: triggerDataWithoutExecutionLTV },
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongTriggerDataStopLoss);
	});

	test('Update automation - Without "token (triggerData)"', async ({ request }) => {
		const { triggerData, ...payloadWithoutTriggerData } = validPayloads;
		const { token, ...triggerDataWithoutToken } = triggerData;

		const response = await request.post(stopLossEndpoint, {
			data: { ...payloadWithoutTriggerData, triggerData: triggerDataWithoutToken },
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongTriggerDataStopLoss);
	});
});
