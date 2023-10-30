import { step } from '#noWalletFixtures';
import { expect, Locator, Page } from '@playwright/test';
import { portfolioTimeout } from 'utils/config';

export class TopAssetsAndPositions {
	readonly locator: Locator;

	constructor(page: Page) {
		this.locator = page.locator(':has-text("assets and positions") + div');
	}

	@step
	async shouldHaveAsset({
		asset,
		percentage,
		amount,
	}: {
		asset: string;
		percentage?: string;
		amount?: string;
	}) {
		const assetLocator = this.locator.getByText(asset, { exact: true });

		await expect(assetLocator, `${asset} should be visible`).toBeVisible({
			timeout: portfolioTimeout,
		});

		if (percentage) {
			await expect(assetLocator.locator('xpath=//following-sibling::span[1]')).toHaveText(
				`${percentage}%`
			);
		}

		if (amount) {
			const regExp = new RegExp(`\\(\\$${amount}\\)`);
			await expect(assetLocator.locator('xpath=//following-sibling::span[2]')).toContainText(
				regExp
			);
		}
	}
}
