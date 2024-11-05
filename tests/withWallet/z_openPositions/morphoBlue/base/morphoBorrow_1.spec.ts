import { morphoBaseBorrowPools1 } from 'utils/testData';
import { openNewPosition } from 'tests/sharedTestSteps/openNewPosition';

morphoBaseBorrowPools1.forEach(async (pool) => {
	await openNewPosition({
		network: 'base',
		protocol: 'morphoblue',
		pool,
		positionType: 'borrow',
	});
});
