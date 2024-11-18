import { aaveV3OptimismBorrowPools } from 'utils/testData';
import { openNewPosition, test } from 'tests/sharedTestSteps/openNewPosition';

aaveV3OptimismBorrowPools.forEach(async (pool) => {
	test.describe('Aave V3 Ethereum Borrow', async () => {
		await openNewPosition({
			network: 'optimism',
			protocol: 'aave/v3',
			pool,
			positionType: 'borrow',
		});
	});
});
