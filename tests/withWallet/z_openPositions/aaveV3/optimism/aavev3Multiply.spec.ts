import { aaveV3OptimismMultiplyPools } from 'utils/testData';
import { openNewPosition, testOptimism } from 'tests/sharedTestSteps/openNewPosition';

aaveV3OptimismMultiplyPools.forEach(async (pool) => {
	testOptimism.describe('Aave V3 Ethereum Multiply', async () => {
		await openNewPosition({
			network: 'optimism',
			protocol: 'aave/v3',
			pool,
			positionType: 'multiply',
		});
	});
});
