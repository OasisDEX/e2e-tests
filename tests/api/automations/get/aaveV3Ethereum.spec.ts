import { expect, test } from '@playwright/test';
import { aaveV3EthereumAutoBuyGetResponse } from 'utils/apisTestData/automationTriggers/getResponses/aaveV3EthereumAutoBuy';
import { aaveV3EthereumAutoSellGetResponse } from 'utils/apisTestData/automationTriggers/getResponses/aaveV3EthereumAutoSell';
import { aaveV3EthereumStopLossAndProfitResponse } from 'utils/apisTestData/automationTriggers/getResponses/aaveV3EthereumStopLossAndProfit';
import { aaveV3EthereumTrailingStopLossResponse } from 'utils/apisTestData/automationTriggers/getResponses/aaveV3EthereumTrailingStopLoss';
import { responses, getAutomationEndpoint } from 'utils/testData_APIs';

const autoSellDefaultParams = {
	chainId: 1,
	account: '0xb42d970a6424583618d0013e0d6ebb039dd1c945',
	protocol: 'aavev3',
	getDetails: true,
};

const autoBuyDefaultParams = {
	...autoSellDefaultParams,
	account: '0x551eb8395093fde4b9eef017c93593a3c7a75138',
};

const stoplossAndTakeProfitDefaultParams = {
	...autoSellDefaultParams,
	account: '0xb727aff37c480a0fdba8a6c97fc4fcf3a19f2ac7',
};

const trailingStopLossDefaultParams = {
	...autoSellDefaultParams,
	account: '0x62320f403ea16a143be7d78485d9e4674c925cc3',
};

test.describe('API tests - GET - Auto Sell - Aave V3 - Ethereum', async () => {
	// New test wallet: 0xDDc68f9dE415ba2fE2FD84bc62Be2d2CFF1098dA
	// Position link: https://staging.summer.fi/ethereum/aave/v3/multiply/ETH-GHO/2737#protection

	test('Get automation - Valid payload @regression', async ({ request }) => {
		const response = await request.get(getAutomationEndpoint, {
			params: autoSellDefaultParams,
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(aaveV3EthereumAutoSellGetResponse);
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

	test('Get automation - Without "account"', async ({ request }) => {
		const { account, ...paramsWithoutAccount } = autoSellDefaultParams;

		const response = await request.get(getAutomationEndpoint, {
			params: paramsWithoutAccount,
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongAccountGetRequest);
	});

	test('Get automation - Wrong data type - "account"', async ({ request }) => {
		const response = await request.get(getAutomationEndpoint, {
			params: { ...autoSellDefaultParams, account: true },
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongAccountGetRequest);
	});

	test('Get automation - Wrong value - "account"', async ({ request }) => {
		const response = await request.get(getAutomationEndpoint, {
			params: { ...autoSellDefaultParams, account: '0xwrong' },
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongAccountGetRequest);
	});
});

test.describe('API tests - GET - Auto Buy - Aave V3 - Ethereum', async () => {
	// Old test wallet: 0xbEf4befb4F230F43905313077e3824d7386E09F8
	// Position link: https://staging.summer.fi/ethereum/aave/v3/multiply/ETH-DAI/1670#optimization

	test('Get automation - Valid payload @regression', async ({ request }) => {
		const response = await request.get(getAutomationEndpoint, {
			params: autoBuyDefaultParams,
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(aaveV3EthereumAutoBuyGetResponse);
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

	test('Get automation - Without "account"', async ({ request }) => {
		const { account, ...paramsWithoutAccount } = autoSellDefaultParams;

		const response = await request.get(getAutomationEndpoint, {
			params: paramsWithoutAccount,
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongAccountGetRequest);
	});

	test('Get automation - Wrong data type - "account"', async ({ request }) => {
		const response = await request.get(getAutomationEndpoint, {
			params: { ...autoSellDefaultParams, account: true },
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongAccountGetRequest);
	});

	test('Get automation - Wrong value - "account"', async ({ request }) => {
		const response = await request.get(getAutomationEndpoint, {
			params: { ...autoSellDefaultParams, account: '0xwrong' },
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(responses.wrongAccountGetRequest);
	});
});

// SKIP - Stop-Loss executed - New position needed for tests
test.describe.skip(
	'API tests - GET - Stop-Loss and Auto Take Profit - Aave V3 - Ethereum',
	async () => {
		// Old test wallet: 0xbEf4befb4F230F43905313077e3824d7386E09F8
		// Position link: https://staging.summer.fi/ethereum/aave/v3/multiply/ETH-USDC/1586#optimization

		test('Get automation - Valid payload @regression', async ({ request }) => {
			const response = await request.get(getAutomationEndpoint, {
				params: stoplossAndTakeProfitDefaultParams,
			});

			const respJSON = await response.json();

			expect(respJSON).toMatchObject(aaveV3EthereumStopLossAndProfitResponse);
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
	}
);

// SKIP - Test to be reviewed
test.describe.skip('API tests - GET - Trailing Stop-Loss - Aave V3 - Ethereum', async () => {
	// New test wallet: 0xDDc68f9dE415ba2fE2FD84bc62Be2d2CFF1098dA
	// Position link: https://staging.summer.fi/ethereum/aave/v3/multiply/ETH-DAI/3143#overview

	test('Get automation - Valid payload @regression', async ({ request }) => {
		const response = await request.get(getAutomationEndpoint, {
			params: trailingStopLossDefaultParams,
		});

		const respJSON = await response.json();

		expect(respJSON).toMatchObject(aaveV3EthereumTrailingStopLossResponse);
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
