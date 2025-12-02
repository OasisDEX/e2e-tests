import { expect, step } from '#earnProtocolFixtures';
import { Page } from '@playwright/test';
import { expectDefaultTimeout } from 'utils/config';

export class Team {
	readonly page: Page;

	constructor(page: Page) {
		this.page = page;
	}

	@step
	async shouldBeVisible(args?: { timeout: number }) {
		await expect(
			this.page.getByText('Who are we?'),
			'"Who are we?" header shouldbe visible'
		).toBeVisible({ timeout: args?.timeout ?? expectDefaultTimeout });
	}
}
