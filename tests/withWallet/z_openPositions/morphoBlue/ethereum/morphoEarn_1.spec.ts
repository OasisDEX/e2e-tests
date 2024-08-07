import { test } from '@playwright/test';
import { morphoEthereumEarnPools_1 } from 'utils/testData';
import { openNewPosition } from 'tests/sharedTestSteps/openNewPosition';

morphoEthereumEarnPools_1.forEach((pool) => {
	test.describe('Morpho Blue Multiply - Wallet connected', async () => {
		await openNewPosition({
			network: 'ethereum',
			protocol: 'erc-4626',
			pool,
			positionType: 'earn',
		});
	});
});
