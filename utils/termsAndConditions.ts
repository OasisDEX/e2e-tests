import { MetaMask } from '@synthetixio/synpress/playwright';
import { App } from 'src/app';

export const accept = async ({ metamask, app }: { metamask: MetaMask; app: App }) => {
	await app.page.getByRole('button', { name: 'Sign message' }).click();
	await metamask.confirmSignature();
	// // Needed so that T&C popup is not triggered again after reloading page
	// await metamask.closeModal();
};
