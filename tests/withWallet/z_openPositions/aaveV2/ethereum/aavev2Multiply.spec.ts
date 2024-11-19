import { aaveV2EthereumMultiplyPools } from 'utils/testData';
import { openNewPosition, testEthereum } from 'tests/sharedTestSteps/openNewPosition';

aaveV2EthereumMultiplyPools.forEach(async (pool) => {
	testEthereum.describe('Aave V3 Ethereum Multiply', async () => {
		await openNewPosition({
			network: 'ethereum',
			protocol: 'aave/v2',
			pool,
			positionType: 'multiply',
		});
	});
});
