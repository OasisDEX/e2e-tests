import { morphoBaseBorrowPools } from 'utils/testData';
import { openNewPosition } from 'tests/sharedTestSteps/openNewPosition';

morphoBaseBorrowPools.forEach(async (pool) => {
	await openNewPosition({
		network: 'base',
		protocol: 'morphoblue',
		pool,
		positionType: 'borrow',
	});
});
