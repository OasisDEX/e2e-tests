import { morphoBaseBorrowPools } from 'utils/testData';
import { openNewPosition, testBase } from 'tests/sharedTestSteps/openNewPosition';

morphoBaseBorrowPools.forEach(async (pool) => {
	testBase.describe('Morpho Base Borrow', async () => {
		await openNewPosition({
			network: 'base',
			protocol: 'morphoblue',
			pool,
			positionType: 'borrow',
		});
	});
});
