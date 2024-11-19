import { aaveV3EthereumBorrowPools } from 'utils/testData';
import { openNewPosition, testEthereum } from 'tests/sharedTestSteps/openNewPosition';

aaveV3EthereumBorrowPools.forEach(async (pool) => {
	testEthereum.describe('Aave V3 Ethereum Borrow', async () => {
		await openNewPosition({
			network: 'ethereum',
			protocol: 'aave/v3',
			pool,
			positionType: 'borrow',
		});
	});
});
