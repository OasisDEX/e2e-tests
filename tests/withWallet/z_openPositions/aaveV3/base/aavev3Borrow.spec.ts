import { aaveV3BaseBorrowPools } from 'utils/testData';
import { openNewPosition, testBase } from 'tests/sharedTestSteps/openNewPosition';

// TODO - Failing with fork but passing with real network - To be investigated in fork
aaveV3BaseBorrowPools.forEach(async (pool) => {
	testBase.describe.skip('Aave V3 Ethereum Borrow', async () => {
		await openNewPosition({
			network: 'base',
			protocol: 'aave/v3',
			pool,
			positionType: 'borrow',
		});
	});
});
