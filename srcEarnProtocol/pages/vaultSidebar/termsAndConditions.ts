import { expect, step } from '#earnProtocolFixtures';
import { Page } from '@playwright/test';
import { expectDefaultTimeout } from 'utils/config';

export class TermsAndConditions {
	readonly page: Page;

	constructor(page: Page) {
		this.page = page;
	}

	@step
	async shouldBeVisible(args?: { timeout: number }) {
		await expect(this.page.getByRole('heading', { name: 'Terms & Conditions' })).toBeVisible({
			timeout: args?.timeout ?? expectDefaultTimeout,
		});
	}

	@step
	async agreeAndSign() {
		await this.page.getByRole('button', { name: 'Agree and sign' }).click();
	}

	@step
	async agreeAndSignOrRetry() {
		const sidebarButtonLocator = this.page.locator('[class*="_sidebarCta_"] button').first();

		const sidebarButtonLabel = await sidebarButtonLocator.innerText();

		await this.page.getByRole('button', { name: sidebarButtonLabel }).click();
	}

	@step
	async reject() {
		await this.page.getByRole('button', { name: 'Reject' }).click();
	}
}
