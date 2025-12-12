import { Locator, Page } from '@playwright/test';
import { ClaimAndDelegate } from './claimAndDelegate';
import { expect, step } from '#earnProtocolFixtures';
import { expectDefaultTimeout } from 'utils/config';

export class Rewards {
	readonly page: Page;

	readonly claimAndDelegate: ClaimAndDelegate;

	readonly priceLocator: Locator;

	constructor(page: Page) {
		this.page = page;
		this.claimAndDelegate = new ClaimAndDelegate(page);
		this.priceLocator = page
			.locator('[class*="PortfolioRewardsCardsV2_"]')
			.filter({ has: page.getByText('$SUMR Price', { exact: true }) });
	}

	@step
	async shouldBeVisible() {
		await expect(
			this.page.getByText('Your Total $SUMR'),
			'"Your Total $SUMR" should be visible'
		).toBeVisible({ timeout: expectDefaultTimeout * 2 });

		await expect(
			this.page.getByText('Total $SUMR available to claim', { exact: true }),
			'"$SUMR available to claim" should be visible'
		).toBeVisible();
	}

	@step
	async claim() {
		await this.page
			.getByRole('button', {
				name: 'Claim $SUMR',
				exact: true,
			})
			.click();
	}

	@step
	async shoulHaveSumrPrice({
		price,
		marketCap,
		valuation,
		holders,
		sevenDaysTrend,
		thirtyDaysTrend,
		ninetyDaysTrend,
	}: {
		price?: string;
		marketCap?: string;
		valuation?: string;
		holders?: string;
		sevenDaysTrend?: string;
		thirtyDaysTrend?: string;
		ninetyDaysTrend?: string;
	}) {
		if (price) {
			const regExp = new RegExp(`\\$${price}.*SUMR/USD`);
			await expect(this.priceLocator.getByText('SUMR/USD')).toContainText(regExp);
		}

		if (marketCap) {
			const regExp = new RegExp(`\\$${marketCap}`);
			await expect(
				this.priceLocator
					.locator('[class*="_sumrPriceDataBlock_"]')
					.filter({ hasText: 'Market Cap' })
			).toContainText(regExp);
		}

		if (valuation) {
			const regExp = new RegExp(`\\$${valuation}`);
			await expect(
				this.priceLocator
					.locator('[class*="_sumrPriceDataBlock_"]')
					.filter({ hasText: 'Fully Diluted Valuation' })
			).toContainText(regExp);
		}

		if (holders) {
			const regExp = new RegExp(holders);
			await expect(
				this.priceLocator
					.locator('[class*="_sumrPriceDataBlock_"]')
					.filter({ hasText: 'SUMR Holders' })
			).toContainText(regExp);
		}

		if (sevenDaysTrend) {
			const regExp = new RegExp(`${sevenDaysTrend}%`);
			await expect(
				this.priceLocator.locator('[class*="_sumrPriceDataBlock_"]').filter({ hasText: '7d Trend' })
			).toContainText(regExp);
		}

		if (thirtyDaysTrend) {
			const regExp = new RegExp(`${thirtyDaysTrend}%`);
			await expect(
				this.priceLocator
					.locator('[class*="_sumrPriceDataBlock_"]')
					.filter({ hasText: '30d Trend' })
			).toContainText(regExp);
		}

		if (ninetyDaysTrend) {
			const regExp = new RegExp(`${ninetyDaysTrend}%`);
			await expect(
				this.priceLocator
					.locator('[class*="_sumrPriceDataBlock_"]')
					.filter({ hasText: '90d Trend' })
			).toContainText(regExp);
		}
	}

	@step
	async buySumr() {
		await this.priceLocator.getByRole('link', { name: 'Buy SUMR' }).click();
	}
}
