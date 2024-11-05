import { aaveV3EthereumBorrowPools_1 } from 'utils/testData';
import { openNewPosition } from 'tests/sharedTestSteps/openNewPosition';

aaveV3EthereumBorrowPools_1.forEach(async (pool) => {
	await openNewPosition({
		network: 'ethereum',
		protocol: 'aave/v3',
		pool,
		positionType: 'borrow',
	});
});
