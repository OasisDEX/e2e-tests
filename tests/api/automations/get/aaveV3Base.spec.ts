import { expect, test } from '@playwright/test';
import { aaveV3BaseAutoSellAndBuyGetResponse } from 'utils/apisTestData/automationTriggers/getResponses/aaveV3BaseAutoSellAndBuy';
import { aaveV3BaseStopLossAndProfitGetResponse } from 'utils/apisTestData/automationTriggers/getResponses/aaveV3BaseStopLossAndProfit';
import { aaveV3BaseTrailingStopLossGetResponse } from 'utils/apisTestData/automationTriggers/getResponses/aaveV3BaseTrailingStopLoss';
import { responses, getAutomationEndpoint } from 'utils/testData_APIs';

const autoSellAndBuyDefaultParams = {
	chainId: 8453,
	account: '0x5a1f00e5a2c1bf7974688ac1e1343e66598cd526',
	protocol: 'aavev3',
	getDetails: true,
};

const stoplossAndTakeProfitDefaultParams = {
	...autoSellAndBuyDefaultParams,
	account: '0xb3287c2890ed7ea99cb4d5d899434bb64997a609',
};

const trailingStopLossDefaultParams = {
	...autoSellAndBuyDefaultParams,
	account: '0xe70c8069627a9c7933362e25f033ec0771f0f06e',
};

test.describe('API tests - GET - Auto Sell and Auto Buy - Aave V3 - Base', async () => {
	// New test wallet: 0xDDc68f9dE415ba2fE2FD84bc62Be2d2CFF1098dA
	// Position link: https://staging.summer.fi/base/aave/v3/multiply/CBETH-USDBC/588#optimization

	test('Get automation - Valid payload @regression', async ({ request }) => {
		const response = await request.get(getAutomationEndpoint, {
			params: autoSellAndBuyDefaultParams,
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(aaveV3BaseAutoSellAndBuyGetResponse);
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

// SKIP - TSL was executed; new position needed for test
test.describe.skip('API tests - GET - Trailing Stop-Loss - Aave V3 - Base', async () => {
	// New test wallet: 0xDDc68f9dE415ba2fE2FD84bc62Be2d2CFF1098dA
	// Position link: https://staging.summer.fi/base/aave/v3/multiply/ETH-USDBC/815#protection

	test('Get automation - Valid payload @regression', async ({ request }) => {
		const response = await request.get(getAutomationEndpoint, {
			params: trailingStopLossDefaultParams,
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(aaveV3BaseTrailingStopLossGetResponse);
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
