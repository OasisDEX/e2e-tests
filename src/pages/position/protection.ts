import { step } from '#noWalletFixtures';
import { expect, Page } from '@playwright/test';
import { Base } from './base';
import { expectDefaultTimeout } from 'utils/config';

export class Protection {
	readonly page: Page;

	readonly base: Base;

	constructor(page: Page) {
		this.page = page;
		this.base = new Base(page);
	}

	@step
	async setup(
		{ protection, timeout }: { protection: 'Auto-Sell' | 'Stop-Loss'; timeout?: number } = {
			protection: 'Auto-Sell',
			timeout: expectDefaultTimeout,
		}
	) {
		const locator = this.page.getByRole('button', { name: `Set up ${protection}`, exact: true });
		expect(locator, `"Set up ${protection}" button should be visible`).toBeVisible({ timeout });
		await this.page.waitForTimeout(1000);
		await locator.click({ clickCount: 2 });
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
}
