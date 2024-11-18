import { aaveV3ArbitrumBorrowPools } from 'utils/testData';
import { openNewPosition, test } from 'tests/sharedTestSteps/openNewPosition';

aaveV3ArbitrumBorrowPools.forEach(async (pool) => {
	test.describe('Aave V3 Ethereum Borrow', async () => {
		await openNewPosition({
			network: 'arbitrum',
			protocol: 'aave/v3',
			pool,
			positionType: 'borrow',
		});
	});
});
