import { aaveV3OptimismEarnPools } from 'utils/testData';
import { openNewPosition, test } from 'tests/sharedTestSteps/openNewPosition';

aaveV3OptimismEarnPools.forEach(async (pool) => {
	test.describe('Aave V3 Ethereum Earn', async () => {
		await openNewPosition({
			network: 'optimism',
			protocol: 'aave/v3',
			pool,
			positionType: 'multiply',
		});
	});
});
