import { morphoBaseEarnPools } from 'utils/testData';
import { openNewPosition } from 'tests/sharedTestSteps/openNewPosition';

morphoBaseEarnPools.forEach(async (pool) => {
	await openNewPosition({
		network: 'base',
		protocol: 'morphoblue',
		pool,
		positionType: 'multiply',
	});
});
