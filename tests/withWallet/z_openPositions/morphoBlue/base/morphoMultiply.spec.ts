import { morphoBaseMultiplyPools } from 'utils/testData';
import { openNewPosition } from 'tests/sharedTestSteps/openNewPosition';

morphoBaseMultiplyPools.forEach(async (pool) => {
	await openNewPosition({
		network: 'base',
		protocol: 'morphoblue',
		pool,
		positionType: 'multiply',
	});
});
