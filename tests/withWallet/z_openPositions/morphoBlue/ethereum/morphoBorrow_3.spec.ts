import { test } from '@playwright/test';
import { morphoEthereumBorrowPools_3 } from 'utils/testData';
import { openNewPosition } from 'tests/sharedTestSteps/openNewPosition';

morphoEthereumBorrowPools_3.forEach((pool) => {
	test.describe('Morpho Blue Borrow - Wallet connected', async () => {
		await openNewPosition({
			network: 'ethereum',
			protocol: 'morphoblue',
			pool,
			positionType: 'borrow',
		});
	});
});
