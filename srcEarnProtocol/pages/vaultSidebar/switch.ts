import { step } from '#noWalletFixtures';
import { Page } from '@playwright/test';
import { LazyNominatedTokens, Risks } from 'srcEarnProtocol/utils/types';

export class Switch {
	readonly page: Page;

	constructor(page: Page) {
		this.page = page;
	}

	@step
	async selectTargetPosition(position: { token: LazyNominatedTokens; risk?: Risks }) {
		const regExp = new RegExp(`${position.token}.*${position.risk ?? ''}`);
		await this.page.locator(`[class*="_nextVaultCard_"]`).filter({ hasText: regExp }).click();
	}

	@step
	async previewSwitch() {
		await this.page.getByRole('button', { name: 'Preview Switch' }).click();
	}

	@step
	async confirmSwitch() {
		await this.page.getByRole('button', { name: 'Switch' }).click();
	}
}
