import { step } from '#noWalletFixtures';
import { expect, Page } from '@playwright/test';
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
		const locator = this.page.getByRole('button', { name: 'Setup Auto-Buy' });
		expect(locator).toBeVisible();
		await this.page.waitForTimeout(1000);
		await locator.click({ clickCount: 2 });
	}

	@step
	async adjustAutoBuyTrigger({ value }: { value: number }) {
		await this.base.moveSliderAutomations({ automation: 'AutoBuy', value });
	}

	@step
	async shouldHaveMessage(text: string) {
		await this.base.shouldHaveMessage(text);
	}

	@step
	async setNoThreshold() {
		await this.base.setNoThreshold();
	}

	@step
	async setThreshold() {
		await this.base.setThreshold();
	}

	@step
	async addAutoBuy() {
		await this.page.getByRole('button', { name: 'Add Auto-Buy' }).click();
	}
}
