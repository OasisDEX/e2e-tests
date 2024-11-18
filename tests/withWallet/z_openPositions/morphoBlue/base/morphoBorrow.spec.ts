import { morphoBaseBorrowPools } from 'utils/testData';
import { openNewPosition, test } from 'tests/sharedTestSteps/openNewPosition';

morphoBaseBorrowPools.forEach(async (pool) => {
	test.describe('Morpho Base Borrow', async () => {
		await openNewPosition({
			network: 'base',
			protocol: 'morphoblue',
			pool,
			positionType: 'borrow',
		});
	});
});
