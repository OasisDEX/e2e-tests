import { test } from '@playwright/test';
import { aaveV3EthereumBorrowPools_7 } from 'utils/testData';
import { openNewPosition } from 'tests/sharedTestSteps/openNewPosition';

aaveV3EthereumBorrowPools_7.forEach((pool) => {
	test.describe('Aave V3 Borrow - Wallet connected', async () => {
		await openNewPosition({
			network: 'ethereum',
			protocol: 'aave/v3',
			pool,
			positionType: 'borrow',
		});
	});
});
