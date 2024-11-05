import { aaveV3BaseEarnPools } from 'utils/testData';
import { openNewPosition } from 'tests/sharedTestSteps/openNewPosition';

aaveV3BaseEarnPools.forEach(async (pool) => {
	await openNewPosition({
		network: 'base',
		protocol: 'aave/v3',
		pool,
		positionType: 'multiply',
	});
});
