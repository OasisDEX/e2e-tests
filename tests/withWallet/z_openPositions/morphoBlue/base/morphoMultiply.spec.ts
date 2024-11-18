import { morphoBaseMultiplyPools } from 'utils/testData';
import { openNewPosition, test } from 'tests/sharedTestSteps/openNewPosition';

morphoBaseMultiplyPools.forEach(async (pool) => {
	test.describe('Morpho Base Multiply', async () => {
		await openNewPosition({
			network: 'base',
			protocol: 'morphoblue',
			pool,
			positionType: 'multiply',
		});
	});
});
