import { expect, Locator, Page } from '@playwright/test';
import { Header } from './header';
import { ProductsList } from '../../common/productsList';
import { step } from '#noWalletFixtures';

export class ProductHub {
	readonly productHubLocator: Locator;

	readonly header: Header;

	readonly list: ProductsList;

	constructor(page: Page) {
		this.productHubLocator = page.locator('#product-hub');
		this.header = new Header(page.locator('#product-hub > div:nth-child(1)'));
		this.list = new ProductsList(
			page,
			this.productHubLocator,
			this.productHubLocator.locator('tbody tr[role="link"]')
		);
	}

	@step
	async shouldLinkTo(page: 'Borrow' | 'Earn' | 'Multiply') {
		const regExp = new RegExp(`\\/${page.toLocaleLowerCase()}`);
		await expect(this.productHubLocator.locator('a:has-text("View all")')).toHaveAttribute(
			'href',
			regExp
		);
	}

	@step
	async viewAll() {
		await this.productHubLocator.getByText('View all').click();
	}
}
