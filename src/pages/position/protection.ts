import { expect, step } from '#noWalletFixtures';
import { Page } from '@playwright/test';
import { Base } from './base';

export class Protection {
	readonly page: Page;

	readonly base: Base;

	constructor(page: Page) {
		this.page = page;
		this.base = new Base(page);
	}

	@step
	async setup(protection: 'Auto-Sell' | 'Stop-Loss' | 'Trailing Stop-Loss') {
		const locator = this.page.getByRole('button', { name: `Set up ${protection}`, exact: true });
		await this.page.waitForTimeout(1000);
		await locator.click();
	}

	@step
	async selectStopLoss(type: 'Regular Stop-Loss' | 'Trailing Stop-Loss') {
		await this.page.getByRole('button', { name: type, exact: true }).click();
	}

	@step
	async addStopLoss(type: 'Regular' | 'Trailing') {
		await this.page.getByRole('button', { name: `Add ${type} Stop-Loss`, exact: true }).click();
	}

	@step
	async adjustAutoSellTrigger({ value }: { value: number }) {
		await this.base.moveSliderAutomations({ automation: 'AutoSell', value });
	}

	@step
	async adjustStopLossTrigger({ value }: { value: number }) {
		await this.base.moveSliderAutomations({ automation: 'Stop-Loss', value });
	}

	@step
	async adjustTrailingStopLossTrigger({ value }: { value: number }) {
		await this.base.moveSliderOmni({ value });
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
	async addAutoSell() {
		await this.page.getByRole('button', { name: 'Add Auto-Sell' }).click();
	}

	@step
	async addStopLossProtection() {
		await this.page.getByRole('button', { name: 'Add Stop-Loss Protection' }).click();
	}

	@step
	async shouldHaveAutomationOn(automation: 'Stop-Loss' | 'Trailing Stop-Loss' | 'Auto-Sell') {
		await expect(
			this.page.locator(`p:has-text("${automation}") + div:has-text("ON")`),
			`'${automation} ON' should be visible`
		).toBeVisible();
	}
}
