import { aaveV2EthereumMultiplyPools } from 'utils/testData';
import { openNewPosition, test } from 'tests/sharedTestSteps/openNewPosition';

aaveV2EthereumMultiplyPools.forEach(async (pool) => {
	test.describe('Aave V3 Ethereum Multiply', async () => {
		await openNewPosition({
			network: 'ethereum',
			protocol: 'aave/v2',
			pool,
			positionType: 'multiply',
		});
	});
});
