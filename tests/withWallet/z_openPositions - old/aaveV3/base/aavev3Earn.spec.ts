import { test } from '@playwright/test';
import { aaveV3BaseEarnPools } from 'utils/testData';
import { openNewPosition } from 'tests/sharedTestSteps/openNewPosition';

aaveV3BaseEarnPools.forEach((pool) => {
	test.describe('Aave V3 Earn - Wallet connected', async () => {
		await openNewPosition({
			network: 'base',
			protocol: 'aave/v3',
			pool,
			positionType: 'multiply',
		});
	});
});
