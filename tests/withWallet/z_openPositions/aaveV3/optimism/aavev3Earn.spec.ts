import { aaveV3OptimismEarnPools } from 'utils/testData';
import { openNewPosition } from 'tests/sharedTestSteps/openNewPosition';

aaveV3OptimismEarnPools.forEach(async (pool) => {
	await openNewPosition({
		network: 'optimism',
		protocol: 'aave/v3',
		pool,
		positionType: 'multiply',
	});
});
