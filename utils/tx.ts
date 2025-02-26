import { expect } from '@playwright/test';
import { MetaMask } from '@synthetixio/synpress/playwright';
import * as tenderly from './tenderly';
import { expectDefaultTimeout } from './config';
import { App } from 'src/app';

export const confirmAndVerifySuccess = async ({
	metamask,
	metamaskAction,
	forkId,
}: {
	metamask: MetaMask;
	metamaskAction:
		| 'approveTokenPermission'
		| 'confirmSignature'
		| 'confirmTransaction'
		| 'confirmTransactionAndWaitForMining';
	forkId: string;
}) => {
	const txCountBefore = await tenderly.getTxCount(forkId);

	await expect(async () => {
		await metamask[metamaskAction]();
	}, `Metamask: ${metamaskAction}`).toPass({ timeout: expectDefaultTimeout * 3 });

	// Wait for tx count to increase
	await expect(async () => {
		const txCountAfter = await tenderly.getTxCount(forkId);
		expect(txCountAfter).toBeGreaterThan(txCountBefore);
	}, 'tx count should increase').toPass({ timeout: expectDefaultTimeout * 3 });

	// Verify last tx success
	await tenderly.verifyTxReceiptStatusSuccess(forkId);
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
