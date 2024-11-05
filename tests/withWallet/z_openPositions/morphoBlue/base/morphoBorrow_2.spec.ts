import { morphoBaseBorrowPools2 } from 'utils/testData';
import { openNewPosition } from 'tests/sharedTestSteps/openNewPosition';

morphoBaseBorrowPools2.forEach(async (pool) => {
	await openNewPosition({
		network: 'base',
		protocol: 'morphoblue',
		pool,
		positionType: 'borrow',
	});
});
