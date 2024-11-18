import { aaveV3BaseMultiplyPools } from 'utils/testData';
import { openNewPosition, test } from 'tests/sharedTestSteps/openNewPosition';

aaveV3BaseMultiplyPools.forEach(async (pool) => {
	test.describe('Aave V3 Ethereum Multiply', async () => {
		await openNewPosition({
			network: 'base',
			protocol: 'aave/v3',
			pool,
			positionType: 'multiply',
		});
	});
});
