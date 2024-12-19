import { step } from '#earnProtocolFixtures';
import { expect, Page } from '@playwright/test';
import { EarnTokens } from 'srcEarnProtocol/utils/types';

export class ApproveStep {
	readonly page: Page;

	constructor(page: Page) {
		this.page = page;
	}

	@step
	async depositBlockShouldHave(token: EarnTokens) {
		await expect(
			this.page.locator('[clas*="_selectionBlockWrapper_"]:has-text("Recommended")')
		).toContainText(`${token} deposit`);
	}

	@step
	async approveButtonShouldHave(token: EarnTokens) {
		await expect(this.page.locator('button:has-text("Approve")')).toContainText(token);
	}
}
