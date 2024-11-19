import { morphoBaseEarnPools } from 'utils/testData';
import { openNewPosition, testBase } from 'tests/sharedTestSteps/openNewPosition';

morphoBaseEarnPools.forEach(async (pool) => {
	testBase.describe('Morpho Base Earn', async () => {
		await openNewPosition({
			network: 'base',
			protocol: 'morphoblue',
			pool,
			positionType: 'multiply',
		});
	});
});
