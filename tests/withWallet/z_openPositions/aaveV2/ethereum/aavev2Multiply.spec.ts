import { test } from '@playwright/test';
import { aaveV2EthereumMultiplyPools } from 'utils/testData';
import { openNewPosition } from 'tests/sharedTestSteps/openNewPosition';

aaveV2EthereumMultiplyPools.forEach((pool) => {
	test.describe('Aave V2 Multiply - Wallet connected', async () => {
		await openNewPosition({
			network: 'ethereum',
			protocol: 'aave/v2',
			pool,
			positionType: 'multiply',
		});
	});
});
