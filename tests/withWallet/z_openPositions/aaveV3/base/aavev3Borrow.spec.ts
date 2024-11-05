import { aaveV3BaseBorrowPools } from 'utils/testData';
import { openNewPosition } from 'tests/sharedTestSteps/openNewPosition';

aaveV3BaseBorrowPools.forEach(async (pool) => {
	await openNewPosition({
		network: 'base',
		protocol: 'aave/v3',
		pool,
		positionType: 'borrow',
	});
});
