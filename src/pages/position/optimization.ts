import { step } from '#noWalletFixtures';
import { expect, Page } from '@playwright/test';
import { Base } from './base';

type Optimizations = 'Auto Take Profit' | 'Auto-Buy';

export class Optimization {
	readonly page: Page;

	readonly base: Base;

	constructor(page: Page) {
		this.page = page;
		this.base = new Base(page);
	}

	@step
	async setupOptimization(optimization: Optimizations) {
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
	async adjustPartialTakeProfitStopLossTrigger({ value }: { value: number }) {
		await this.base.moveSliderAutomationsOmni({ value, sliderPosition: 3 });
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
	async add(optimization: Optimizations) {
		if (optimization === 'Auto Take Profit') {
			await this.page.getByRole('button', { name: `Add ${optimization}` }).scrollIntoViewIfNeeded();
		}
		await this.page.getByRole('button', { name: `Add ${optimization}` }).click();
	}

	@step
	async openOptimizationDropDown({
		selectedOptimization,
	}: {
		selectedOptimization: Optimizations;
	}) {
		await this.page.locator(`button:has-text("${selectedOptimization}")`).click();
	}

	@step
	async selectOptimization(optimization: Optimizations) {
		await this.page.locator(`li:has-text("${optimization}")`).click();
	}
}
