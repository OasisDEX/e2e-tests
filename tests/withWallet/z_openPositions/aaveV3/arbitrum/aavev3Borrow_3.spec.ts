import { test } from '@playwright/test';
import { aaveV3ArbitrumBorrowPools_3 } from 'utils/testData';
import { openNewPosition } from 'tests/sharedTestSteps/openNewPosition';

aaveV3ArbitrumBorrowPools_3.forEach((pool) => {
	test.describe('Aave V3 borrow - Wallet connected', async () => {
		await openNewPosition({
			network: 'arbitrum',
			protocol: 'aave/v3',
			pool,
			positionType: 'borrow',
		});
	});
});
