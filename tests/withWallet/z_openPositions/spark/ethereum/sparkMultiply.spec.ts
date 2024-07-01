import { test } from '@playwright/test';
import { sparkEthereumMultiplyPools } from 'utils/testData';
import { openNewPosition } from 'tests/sharedTestSteps/openNewPosition';

sparkEthereumMultiplyPools.forEach((pool) => {
	test.describe('Spark Multiply - Wallet connected', async () => {
		await openNewPosition({ network: 'ethereum', protocol: 'spark', pool });
	});
});
