import { expect, step } from '#earnProtocolFixtures';
import { Page } from '@playwright/test';
import { EarnTokens } from 'srcEarnProtocol/utils/types';
import { expectDefaultTimeout } from 'utils/config';

export class Overview {
	readonly page: Page;

	constructor(page: Page) {
		this.page = page;
	}

	@step
	async shouldBeVisible() {
		await expect(
			this.page.getByText('Total Summer.fi Portfolio'),
			'"Total Summer.fi Portfolio" should be visible'
		).toBeVisible({ timeout: expectDefaultTimeout * 2 });

		await expect(
			this.page.getByText('$SUMR Token Rewards', { exact: true }),
			'"SUMR Token Rewards" should be visible'
		).toBeVisible();

		await expect(
			this.page.getByText('Available to Migrate').first(),
			'"Available to Migrate" should be visible'
		).toBeVisible();

		await expect(
			this.page.getByText('Positions', { exact: true }),
			'"Positions" should be visible'
		).toBeVisible();

		await expect(
			this.page.locator('section:has-text("You might like")'),
			'"You might like" section should be visible'
		).toBeVisible();
	}

	@step
	async shouldHaveAvailableToMigrateAmount(amount: string) {
		const regEXP = new RegExp(`\\$${amount}`);
		await expect(
			this.page.locator('[class*="_dataBlockWrapper"]:has-text("Available to Migrate")')
		).toContainText(regEXP);
	}

	// NOTE this function is only for positions visible on screen
	@step
	async shouldHaveAvailableToMigratePositions(
		positions: {
			protocol: 'aave';
			network: 'arbitrum' | 'base';
			depositToken: EarnTokens;
			depositAmount?: string;
			current7dApy?: string;
			summer7dApy?: string;
			apyDiff?: string;
		}[]
	) {
		for (const position of positions) {
			const positionLocator = this.page
				.locator('[class*="positionCardWrapper"]')
				.filter({
					has: this.page.locator(`img[src*="${position.protocol}"]`),
				})
				.filter({
					has: this.page.locator(`svg[title*="${position.network}"]`),
				})
				.filter({
					has: this.page.locator(
						`[class*="positionSubHeader"]:has-text("${position.depositToken}")`
					),
				});

			if (position.depositAmount) {
				const regEXP = new RegExp(position.depositAmount);
				await expect(positionLocator.locator('[class*="MigrationPositionCard"]')).toContainText(
					regEXP
				);
			}

			if (position.current7dApy) {
				const regEXP = new RegExp(position.current7dApy);
				await expect(positionLocator.locator('li:has-text("Current 7d APY")')).toContainText(
					regEXP
				);
			}

			if (position.summer7dApy) {
				const regEXP = new RegExp(position.summer7dApy);
				await expect(positionLocator.locator('li:has-text("Lazy Summer 7d APY")')).toContainText(
					regEXP
				);
			}

			if (position.apyDiff) {
				const regEXP = new RegExp(position.apyDiff);
				await expect(positionLocator.locator('li:has-text("7d APY Differential")')).toContainText(
					regEXP
				);
			}
		}
	}

	@step
	async migrate({ button }: { button: 'top' | 'bottom' }) {
		await this.page
			.locator('a:has-text("Migrate")')
			.nth(button === 'top' ? 0 : 1)
			.click();
	}
}
