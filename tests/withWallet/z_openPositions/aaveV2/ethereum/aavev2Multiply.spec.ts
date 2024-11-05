import { aaveV2EthereumMultiplyPools } from 'utils/testData';
import { openNewPosition } from 'tests/sharedTestSteps/openNewPosition';

aaveV2EthereumMultiplyPools.forEach(async (pool) => {
	await openNewPosition({
		network: 'ethereum',
		protocol: 'aave/v2',
		pool,
		positionType: 'multiply',
	});
});
