import { aaveV3OptimismBorrowPools_1, aaveV3OptimismBorrowPools_2 } from 'utils/testData';
import { openNewPosition } from 'tests/sharedTestSteps/openNewPosition';

aaveV3OptimismBorrowPools_1.forEach(async (pool) => {
	await openNewPosition({
		network: 'optimism',
		protocol: 'aave/v3',
		pool,
		positionType: 'borrow',
	});
});

aaveV3OptimismBorrowPools_2.forEach(async (pool) => {
	await openNewPosition({
		network: 'optimism',
		protocol: 'aave/v3',
		pool,
		positionType: 'borrow',
	});
});
