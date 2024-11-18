import { morphoBaseEarnPools } from 'utils/testData';
import { openNewPosition, test } from 'tests/sharedTestSteps/openNewPosition';

morphoBaseEarnPools.forEach(async (pool) => {
	test.describe('Morpho Base Earn', async () => {
		await openNewPosition({
			network: 'base',
			protocol: 'morphoblue',
			pool,
			positionType: 'multiply',
		});
	});
});
