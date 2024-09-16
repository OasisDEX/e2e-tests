import { expect, test } from '@playwright/test';
import { morphoAutoSellGetResponse } from 'utils/apisTestData/automationTriggers/getResponses/morphoAutoSell';
import { morphoStopLossBuyAndProfitResponse } from 'utils/apisTestData/automationTriggers/getResponses/morphoStopLossBuyAndProfit';
import { morphoTrailingStopLossResponse } from 'utils/apisTestData/automationTriggers/getResponses/morphoTrailingStopLoss';
import { responses, getAutomationEndpoint } from 'utils/testData_APIs';

const autoSellDefaultParams = {
	chainId: 1,
	dpm: '0x2e0515d7a3ea0276f28c94c426c5d2d1d85fd4d5',
	protocol: 'morphoblue',
	poolId: '0x3a85e619751152991742810df6ec69ce473daef99e28a64ab2340d7b7ccfee49',
	getDetails: true,
};

const otherAutomationsDefaultParams = {
	...autoSellDefaultParams,
	poolId: '0xc54d7acf14de29e0e5527cabd7a576506870346a78a11a6762e2cca66322ec41',
};

const trailingStopLossParams = {
	chainId: 1,
	dpm: '0x7126e8e9c26832b441a560f4283e09f9c51ab605',
	protocol: 'morphoblue',
	poolId: '0x3a85e619751152991742810df6ec69ce473daef99e28a64ab2340d7b7ccfee49',
	getDetails: true,
};

test.describe('API tests - GET - Auto Sell - Morpho Blue - Ethereum', async () => {
	// New test wallet: 0xDDc68f9dE415ba2fE2FD84bc62Be2d2CFF1098dA
	// Position link: https://staging.summer.fi/ethereum/morphoblue/multiply/WBTC-USDC/2545#protection

	test('Get automation - Morpho Blue Ethereum', async ({ request }) => {
		const response = await request.get(getAutomationEndpoint, {
			params: autoSellDefaultParams,
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(morphoAutoSellGetResponse);
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

test.describe('API tests - GET - Stop-Loss, Auto Buy and Auto Take Profit - Morpho Blue - Ethereum', async () => {
	// New test wallet: 0xDDc68f9dE415ba2fE2FD84bc62Be2d2CFF1098dA
	// Position link: https://staging.summer.fi/ethereum/morphoblue/borrow/WSTETH-ETH-1/2545#optimization

	test('Get automation - Morpho Blue Ethereum', async ({ request }) => {
		const response = await request.get(getAutomationEndpoint, {
			params: otherAutomationsDefaultParams,
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(morphoStopLossBuyAndProfitResponse);
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

test.describe('API tests - GET - Trailing Stop-Loss - Morpho Blue - Ethereum', async () => {
	// New test wallet: 0xDDc68f9dE415ba2fE2FD84bc62Be2d2CFF1098dA
	// Position link: https://staging.summer.fi/ethereum/morphoblue/multiply/WBTC-USDC/2592#protection

	test('Get automation - Morpho Blue Ethereum', async ({ request }) => {
		const response = await request.get(getAutomationEndpoint, {
			params: trailingStopLossParams,
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(morphoTrailingStopLossResponse);
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
