import { step } from '#earnProtocolFixtures';
import { expect, Page } from '@playwright/test';
import { EarnTokens } from 'srcEarnProtocol/utils/types';
import { expectDefaultTimeout } from 'utils/config';

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
	async approveButtonShouldHave(token: EarnTokens, args?: { timeout: number }) {
		await expect(this.page.locator('button:has-text("Approve")')).toContainText(token, {
			timeout: args?.timeout ?? expectDefaultTimeout,
		});
	}
}
