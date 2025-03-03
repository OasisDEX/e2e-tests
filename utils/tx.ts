import { expect } from '@playwright/test';
import { MetaMask } from '@synthetixio/synpress/playwright';
import * as tenderly from './tenderly';
import { expectDefaultTimeout } from './config';

export const confirmAndVerifySuccess = async ({
	metamask,
	metamaskAction,
	vtId,
}: {
	metamask: MetaMask;
	metamaskAction:
		| 'approveTokenPermission'
		| 'confirmSignature'
		| 'confirmTransaction'
		| 'confirmTransactionAndWaitForMining';
	vtId: string;
}) => {
	const txCountBefore = await tenderly.getTxCount(vtId);

	await expect(async () => {
		await metamask[metamaskAction]();
	}, `Metamask: ${metamaskAction}`).toPass({ timeout: expectDefaultTimeout * 3 });

	// Wait for tx count to increase
	await expect(async () => {
		const txCountAfter = await tenderly.getTxCount(vtId);
		expect(txCountAfter).toBeGreaterThan(txCountBefore);
	}, 'tx count should increase').toPass({ timeout: expectDefaultTimeout * 3 });

	// Verify last tx success
	await tenderly.verifyTxStatusSuccess(vtId);
};

export const rejectPermissionToSpend = async ({
	metamask,
	timeout,
}: {
	metamask: MetaMask;
	timeout?: number;
}) => {
	await expect(async () => {
		await metamask.rejectTransaction();
	}).toPass({ timeout: timeout ?? expectDefaultTimeout * 2 });
};
