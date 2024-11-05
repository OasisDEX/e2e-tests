import { aaveV3ArbitrumEarnPools } from 'utils/testData';
import { openNewPosition } from 'tests/sharedTestSteps/openNewPosition';

aaveV3ArbitrumEarnPools.forEach(async (pool) => {
	await openNewPosition({
		network: 'arbitrum',
		protocol: 'aave/v3',
		pool,
		positionType: 'multiply',
	});
});
