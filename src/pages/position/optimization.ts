import { step } from '#noWalletFixtures';
import { Page } from '@playwright/test';
import { Base } from './base';

export class Optimization {
	readonly page: Page;

	readonly base: Base;

	constructor(page: Page) {
		this.page = page;
		this.base = new Base(page);
	}

	@step
	async setupAutoBuy() {
		await this.page.getByRole('button', { name: 'Setup Auto-Buy' }).click();
	}

	@step
	async adjustAutoBuyTrigger({ value }: { value: number }) {
		await this.base.moveSliderAutomations({ value });
	}

	@step
	async setNoThreshold() {
		await this.page.getByText('span:has-text("Set No Threshold")').click();
	}

	@step
	async setThreshold() {
		await this.page.locator('span:has-text("Set Threshold")').click();
	}

	@step
	async addAutoBuy() {
		await this.page.getByRole('button', { name: 'Add Auto-Buy' }).click();
	}
}
