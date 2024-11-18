import { aaveV3EthereumBorrowPools } from 'utils/testData';
import { openNewPosition, test } from 'tests/sharedTestSteps/openNewPosition';

aaveV3EthereumBorrowPools.forEach(async (pool) => {
	test.describe('Aave V3 Ethereum Borrow', async () => {
		await openNewPosition({
			network: 'ethereum',
			protocol: 'aave/v3',
			pool,
			positionType: 'borrow',
		});
	});
});
