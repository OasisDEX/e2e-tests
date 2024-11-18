import { aaveV3BaseEarnPools } from 'utils/testData';
import { openNewPosition, test } from 'tests/sharedTestSteps/openNewPosition';

aaveV3BaseEarnPools.forEach(async (pool) => {
	test.describe('Aave V3 Ethereum Earn', async () => {
		await openNewPosition({
			network: 'base',
			protocol: 'aave/v3',
			pool,
			positionType: 'multiply',
		});
	});
});
