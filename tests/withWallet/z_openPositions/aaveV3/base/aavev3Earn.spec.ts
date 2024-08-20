import { test } from '@playwright/test';
import { aaveV3BaseEarnPools } from 'utils/testData';
import { openNewPosition } from 'tests/sharedTestSteps/openNewPosition';

aaveV3BaseEarnPools.forEach((pool) => {
	// Base ETH borrow cap at 100%
	test.describe.skip('Aave V3 Earn - Wallet connected', async () => {
		await openNewPosition({
			network: 'base',
			protocol: 'aave/v3',
			pool,
			positionType: 'multiply',
		});
	});
});
