import { expect, Locator, Page } from '@playwright/test';
import { Header } from './header';
import { ProductsList } from '../../common/productsList';
import { step } from '#noWalletFixtures';

export class ProductHub {
	readonly productHubLocator: Locator;

	readonly header: Header;

	readonly list: ProductsList;

	constructor(page: Page) {
		this.productHubLocator = page.locator('#product-hub').locator('..');
		this.header = new Header(this.productHubLocator);
		this.list = new ProductsList(page, this.productHubLocator);
	}

	@step
	async shouldLinkTo(page: 'Borrow' | 'Earn' | 'Multiply') {
		await expect(this.productHubLocator.locator('a:has-text("View all")')).toHaveAttribute(
			'href',
			`/${page.toLocaleLowerCase()}`
		);
	}

	@step
	async viewAll() {
		await this.productHubLocator.getByText('View all').click();
	}
}
