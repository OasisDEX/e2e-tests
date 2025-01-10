import { morphoBaseBorrowPools } from 'utils/testData';
import { openNewPosition, testBase } from 'tests/sharedTestSteps/openNewPosition';

// TODO - Failing with fork but passing with real network - To be investigated in fork
morphoBaseBorrowPools.forEach(async (pool) => {
	testBase.describe.skip('Morpho Base Borrow', async () => {
		await openNewPosition({
			network: 'base',
			protocol: 'morphoblue',
			pool,
			positionType: 'borrow',
		});
	});
});
