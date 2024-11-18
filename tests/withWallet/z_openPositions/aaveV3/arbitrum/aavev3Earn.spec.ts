import { aaveV3ArbitrumEarnPools } from 'utils/testData';
import { openNewPosition, test } from 'tests/sharedTestSteps/openNewPosition';

aaveV3ArbitrumEarnPools.forEach(async (pool) => {
	test.describe('Aave V3 Ethereum Earn', async () => {
		await openNewPosition({
			network: 'arbitrum',
			protocol: 'aave/v3',
			pool,
			positionType: 'multiply',
		});
	});
});
