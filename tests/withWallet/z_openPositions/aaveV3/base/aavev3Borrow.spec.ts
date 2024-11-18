import { aaveV3BaseBorrowPools } from 'utils/testData';
import { openNewPosition, test } from 'tests/sharedTestSteps/openNewPosition';

aaveV3BaseBorrowPools.forEach(async (pool) => {
	test.describe('Aave V3 Ethereum Borrow', async () => {
		await openNewPosition({
			network: 'base',
			protocol: 'aave/v3',
			pool,
			positionType: 'borrow',
		});
	});
});
