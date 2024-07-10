import { test } from '@playwright/test';
import { sparkEthereumBorrowPools } from 'utils/testData';
import { openNewPosition } from 'tests/sharedTestSteps/openNewPosition';

sparkEthereumBorrowPools.forEach((pool) => {
	test.describe.only('Spark Borrow - Wallet connected', async () => {
		await openNewPosition({
			network: 'ethereum',
			protocol: 'spark',
			pool,
			positionType: 'borrow',
		});
	});
});
