import { test } from '@playwright/test';
import { compareTokenSwapRate } from 'tests/sharedTestSteps/compareTokenSwapRate';
import { aaveV3EthereumMultiplyPools_1 } from 'utils/testData';

// 1INCH API KEY - Facila/ID verification needed
aaveV3EthereumMultiplyPools_1.forEach((pool) => {
	test.describe.skip('Aave V3 Multiply - Token Swap Rate', async () => {
		await compareTokenSwapRate({
			network: 'ethereum',
			protocol: 'aave/v3',
			pool,
			positionType: 'multiply',
		});
	});
});
