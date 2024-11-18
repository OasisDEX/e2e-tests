import { aaveV3EthereumEarnPools } from 'utils/testData';
import { openNewPosition, test } from 'tests/sharedTestSteps/openNewPosition';

aaveV3EthereumEarnPools.forEach(async (pool) => {
	test.describe('Aave V3 Ethereum Earn', async () => {
		await openNewPosition({
			network: 'ethereum',
			protocol: 'aave/v3',
			pool,
			positionType: 'multiply',
		});
	});
});
