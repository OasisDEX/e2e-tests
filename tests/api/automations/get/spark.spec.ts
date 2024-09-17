import { expect, test } from '@playwright/test';
import { sparkAutoSellGetResponse } from 'utils/apisTestData/automationTriggers/getResponses/sparkAutoSell';
import { sparkStopLossBuyAndProfitResponse } from 'utils/apisTestData/automationTriggers/getResponses/sparkStopLossBuyAndProfit';
import { sparkTrailingStopLossResponse } from 'utils/apisTestData/automationTriggers/getResponses/sparkTrailingStopLoss';
import { responses, getAutomationEndpoint } from 'utils/testData_APIs';

const autoSellDefaultParams = {
	chainId: 1,
	dpm: '0xb2f1349068c1cb6a596a22a3531b8062778c9da4',
	protocol: 'sparkv3',
	getDetails: true,
};

const otherAutomationsDefaultParams = {
	...autoSellDefaultParams,
	dpm: '0xce049ff57d4146d5be3a55e60ef4523bb70798b6',
};

const trailingStopLossParams = {
	...autoSellDefaultParams,
	dpm: '0xff467bc814985c6bcabef2b0a3b3c237cd9be25f',
};

test.describe('API tests - GET - Auto Sell - Spark', async () => {
	// New test wallet: 0xDDc68f9dE415ba2fE2FD84bc62Be2d2CFF1098dA
	// Position link: https://staging.summer.fi/ethereum/spark/multiply/WSTETH-DAI/2584#protection

	test('Get automation - Valid payload @regression', async ({ request }) => {
		const response = await request.get(getAutomationEndpoint, {
			params: autoSellDefaultParams,
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(sparkAutoSellGetResponse);
	});

	test('Get automation - Without "chainId"', async ({ request }) => {
		const { chainId, ...paramsWithoutChainId } = autoSellDefaultParams;

		const response = await request.get(getAutomationEndpoint, {
			params: paramsWithoutChainId,
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.missingChainIdGetRequest);
	});

	test('Get automation - Wrong data type - "chainId"', async ({ request }) => {
		const response = await request.get(getAutomationEndpoint, {
			params: { ...autoSellDefaultParams, chainId: true },
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongChainIdGetRequest);
	});

	test('Get automation - Wrong value - "chainId"', async ({ request }) => {
		const response = await request.get(getAutomationEndpoint, {
			params: { ...autoSellDefaultParams, chainId: 111111 },
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongChainIdGetRequest);
	});

	test('Get automation - Without "dpm"', async ({ request }) => {
		const { dpm, ...paramsWithoutDpm } = autoSellDefaultParams;

		const response = await request.get(getAutomationEndpoint, {
			params: paramsWithoutDpm,
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongDpmGetRequest);
	});

	test('Get automation - Wrong data type - "dpm"', async ({ request }) => {
		const response = await request.get(getAutomationEndpoint, {
			params: { ...autoSellDefaultParams, dpm: true },
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongDpmGetRequest);
	});

	test('Get automation - Wrong value - "dpm"', async ({ request }) => {
		const response = await request.get(getAutomationEndpoint, {
			params: { ...autoSellDefaultParams, dpm: '0xwrong' },
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongDpmGetRequest);
	});
});

test.describe('API tests - GET - Stop-Loss, Auto Buy and Auto Take Profit - Spark', async () => {
	// New test wallet: 0xDDc68f9dE415ba2fE2FD84bc62Be2d2CFF1098dA
	// Position link: https://staging.summer.fi/ethereum/spark/multiply/WSTETH-DAI/2637

	test('Get automation - Valid payload @regression', async ({ request }) => {
		const response = await request.get(getAutomationEndpoint, {
			params: otherAutomationsDefaultParams,
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(sparkStopLossBuyAndProfitResponse);
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

test.describe('API tests - GET - Trailing Stop-Loss - Spark', async () => {
	// New test wallet: 0xDDc68f9dE415ba2fE2FD84bc62Be2d2CFF1098dA
	// Position link: https://staging.summer.fi/ethereum/spark/multiply/ETH-DAI/2855#protection

	test('Get automation - Valid payload @regression', async ({ request }) => {
		const response = await request.get(getAutomationEndpoint, {
			params: trailingStopLossParams,
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(sparkTrailingStopLossResponse);
	});

	test('Get automation - Without "chainId"', async ({ request }) => {
		const { chainId, ...paramsWithoutChainId } = trailingStopLossParams;

		const response = await request.get(getAutomationEndpoint, {
			params: paramsWithoutChainId,
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.missingChainIdGetRequest);
	});

	test('Get automation - Wrong data type - "chainId"', async ({ request }) => {
		const response = await request.get(getAutomationEndpoint, {
			params: { ...trailingStopLossParams, chainId: true },
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongChainIdGetRequest);
	});

	test('Get automation - Wrong value - "chainId"', async ({ request }) => {
		const response = await request.get(getAutomationEndpoint, {
			params: { ...trailingStopLossParams, chainId: 111111 },
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongChainIdGetRequest);
	});

	test('Get automation - Without "dpm"', async ({ request }) => {
		const { dpm, ...paramsWithoutDpm } = trailingStopLossParams;

		const response = await request.get(getAutomationEndpoint, {
			params: paramsWithoutDpm,
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongDpmGetRequest);
	});

	test('Get automation - Wrong data type - "dpm"', async ({ request }) => {
		const response = await request.get(getAutomationEndpoint, {
			params: { ...trailingStopLossParams, dpm: true },
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongDpmGetRequest);
	});

	test('Get automation - Wrong value - "dpm"', async ({ request }) => {
		const response = await request.get(getAutomationEndpoint, {
			params: { ...trailingStopLossParams, dpm: '0xwrong' },
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongDpmGetRequest);
	});
});
