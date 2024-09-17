import { expect, test } from '@playwright/test';
import { aaveV3OptimismStopLossSellBuyAndProfitResponse } from 'utils/apisTestData/automationTriggers/getResponses/aaveV3OptimismStopLossSellBuyAndProfit';
import { aaveV3OptimismTrailingStopLossGetResponse } from 'utils/apisTestData/automationTriggers/getResponses/aaveV3OptimismTrailingStopLoss';
import { responses, getAutomationEndpoint } from 'utils/testData_APIs';

const trailingStopLossDefaultParams = {
	chainId: 10,
	dpm: '0xc213d697c81e15a2422701c653dc4b9bcad47530',
	protocol: 'aavev3',
	getDetails: true,
};

const otherAutomationsDefaultParams = {
	...trailingStopLossDefaultParams,
	dpm: '0xc4cff680a409ebbd1a73a57f1fac92065e2262d8',
};

test.describe('API tests - GET - Trailing Stop-Loss - Aave V3 - Optimism', async () => {
	// New test wallet: 0xDDc68f9dE415ba2fE2FD84bc62Be2d2CFF1098dA
	// Position link: https://staging.summer.fi/optimism/aave/v3/multiply/ETH-USDC/386#protection

	test('Get automation - Valid payload @regression', async ({ request }) => {
		const response = await request.get(getAutomationEndpoint, {
			params: trailingStopLossDefaultParams,
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(aaveV3OptimismTrailingStopLossGetResponse);
	});

	test('Get automation - Without "chainId"', async ({ request }) => {
		const { chainId, ...paramsWithoutChainId } = trailingStopLossDefaultParams;

		const response = await request.get(getAutomationEndpoint, {
			params: paramsWithoutChainId,
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.missingChainIdGetRequest);
	});

	test('Get automation - Wrong data type - "chainId"', async ({ request }) => {
		const response = await request.get(getAutomationEndpoint, {
			params: { ...trailingStopLossDefaultParams, chainId: true },
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongChainIdGetRequest);
	});

	test('Get automation - Wrong value - "chainId"', async ({ request }) => {
		const response = await request.get(getAutomationEndpoint, {
			params: { ...trailingStopLossDefaultParams, chainId: 111111 },
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongChainIdGetRequest);
	});

	test('Get automation - Without "dpm"', async ({ request }) => {
		const { dpm, ...paramsWithoutDpm } = trailingStopLossDefaultParams;

		const response = await request.get(getAutomationEndpoint, {
			params: paramsWithoutDpm,
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongDpmGetRequest);
	});

	test('Get automation - Wrong data type - "dpm"', async ({ request }) => {
		const response = await request.get(getAutomationEndpoint, {
			params: { ...trailingStopLossDefaultParams, dpm: true },
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongDpmGetRequest);
	});

	test('Get automation - Wrong value - "dpm"', async ({ request }) => {
		const response = await request.get(getAutomationEndpoint, {
			params: { ...trailingStopLossDefaultParams, dpm: '0xwrong' },
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongDpmGetRequest);
	});
});

test.describe('API tests - GET - Stop-Loss, Auto Sell, Auto Take Profit and Auto Buy - Aave V3 - Optimism', async () => {
	// New test wallet: 0xDDc68f9dE415ba2fE2FD84bc62Be2d2CFF1098dA
	// Position link: https://staging.summer.fi/optimism/aave/v3/multiply/ETH-USDC/355#protection

	test('Get automation - Valid payload @regression', async ({ request }) => {
		const response = await request.get(getAutomationEndpoint, {
			params: otherAutomationsDefaultParams,
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(aaveV3OptimismStopLossSellBuyAndProfitResponse);
	});

	test('Get automation - Without "chainId"', async ({ request }) => {
		const { chainId, ...paramsWithoutChainId } = otherAutomationsDefaultParams;

		const response = await request.get(getAutomationEndpoint, {
			params: paramsWithoutChainId,
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.missingChainIdGetRequest);
	});

	test('Get automation - Wrong data type - "chainId"', async ({ request }) => {
		const response = await request.get(getAutomationEndpoint, {
			params: { ...otherAutomationsDefaultParams, chainId: true },
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongChainIdGetRequest);
	});

	test('Get automation - Wrong value - "chainId"', async ({ request }) => {
		const response = await request.get(getAutomationEndpoint, {
			params: { ...otherAutomationsDefaultParams, chainId: 111111 },
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongChainIdGetRequest);
	});

	test('Get automation - Without "dpm"', async ({ request }) => {
		const { dpm, ...paramsWithoutDpm } = otherAutomationsDefaultParams;

		const response = await request.get(getAutomationEndpoint, {
			params: paramsWithoutDpm,
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongDpmGetRequest);
	});

	test('Get automation - Wrong data type - "dpm"', async ({ request }) => {
		const response = await request.get(getAutomationEndpoint, {
			params: { ...otherAutomationsDefaultParams, dpm: true },
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongDpmGetRequest);
	});

	test('Get automation - Wrong value - "dpm"', async ({ request }) => {
		const response = await request.get(getAutomationEndpoint, {
			params: { ...otherAutomationsDefaultParams, dpm: '0xwrong' },
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongDpmGetRequest);
	});
});
