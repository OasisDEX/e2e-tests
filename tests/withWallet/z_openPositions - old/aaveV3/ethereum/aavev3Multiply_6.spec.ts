import { test } from '@playwright/test';
import { aaveV3EthereumMultiplyPools_6 } from 'utils/testData';
import { openNewPosition } from 'tests/sharedTestSteps/openNewPosition';

aaveV3EthereumMultiplyPools_6.forEach((pool) => {
	test.describe('Aave V3 Multiply - Wallet connected', async () => {
		await openNewPosition({
			network: 'ethereum',
			protocol: 'aave/v3',
			pool,
			positionType: 'multiply',
		});
	});
});
