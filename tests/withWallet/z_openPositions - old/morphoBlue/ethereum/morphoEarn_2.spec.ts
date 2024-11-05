import { test } from '@playwright/test';
import { morphoEthereumEarnPools_2 } from 'utils/testData';
import { openNewPosition } from 'tests/sharedTestSteps/openNewPosition';

morphoEthereumEarnPools_2.forEach((pool) => {
	test.describe('Morpho Blue Earn - Wallet connected', async () => {
		await openNewPosition({
			network: 'ethereum',
			protocol: 'morphoblue',
			pool,
			positionType: 'multiply',
		});
	});
});
