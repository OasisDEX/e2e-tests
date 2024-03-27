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
	async setupOptimization(optimization: 'Auto-Buy' | 'Auto Take Profit') {
		const locator = this.page.getByRole('button', { name: `Set up ${optimization}` });
		expect(locator).toBeVisible();
		await this.page.waitForTimeout(1000);
		await locator.click();
	}

	@step
	async adjustAutoBuyTrigger({ value }: { value: number }) {
		await this.base.moveSliderAutomations({ automation: 'AutoBuy', value });
	}

	@step
	async adjustPartialTakeProfitTrigger({ value }: { value: number }) {
		await this.base.moveSliderAutomationsOmni({ value });
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
	async add(optimization: 'Auto-Buy' | 'Auto Take Profit') {
		if (optimization === 'Auto Take Profit') {
			await this.page.getByRole('button', { name: `Add ${optimization}` }).scrollIntoViewIfNeeded();
		}
		await this.page.getByRole('button', { name: `Add ${optimization}` }).click();
	}
}
