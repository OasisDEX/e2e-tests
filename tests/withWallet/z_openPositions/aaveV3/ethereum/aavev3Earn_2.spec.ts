import { test } from '@playwright/test';
import { aaveV3EthereumEarnPools_2 } from 'utils/testData';
import { openNewPosition } from 'tests/sharedTestSteps/openNewPosition';

aaveV3EthereumEarnPools_2.forEach((pool) => {
	test.describe('Aave V3 Earn - Wallet connected', async () => {
		await openNewPosition({
			network: 'ethereum',
			protocol: 'aave/v3',
			pool,
			positionType: 'multiply',
		});
	});
});
