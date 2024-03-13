import { expect, Page } from '@playwright/test';
import { step } from '#noWalletFixtures';
import { portfolioTimeout } from 'utils/config';
import { FeaturedFor } from './featuredFor';

type ProductTypes = 'All products' | 'Borrow' | 'Earn' | 'Multiply' | 'Migrate';

type PositionData = {
	id: string;
	pool: string;
	type: string;
	protocol: string;
};

export class Positions {
	readonly page: Page;

	readonly featuredFor: FeaturedFor;

	constructor(page: Page) {
		this.page = page;
		this.featuredFor = new FeaturedFor(page);
	}

	@step
	async shouldNotHavePositions() {
		await expect(
			this.page.getByText('There are no positions for this wallet'),
			'"There are no positions for this wallet" should be visible'
		).toBeVisible({ timeout: 10_000 });
	}

	@step
	async filterByProductType({
		currentFilter,
		productType,
	}: {
		currentFilter: ProductTypes;
		productType: ProductTypes;
	}) {
		const productFilterLocator = this.page
			.locator(`span:has-text("${currentFilter}")`)
			.locator('../..');

		await this.page.locator(`span:has-text("${currentFilter}")`).click();
		await productFilterLocator.getByRole('listitem').filter({ hasText: productType }).click();
		await expect(
			this.page.locator(`span:has-text("${productType}")`),
			`"${productType}" should be visible`
		).toBeVisible({
			timeout: portfolioTimeout,
		});
	}

	@step
	async shouldHaveSortByLable(lable: string) {
		await expect(
			this.page.locator('#react-select-2-input').locator('xpath=//preceding::div[1]')
		).toContainText(lable, {
			timeout: 10_000,
		});
	}

	@step
	async sortByNetValue(sort: 'High to Low' | 'Low to High') {
		await this.page.locator('#react-select-2-input').locator('../..').click();
		await this.page.locator(`#react-select-2-option-${sort === 'High to Low' ? 0 : 1}`).click();
	}

	@step
	async showEmptyPositions() {
		await this.page.getByText('empty positions').locator('..').locator('label').click();
	}

	@step
	async shouldHaveNetValuesGreaterThanOneCent() {
		// Wait for positions to be loaded
		await expect(
			this.page
				.getByRole('link')
				.filter({ hasText: 'Position #' })
				.locator('span:has-text("$")')
				.nth(0),
			`First position's Net Value should be visible`
		).toBeVisible({
			timeout: 15_000,
		});

		const netValues = await this.page
			.getByRole('link')
			.filter({ hasText: 'Position #' })
			.locator('span:has-text("$")')
			.allInnerTexts();

		expect(netValues.every((value) => parseFloat(value.slice(1)) > 0.01)).toBeTruthy();
	}

	@step
	async shouldHaveNetValuesGreaterAndLowerThanOneCent() {
		// Wait for positions to be loaded
		await expect(
			this.page
				.getByRole('link')
				.filter({ hasText: 'Position #' })
				.locator('span:has-text("$")')
				.nth(0),
			`First position's Net Value should be visible`
		).toBeVisible({
			timeout: 15_000,
		});

		const netValues = await this.page
			.getByRole('link')
			.filter({ hasText: 'Position #' })
			.locator('span:has-text("$")')
			.allInnerTexts();

		expect(
			netValues.some((value) => parseFloat(value.slice(1).replace('<', '')) > 0.01)
		).toBeTruthy();
		expect(
			netValues.some((value) => parseFloat(value.slice(1).replace('<', '')) < 0.01)
		).toBeTruthy();
	}

	/**
	 * @param position should be an integer; '1' for top position, '2'for second position, etc.
	 */
	@step
	async getNthNetValue(position: number) {
		// Wait for positions to be loaded
		await expect(
			this.page
				.getByRole('link')
				.filter({ hasText: 'Position #' })
				.locator('span:has-text("$")')
				.nth(0),
			`First position's Net Value should be visible`
		).toBeVisible({
			timeout: 15_000,
		});

		const netValue = await this.page
			.getByRole('link')
			.filter({ hasText: 'Position #' })
			.locator('span:has-text("$")')
			.nth(position - 1)
			.innerText();

		return parseFloat(netValue.slice(1).replace('<', ''));
	}

	@step
	async getNumberOfPositions() {
		const noPositions = this.page.getByText('There are no positions for this wallet');
		const positionsListed = this.page.getByRole('link').filter({ hasText: 'Position #' });
		const migratePositions = this.page.getByText('Why migrate?');

		let noPositionsCount: number;
		let positionsCount: {
			emptyPositionsCount: number;
			positionsListedCount: number;
			migratePositionsCount: number;
		} = { emptyPositionsCount: 0, positionsListedCount: 0, migratePositionsCount: 0 };

		// Wait for positions panel to fully load
		await expect(async () => {
			noPositionsCount = await noPositions.count();
			positionsCount.positionsListedCount = await positionsListed.count();
			positionsCount.migratePositionsCount = await migratePositions.count();
			expect(
				noPositionsCount +
					positionsCount.positionsListedCount +
					positionsCount.migratePositionsCount
			).toBeGreaterThan(0);
		}).toPass();

		if (noPositionsCount === 1) {
			return positionsCount;
		}

		const regExp = new RegExp('Show.*empty positions');
		const emptyPositionsText = await this.page.getByText(regExp).innerText();
		positionsCount.emptyPositionsCount = parseInt(
			emptyPositionsText.substring(4, emptyPositionsText.indexOf('empty'))
		);

		return positionsCount;
	}

	@step
	async getPositionsData() {
		let positionsData: {
			id: string;
			pool: string;
			type: string;
			protocol: string;
		}[] = [];

		const summerPositionsListed = this.page.getByRole('link').filter({ hasText: 'Position #' });
		const summerPositionsListedCount: number = await summerPositionsListed.count();

		for (let index = 0; index < summerPositionsListedCount; index++) {
			const positionData: PositionData = { id: '', pool: '', type: '', protocol: '' };

			const positionIdLocator = summerPositionsListed
				.nth(index)
				.locator('span:has-text("Position #")');
			const positionIdText = await positionIdLocator.innerText();
			positionData.id = positionIdText.slice(10);

			positionData.pool = await positionIdLocator.locator('xpath=//preceding::*[1]').innerText();
			positionData.type = await summerPositionsListed.nth(index).locator('span').nth(0).innerText();

			positionsData.push(positionData);
		}

		const migratePositionsListed = this.page.getByRole('link').filter({ hasText: 'Why migrate?' });
		const migratePositionsListedCount: number = await migratePositionsListed.count();

		for (let index = 0; index < migratePositionsListedCount; index++) {
			const positionData: PositionData = { id: '', pool: '', type: '', protocol: '' };

			positionData.pool = await migratePositionsListed
				.nth(index)
				.locator('span')
				.nth(1)
				.locator('xpath=//preceding::*[1]')
				.innerText();
			positionData.protocol = await migratePositionsListed
				.nth(index)
				.locator('span')
				.nth(1)
				.innerText();

			positionsData.push(positionData);
		}

		return positionsData;
	}
}
