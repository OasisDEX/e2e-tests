import { expect, test } from '@playwright/test';
import { aaveV3ArbitrumAutoSellAndBuyGetResponse } from 'utils/apisTestData/automationTriggers/getResponses/aaveV3ArbitrumAutoSellAndBuy';
import { aaveV3ArbitrumStopLossAndProfitGetResponse } from 'utils/apisTestData/automationTriggers/getResponses/aaveV3ArbitrumStopLossAndProfit';
import { aaveV3ArbitrumTrailingStopLossGetResponse } from 'utils/apisTestData/automationTriggers/getResponses/aaveV3ArbitrumTrailingStopLoss';
import { responses, getAutomationEndpoint } from 'utils/testData_APIs';

const autoSellAndBuyDefaultParams = {
	chainId: 42161,
	account: '0x1816c0d0b0a42b9118a53c2f6d0a305ed54ea74c',
	protocol: 'aavev3',
	getDetails: true,
};

const stoplossAndTakeProfitDefaultParams = {
	...autoSellAndBuyDefaultParams,
	account: '0x5658e378371809d1aef8749ebad8d161cd90d33c',
};

const trailingStopLossDefaultParams = {
	...autoSellAndBuyDefaultParams,
	account: '0x9a8999d48499743b5ca481210dc568018a3b417a',
};

test.describe('API tests - GET - Auto Sell and Auto Buy - Aave V3 - Arbitrum', async () => {
	// New test wallet: 0xDDc68f9dE415ba2fE2FD84bc62Be2d2CFF1098dA
	// Position link: https://staging.summer.fi/arbitrum/aave/v3/multiply/WSTETH-USDC/351#protection

	test('Get automation - Valid payload @regression', async ({ request }) => {
		const response = await request.get(getAutomationEndpoint, {
			params: autoSellAndBuyDefaultParams,
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(aaveV3ArbitrumAutoSellAndBuyGetResponse);
	});

	test('Get automation - Without "chainId"', async ({ request }) => {
		const { chainId, ...paramsWithoutChainId } = autoSellAndBuyDefaultParams;

		const response = await request.get(getAutomationEndpoint, {
			params: paramsWithoutChainId,
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.missingChainIdGetRequest);
	});

	test('Get automation - Wrong data type - "chainId"', async ({ request }) => {
		const response = await request.get(getAutomationEndpoint, {
			params: { ...autoSellAndBuyDefaultParams, chainId: true },
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongChainIdGetRequest);
	});

	test('Get automation - Wrong value - "chainId"', async ({ request }) => {
		const response = await request.get(getAutomationEndpoint, {
			params: { ...autoSellAndBuyDefaultParams, chainId: 111111 },
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongChainIdGetRequest);
	});

	test('Get automation - Without "account"', async ({ request }) => {
		const { account, ...paramsWithoutAccount } = autoSellAndBuyDefaultParams;

		const response = await request.get(getAutomationEndpoint, {
			params: paramsWithoutAccount,
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongAccountGetRequest);
	});

	test('Get automation - Wrong data type - "account"', async ({ request }) => {
		const response = await request.get(getAutomationEndpoint, {
			params: { ...autoSellAndBuyDefaultParams, account: true },
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongAccountGetRequest);
	});

	test('Get automation - Wrong value - "account"', async ({ request }) => {
		const response = await request.get(getAutomationEndpoint, {
			params: { ...autoSellAndBuyDefaultParams, account: '0xwrong' },
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongAccountGetRequest);
	});
});

test.describe('API tests - GET - Stop-Loss and Auto Take Profit - Aave V3 - Arbitrum', async () => {
	// Old test wallet: 0xDDc68f9dE415ba2fE2FD84bc62Be2d2CFF1098dA
	// Position link: https://staging.summer.fi/arbitrum/aave/v3/multiply/ETH-DAI/352#protection

	test('Get automation - Valid payload @regression', async ({ request }) => {
		const response = await request.get(getAutomationEndpoint, {
			params: stoplossAndTakeProfitDefaultParams,
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(aaveV3ArbitrumStopLossAndProfitGetResponse);
	});

	test('Get automation - Without "chainId"', async ({ request }) => {
		const { chainId, ...paramsWithoutChainId } = stoplossAndTakeProfitDefaultParams;

		const response = await request.get(getAutomationEndpoint, {
			params: paramsWithoutChainId,
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.missingChainIdGetRequest);
	});

	test('Get automation - Wrong data type - "chainId"', async ({ request }) => {
		const response = await request.get(getAutomationEndpoint, {
			params: { ...stoplossAndTakeProfitDefaultParams, chainId: true },
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongChainIdGetRequest);
	});

	test('Get automation - Wrong value - "chainId"', async ({ request }) => {
		const response = await request.get(getAutomationEndpoint, {
			params: { ...stoplossAndTakeProfitDefaultParams, chainId: 111111 },
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongChainIdGetRequest);
	});

	test('Get automation - Without "account"', async ({ request }) => {
		const { account, ...paramsWithoutAccount } = stoplossAndTakeProfitDefaultParams;

		const response = await request.get(getAutomationEndpoint, {
			params: paramsWithoutAccount,
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongAccountGetRequest);
	});

	test('Get automation - Wrong data type - "account"', async ({ request }) => {
		const response = await request.get(getAutomationEndpoint, {
			params: { ...stoplossAndTakeProfitDefaultParams, account: true },
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongAccountGetRequest);
	});

	test('Get automation - Wrong value - "account"', async ({ request }) => {
		const response = await request.get(getAutomationEndpoint, {
			params: { ...stoplossAndTakeProfitDefaultParams, account: '0xwrong' },
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongAccountGetRequest);
	});
});

test.describe('API tests - GET - Trailing Stop-Loss - Aave V3 - Arbitrum', async () => {
	// New test wallet: 0xDDc68f9dE415ba2fE2FD84bc62Be2d2CFF1098dA
	// Position link: https://staging.summer.fi/arbitrum/aave/v3/multiply/WBTC-DAI/560#protection

	test('Get automation - Valid payload @regression', async ({ request }) => {
		const response = await request.get(getAutomationEndpoint, {
			params: trailingStopLossDefaultParams,
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(aaveV3ArbitrumTrailingStopLossGetResponse);
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

	test('Get automation - Without "account"', async ({ request }) => {
		const { account, ...paramsWithoutAccount } = trailingStopLossDefaultParams;

		const response = await request.get(getAutomationEndpoint, {
			params: paramsWithoutAccount,
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongAccountGetRequest);
	});

	test('Get automation - Wrong data type - "account"', async ({ request }) => {
		const response = await request.get(getAutomationEndpoint, {
			params: { ...trailingStopLossDefaultParams, account: true },
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongAccountGetRequest);
	});

	test('Get automation - Wrong value - "account"', async ({ request }) => {
		const response = await request.get(getAutomationEndpoint, {
			params: { ...trailingStopLossDefaultParams, account: '0xwrong' },
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongAccountGetRequest);
	});
});
