import { sparkEthereumEarnPools } from 'utils/testData';
import { openNewPosition } from 'tests/sharedTestSteps/openNewPosition';

sparkEthereumEarnPools.forEach(async (pool) => {
	await openNewPosition({
		network: 'ethereum',
		protocol: 'spark',
		pool,
		positionType: 'multiply',
	});
});
