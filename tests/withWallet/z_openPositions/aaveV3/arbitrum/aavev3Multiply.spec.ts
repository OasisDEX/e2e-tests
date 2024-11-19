import { aaveV3ArbitrumMultiplyPools } from 'utils/testData';
import { openNewPosition, testArbitrum } from 'tests/sharedTestSteps/openNewPosition';

aaveV3ArbitrumMultiplyPools.forEach(async (pool) => {
	testArbitrum.describe('Aave V3 Ethereum Multiply', async () => {
		await openNewPosition({
			network: 'arbitrum',
			protocol: 'aave/v3',
			pool,
			positionType: 'multiply',
		});
	});
});
