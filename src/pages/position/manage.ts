import { expect, Page } from '@playwright/test';
import { positionSimulationTimeout } from 'utils/config';

export class Manage {
	readonly page: Page;

	constructor(page: Page) {
		this.page = page;
	}

	async shouldBeVisible(header: string) {
		await expect(this.page.getByText(header).first()).toBeVisible({
			timeout: positionSimulationTimeout,
		});
	}

	async shouldHaveCollateralRatio(ratio: string) {
		const regExp = new RegExp(`${ratio}%`);

		await expect(this.page.locator('p > span:has-text("Collateral Ratio") + span')).toContainText(
			regExp
		);
	}
}
