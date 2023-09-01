import * as metamask from '@synthetixio/synpress/commands/metamask';
import { App } from 'src/app';

export const connect = async (app: App) => {
	await app.page.getByRole('button', { name: 'Connect a wallet' }).click();
	await app.page.getByRole('button', { name: 'Metamask' }).click();
	await metamask.acceptAccess();
};
