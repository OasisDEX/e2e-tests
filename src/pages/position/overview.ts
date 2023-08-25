import { expect, Page } from '@playwright/test';

export class Overview {
	readonly page: Page;

	constructor(page: Page) {
		this.page = page;
	}

	async shouldHaveTokenAmount({ amount, token }: { amount: string; token: string }) {
		await expect(this.page.getByText('In this position').locator('../h3')).toContainText(
			`${amount} ${token}`
		);
	}

	async shouldHavePrev30daysNetValue(amount: string) {
		await expect(
			this.page.getByText('Previous 90 days*').locator('xpath=//preceding::p[1]')
		).toContainText(amount);
	}
}
