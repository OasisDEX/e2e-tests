import { aaveV3ArbitrumBorrowPools } from 'utils/testData';
import { openNewPosition, testArbitrum } from 'tests/sharedTestSteps/openNewPosition';

aaveV3ArbitrumBorrowPools.forEach(async (pool) => {
	testArbitrum.describe('Aave V3 Ethereum Borrow', async () => {
		await openNewPosition({
			network: 'arbitrum',
			protocol: 'aave/v3',
			pool,
			positionType: 'borrow',
		});
	});
});
