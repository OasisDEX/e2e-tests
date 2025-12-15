import { expect, step } from '#noWalletFixtures';
import { Page } from '@playwright/test';

export class Sumr {
	readonly page: Page;

	constructor(page: Page) {
		this.page = page;
	}

	@step
	async shouldBeVisible() {
		await expect(this.page.getByText('SUMR: DeFi’s productive asset')).toBeVisible();
	}

	@step
	async openPage() {
		await expect(async () => {
			await this.page.goto('/earn/sumr');
			await this.shouldBeVisible();
		}).toPass();
	}

	@step
	async shouldHaveHeader(text: string) {
		await expect(this.page.locator('h1')).toContainText(text);
	}

	@step
	async connectWallet() {
		await this.page.getByRole('button', { name: 'Connect Wallet' }).click();
	}

	/**
	 * @param keyword string
	 * @param selectResultNth number; first result will be '0'
	 */
	@step
	async search(keyword: string, args?: { selectResultNth: number }) {
		const inputLocator = this.page.locator('input[placeholder="Search wallet address or ENS"]');
		await expect(inputLocator).toBeVisible();
		await this.page.waitForTimeout(1_000);

		await inputLocator.fill(keyword);
		await this.page.waitForTimeout(2_000);

		const searchResults = this.page.locator(`li:has-text("${keyword}")`);
		const searchResultIsVisible = await searchResults.nth(0).isVisible();

		if (searchResultIsVisible) {
			await searchResults.nth(args?.selectResultNth ?? 0).click();
		}

		await expect(this.page.getByRole('button', { name: 'Connect Wallet' })).toBeEnabled();
	}

	@step
	async claim$Sumr() {
		await this.page.getByRole('button', { name: 'Claim $SUMR' }).click();
	}

	@step
	async viewYourAddress() {
		await this.page.getByRole('button', { name: 'View your address' }).click();
	}

	@step
	async enterAddress(address: string) {
		const inputLocator = this.page.locator('input[placeholder="Search wallet address"]');
		await expect(inputLocator).toBeVisible();
		await this.page.waitForTimeout(1_000);

		await inputLocator.fill(address);
		await this.page.waitForTimeout(2_000);

		await expect(this.page.getByRole('button', { name: 'Check address' })).toBeVisible();
	}

	@step
	async checkAddress() {
		await this.page.getByRole('button', { name: 'Check address' }).click();
	}

	@step
	async buySUMR() {
		await this.page.getByRole('button', { name: 'Buy SUMR' }).click();
	}

	@step
	async stakeSUMR(section: 'Intro' | 'What you need to know') {
		await this.page
			.getByRole('button', { name: 'Stake SUMR' })
			.nth(section === 'Intro' ? 0 : 1)
			.click();
	}

	@step
	async shouldHaveYieldSource() {
		const regExpSource1 = new RegExp('Yield source 1.*Up.*to.*[0-9].[0-9]{2}%.*USDC yield');
		await expect(this.page.locator('[class*="_yieldSourceColumn_"]').nth(0)).toContainText(
			regExpSource1
		);

		const regExpSource2 = new RegExp('Yield source 2.*Up.*to.*[0-4].[0-9]{2}%.*SUMR APY');
		await expect(this.page.locator('[class*="_yieldSourceColumn_"]').nth(1)).toContainText(
			regExpSource2
		);
	}

	@step
	async selectWhatYouNeedToKnowTab(tab: 'Facts' | 'Timeline' | 'FAQ') {
		const sectionLocator = this.page
			.getByText('What you need to know')
			.locator('xpath=//following-sibling::*[1]');

		await sectionLocator.getByRole('button', { name: tab }).click();
	}
}
