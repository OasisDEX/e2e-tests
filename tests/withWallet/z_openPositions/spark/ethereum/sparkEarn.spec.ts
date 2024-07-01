import { test } from '@playwright/test';
import { sparkEthereumEarnPools } from 'utils/testData';
import { openNewPosition } from 'tests/sharedTestSteps/openNewPosition';

sparkEthereumEarnPools.forEach((pool) => {
	test.describe('Spark Multiply - Wallet connected', async () => {
		await openNewPosition({ network: 'ethereum', protocol: 'spark', pool });
	});
});
