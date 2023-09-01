import * as metamask from '@synthetixio/synpress/commands/metamask';
import { App } from 'src/app';

export const accept = async (app: App) => {
	await app.page.getByRole('button', { name: 'Sign message' }).click();
	await metamask.confirmSignatureRequest();
	// Needed so that T&C popup is not triggered again after reloading page
	await metamask.closeModal();
};
