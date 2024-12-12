import { expect, Locator, Page } from '@playwright/test';
import { Pool } from './pool';
import { step } from '#noWalletFixtures';
import { expectDefaultTimeout } from 'utils/config';

export class ProductsList {
	readonly page: Page;

	readonly listLocator: Locator;

	readonly pool: Pool;

	readonly poolLocator: Locator;

	readonly poolPairLocator: Locator;

	constructor(page: Page, productHubLocator: Locator, poolLocator: Locator) {
		this.page = page;
		this.listLocator = productHubLocator.getByRole('table');
		this.pool = new Pool(poolLocator);
		this.poolLocator = poolLocator;
		this.poolPairLocator = poolLocator.locator('td:nth-child(1)');
	}

	get first() {
		return this.nthPool(0);
	}

	nthPool(nth: number) {
		return new Pool(this.poolLocator.nth(nth));
	}

	byPairPool(pair: string) {
		return new Pool(this.poolLocator.filter({ has: this.page.getByText(pair, { exact: true }) }));
	}

	@step
	async getNumberOfPools() {
		// Wait for 1st item to be displayed to avoid random fails
		await this.poolLocator.first().waitFor();

		const count = await this.poolLocator.count();
		return count;
	}

	@step
	async getAllPairs() {
		// Wait for 1st item to be displayed to avoid random fails
		await this.poolLocator.first().waitFor();

		const allPairs = await this.poolPairLocator.allInnerTexts();
		return allPairs;
	}

	// This function is only valid for Ajna Pool finder
	@step
	async allPoolsShouldBe(positionCategory: 'Borrow' | 'Multiply' | 'Earn') {
		const poolButton = this.poolLocator.getByRole('button');
		// Wait for 1st item to be displayed to avoid random fails
		await poolButton.first().waitFor();

		const poolButtons = await poolButton.all();

		for (let i = 0; i < poolButtons.length; i++) {
			await expect(poolButton.nth(i)).toHaveText(positionCategory);
		}
	}

	@step
	async allPoolsBorrowRateShouldBeGreaterThanZero() {
		// Wait for 1st item to be displayed to avoid random fails
		await this.poolLocator.first().waitFor();

		await expect(this.listLocator.locator('thead th').nth(3)).toHaveText('Borrow rate');

		const allBorrowRates = await this.poolLocator.locator('td:nth-child(4)').allInnerTexts();

		const allBorrowRatesNumbers = allBorrowRates.map((element) =>
			parseFloat(element.split('%')[0])
		);
		// Log for debugging purposes
		console.log('allBorrowRatesNumbers: ', allBorrowRatesNumbers);

		expect(
			allBorrowRatesNumbers.every((rate) => rate > 0),
			'All Borrow rates should be > 0'
		).toBeTruthy();
	}

	@step
	async allPoolsMaxMultipleShouldBeGreaterThanZero() {
		// Wait for 1st item to be displayed to avoid random fails
		await this.poolLocator.first().waitFor();

		await expect(this.listLocator.locator('thead th').nth(2)).toHaveText('Max multiple');

		const allMaxMultiples = await this.poolLocator.locator('td:nth-child(3)').allInnerTexts();

		const allMaxMultiplesNumbers = allMaxMultiples.map((element) =>
			parseFloat(element.split('x')[0])
		);
		// Log for debugging purposes
		console.log('allMaxMultiplesNumbers: ', allMaxMultiplesNumbers);

		expect(
			allMaxMultiplesNumbers.every((rate) => rate > 0),
			'All Max Multiples should be > 0'
		).toBeTruthy();
	}

	@step
	async allPoolsShouldHaveManagement() {
		// Wait for 1st item to be displayed to avoid random fails
		await this.poolLocator.first().waitFor();

		await expect(this.listLocator.locator('thead th').nth(2)).toHaveText('Management');

		const allPoolsManagement = await this.poolLocator.locator('td:nth-child(3)').allInnerTexts();

		// Log for debugging purposes
		console.log('allPoolsManagement: ', allPoolsManagement);

		expect(
			allPoolsManagement.every((managementType) => ['Active', 'Passive'].includes(managementType)),
			'All Management values should be either "Active" or "Passive"'
		).toBeTruthy();
	}

	@step
	async allPoolsCollateralShouldContain(token: string) {
		// Wait for 1st item to be displayed to avoid random fails
		await this.poolPairLocator.first().waitFor();

		const pools = await this.poolPairLocator.all();

		for (let i = 0; i < pools.length; i++) {
			await expect(this.poolPairLocator.nth(i)).toContainText(token + '/');
		}
	}

	@step
	async allPoolsQuoteShouldContain(token: string) {
		// Wait for 1st item to be displayed to avoid random fails
		await this.poolPairLocator.first().waitFor();

		const pools = await this.poolPairLocator.all();

		for (let i = 0; i < pools.length; i++) {
			await expect(this.poolPairLocator.nth(i)).toContainText('/' + token);
		}
	}

	@step
	async shouldHavePoolsCount(count: number) {
		const rowLocator = this.poolLocator;
		await expect(rowLocator.nth(0), 'First pool row should be visible').toBeVisible({
			timeout: expectDefaultTimeout * 3,
		});

		const rowsCount = this.poolLocator.count();
		expect(await rowsCount).toEqual(count);
	}

	@step
	async shouldHaveOneOrMorePools() {
		// Wait for 1st item to be displayed to avoid random fails
		await this.poolLocator.first().waitFor({ timeout: expectDefaultTimeout * 3 });

		expect(await this.poolLocator.count()).toBeGreaterThanOrEqual(1);
	}

	@step
	async shouldHaveTokensPair(pair: string) {
		await expect(this.poolPairLocator.nth(0)).toContainText(pair);
	}

	@step
	async openPoolFinder() {
		await this.listLocator.getByRole('button', { name: 'Search custom pools' }).click();
	}

	@step
	async shouldBePage(pageNumber: string) {
		const actualPageNumber = await this.page.locator('#assets-table > div > span').innerText();

		expect(pageNumber, `It should be page number: ${pageNumber}`).toEqual(
			actualPageNumber.split(' /')[0]
		);
	}

	@step
	async nextPage() {
		await this.page.locator('#assets-table > div > button').nth(1).click();
	}

	@step
	async previousPage() {
		await this.page.locator('#assets-table > div > button').nth(0).click();
	}
}
