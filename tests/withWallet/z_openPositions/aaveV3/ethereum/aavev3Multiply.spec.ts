import { aaveV3EthereumMultiplyPools } from 'utils/testData';
import { openNewPosition, test } from 'tests/sharedTestSteps/openNewPosition';

aaveV3EthereumMultiplyPools.forEach(async (pool) => {
	test.describe('Aave V3 Ethereum Multiply', async () => {
		await openNewPosition({
			network: 'ethereum',
			protocol: 'aave/v3',
			pool,
			positionType: 'multiply',
		});
	});
});
