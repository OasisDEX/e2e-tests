import {
	aaveV3ArbitrumBorrowPools_1,
	aaveV3ArbitrumBorrowPools_2,
	aaveV3ArbitrumBorrowPools_3,
} from 'utils/testData';
import { openNewPosition } from 'tests/sharedTestSteps/openNewPosition';

aaveV3ArbitrumBorrowPools_1.forEach(async (pool) => {
	await openNewPosition({
		network: 'arbitrum',
		protocol: 'aave/v3',
		pool,
		positionType: 'borrow',
	});
});

aaveV3ArbitrumBorrowPools_2.forEach(async (pool) => {
	await openNewPosition({
		network: 'arbitrum',
		protocol: 'aave/v3',
		pool,
		positionType: 'borrow',
	});
});

aaveV3ArbitrumBorrowPools_3.forEach(async (pool) => {
	await openNewPosition({
		network: 'arbitrum',
		protocol: 'aave/v3',
		pool,
		positionType: 'borrow',
	});
});
