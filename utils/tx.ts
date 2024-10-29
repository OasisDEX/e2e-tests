import { test, expect } from '@playwright/test';
import { MetaMask } from '@synthetixio/synpress/playwright';
import * as tenderly from './tenderly';
import { expectDefaultTimeout } from './config';

export const confirmAndVerifySuccess = async ({
	metamask,
	metamaskAction,
	forkId,
}: {
	metamask: MetaMask;
	metamaskAction: 'confirmSignature' | 'confirmTransaction';
	forkId: string;
}) => {
	const txCountBefore = await tenderly.getTxCount(forkId);
	await test.step(`Metamask: ${metamaskAction}`, async () => {
		await metamask[metamaskAction]();
	});

	// Wait for tx count to increase
	await expect(async () => {
		const txCountAfter = await tenderly.getTxCount(forkId);
		expect(txCountAfter).toBeGreaterThan(txCountBefore);
	}, 'tx count should increase').toPass({ timeout: expectDefaultTimeout * 3 });

	// Verify last tx success
	await tenderly.verifyTxReceiptStatusSuccess(forkId);
};

export const rejectPermissionToSpend = async ({ metamask }: { metamask: MetaMask }) => {
	await metamask.rejectTransaction();
};
