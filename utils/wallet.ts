import { MetaMask } from '@synthetixio/synpress/playwright';
import { App } from 'src/app';

export const connect = async ({ metamask, app }: { metamask: MetaMask; app: App }) => {
	await app.page.getByRole('button', { name: 'Connect a wallet' }).click();
	await app.page.getByRole('button', { name: 'Metamask' }).click();
	await metamask.connectToDapp();
};
