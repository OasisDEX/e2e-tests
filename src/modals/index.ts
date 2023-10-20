import { Page } from '@playwright/test';
import { ConnectWallet } from './connectWallet';

export class Modals {
	readonly connectWallet: ConnectWallet;

	constructor(page: Page) {
		this.connectWallet = new ConnectWallet(page);
	}
}
