import { test } from '@playwright/test';
import { morphoBaseBorrowPools } from 'utils/testData';
import { openNewPosition } from 'tests/sharedTestSteps/openNewPosition';

morphoBaseBorrowPools.forEach((pool) => {
	test.describe('Morpho Blue Borrow - Wallet connected', async () => {
		await openNewPosition({
			network: 'base',
			protocol: 'morphoblue',
			pool,
			positionType: 'borrow',
		});
	});
});
