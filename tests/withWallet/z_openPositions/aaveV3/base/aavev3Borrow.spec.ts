import { aaveV3BaseBorrowPools } from 'utils/testData';
import { openNewPosition, testBase } from 'tests/sharedTestSteps/openNewPosition';

aaveV3BaseBorrowPools.forEach(async (pool) => {
	testBase.describe('Aave V3 Ethereum Borrow', async () => {
		await openNewPosition({
			network: 'base',
			protocol: 'aave/v3',
			pool,
			positionType: 'borrow',
		});
	});
});
