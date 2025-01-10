import { aaveV3BaseMultiplyPools } from 'utils/testData';
import { openNewPosition, testBase } from 'tests/sharedTestSteps/openNewPosition';

// TODO - Failing with fork but passing with real network - To be investigated in fork
aaveV3BaseMultiplyPools.forEach(async (pool) => {
	testBase.describe.skip('Aave V3 Ethereum Multiply', async () => {
		await openNewPosition({
			network: 'base',
			protocol: 'aave/v3',
			pool,
			positionType: 'multiply',
		});
	});
});
