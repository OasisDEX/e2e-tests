import { expect, Page } from '@playwright/test';
import { MetaMask } from '@synthetixio/synpress/playwright';
import * as tenderly from './tenderly';
import { expectDefaultTimeout } from './config';

export const confirmAndVerifySuccess = async ({
	metamask,
	metamaskAction,
	vtId,
	metamaskPage,
}: {
	metamask: MetaMask;
	metamaskAction:
		| 'approveTokenPermission'
		| 'confirmSignature'
		| 'confirmTransaction'
		| 'confirmTransactionAndWaitForMining';
	vtId: string;
	metamaskPage?: Page;
}) => {
	await expect(async () => {
		// DO NOT use getTxCount, since it seems to be counting only up to 10
		// const txCountBefore = await tenderly.getTxCount(vtId);
		const lastTxHashBefore = await tenderly.getLastTxHash(vtId);

		//await expect(async () => {
		if (metamaskAction == 'approveTokenPermission') {
			// await metamask.approveTokenPermission();

			// WORKING !!! --> It looks like metamask.approveTokenPermission() would need a delay between actions
			await metamask.confirmSignature();
			await metamaskPage?.waitForTimeout(1_000);
			await metamask.confirmSignature();
		} else {
			await metamask[metamaskAction]();
		}
		//}, `Metamask: ${metamaskAction}`).toPass({ timeout: expectDefaultTimeout * 3 });

		// Wait for tx count to increase
		await expect(async () => {
			// const txCountAfter = await tenderly.getTxCount(vtId);
			const lastTxHashAfter = await tenderly.getLastTxHash(vtId);

			expect(lastTxHashAfter).not.toEqual(lastTxHashBefore);
		}, 'tx count should increase').toPass({ timeout: expectDefaultTimeout * 1.8 });

		// Verify last tx success
		await tenderly.verifyTxStatusSuccess(vtId);
	}).toPass({ timeout: expectDefaultTimeout * 2.5 });
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
