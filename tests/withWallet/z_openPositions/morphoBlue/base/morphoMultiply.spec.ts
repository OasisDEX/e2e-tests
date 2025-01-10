import { morphoBaseMultiplyPools } from 'utils/testData';
import { openNewPosition, testBase } from 'tests/sharedTestSteps/openNewPosition';

// TODO - Failing with fork but passing with real network - To be investigated in fork
morphoBaseMultiplyPools.forEach(async (pool) => {
	testBase.describe.skip('Morpho Base Multiply', async () => {
		await openNewPosition({
			network: 'base',
			protocol: 'morphoblue',
			pool,
			positionType: 'multiply',
		});
	});
});
