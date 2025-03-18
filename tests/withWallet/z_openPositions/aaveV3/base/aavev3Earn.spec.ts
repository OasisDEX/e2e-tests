import { aaveV3BaseEarnPools } from 'utils/testData';
import { openNewPosition, testBase } from 'tests/sharedTestSteps/openNewPosition';

aaveV3BaseEarnPools.forEach(async (pool) => {
	testBase.describe('Aave V3 Ethereum Earn', async () => {
		await openNewPosition({
			network: 'base',
			protocol: 'aave/v3',
			pool,
			positionType: 'multiply',
		});
	});
});
