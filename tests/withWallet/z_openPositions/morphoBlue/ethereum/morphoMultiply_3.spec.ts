import { test } from '@playwright/test';
import { morphoEthereumMultiplyPools_3 } from 'utils/testData';
import { openNewPosition } from 'tests/sharedTestSteps/openNewPosition';

morphoEthereumMultiplyPools_3.forEach((pool) => {
	test.describe('Morpho Blue Multiply - Wallet connected', async () => {
		await openNewPosition({ network: 'ethereum', protocol: 'morphoblue', pool });
	});
});
