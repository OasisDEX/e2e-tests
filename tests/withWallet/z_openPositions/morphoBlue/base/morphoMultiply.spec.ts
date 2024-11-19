import { morphoBaseMultiplyPools } from 'utils/testData';
import { openNewPosition, testBase } from 'tests/sharedTestSteps/openNewPosition';

morphoBaseMultiplyPools.forEach(async (pool) => {
	testBase.describe('Morpho Base Multiply', async () => {
		await openNewPosition({
			network: 'base',
			protocol: 'morphoblue',
			pool,
			positionType: 'multiply',
		});
	});
});
