import { test } from '@playwright/test';
import { compareTokenSwapRate } from 'tests/sharedTestSteps/compareTokenSwapRate';
import { aaveV3EthereumEarnPools_1 } from 'utils/testData';

aaveV3EthereumEarnPools_1.forEach((pool) => {
	test.describe('Aave V3 Earn - Token Swap Rate', async () => {
		await compareTokenSwapRate({
			network: 'ethereum',
			protocol: 'aave/v3',
			pool,
			positionType: 'multiply',
		});
	});
});
