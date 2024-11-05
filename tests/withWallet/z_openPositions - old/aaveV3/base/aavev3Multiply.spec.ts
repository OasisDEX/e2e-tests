import { test } from '@playwright/test';
import { aaveV3BaseMultiplyPools } from 'utils/testData';
import { openNewPosition } from 'tests/sharedTestSteps/openNewPosition';

aaveV3BaseMultiplyPools.forEach((pool) => {
	test.describe('Aave V3 Multiply - Wallet connected', async () => {
		await openNewPosition({
			network: 'base',
			protocol: 'aave/v3',
			pool,
			positionType: 'multiply',
		});
	});
});
