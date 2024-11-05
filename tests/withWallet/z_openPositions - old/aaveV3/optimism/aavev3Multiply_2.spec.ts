import { test } from '@playwright/test';
import { aaveV3OptimismMultiplyPools_2 } from 'utils/testData';
import { openNewPosition } from 'tests/sharedTestSteps/openNewPosition';

aaveV3OptimismMultiplyPools_2.forEach((pool) => {
	test.describe('Aave V3 Multiply - Wallet connected', async () => {
		await openNewPosition({
			network: 'optimism',
			protocol: 'aave/v3',
			pool,
			positionType: 'multiply',
		});
	});
});
