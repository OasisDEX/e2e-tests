import { aaveV3BaseMultiplyPools } from 'utils/testData';
import { openNewPosition } from 'tests/sharedTestSteps/openNewPosition';

aaveV3BaseMultiplyPools.forEach(async (pool) => {
	await openNewPosition({
		network: 'base',
		protocol: 'aave/v3',
		pool,
		positionType: 'multiply',
	});
});
