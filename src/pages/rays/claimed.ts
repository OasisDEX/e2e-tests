import { expect, step } from '#noWalletFixtures';
import { Page } from '@playwright/test';
import { expectDefaultTimeout } from 'utils/config';

export class Claimed {
	readonly page: Page;

	constructor(page: Page) {
		this.page = page;
	}

	@step
	async shouldBeVisible() {
		const regExp = new RegExp('Wallet .* has claimed');
		await expect(this.page.getByText(regExp)).toBeVisible({ timeout: expectDefaultTimeout * 3 });
	}

	@step
	async shouldHave(
		items: (
			| 'Earn more $RAYS'
			| 'Enable automation to your active positions'
			| 'Trade using Multiply and Yield Loops'
			| 'Use more protocols through Summer.fi'
			| 'Migrate a DeFi position in from elsewhere'
		)[]
	) {
		for (const item of items) {
			await expect(this.page.getByText(item)).toBeVisible();
		}
	}
}
