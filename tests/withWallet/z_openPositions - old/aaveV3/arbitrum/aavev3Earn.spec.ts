import { test } from '@playwright/test';
import { aaveV3ArbitrumEarnPools } from 'utils/testData';
import { openNewPosition } from 'tests/sharedTestSteps/openNewPosition';

aaveV3ArbitrumEarnPools.forEach((pool) => {
	test.describe('Aave V3 Earn - Wallet connected', async () => {
		await openNewPosition({
			network: 'arbitrum',
			protocol: 'aave/v3',
			pool,
			positionType: 'multiply',
		});
	});
});
