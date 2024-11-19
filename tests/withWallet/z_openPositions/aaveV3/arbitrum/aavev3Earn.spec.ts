import { aaveV3ArbitrumEarnPools } from 'utils/testData';
import { openNewPosition, testArbitrum } from 'tests/sharedTestSteps/openNewPosition';

aaveV3ArbitrumEarnPools.forEach(async (pool) => {
	testArbitrum.describe('Aave V3 Ethereum Earn', async () => {
		await openNewPosition({
			network: 'arbitrum',
			protocol: 'aave/v3',
			pool,
			positionType: 'multiply',
		});
	});
});
