import { expect, Page } from '@playwright/test';
import { OrderInformation } from './orderInformation';

export class Setup {
	readonly page: Page;

	readonly orderInformation: OrderInformation;

	constructor(page: Page) {
		this.page = page;
		this.orderInformation = new OrderInformation(page);
	}

	async acknowlegeAjnaInfo() {
		await this.page.getByText('I understand').click();
	}

	async deposit(amount: string) {
		await this.page.getByPlaceholder('0 ').fill(amount);
	}

	async shouldHaveLiquidationPrice() {
		await expect(this.page.locator('span:has-text("Liquidation Price") + span')).not.toHaveText(
			'-'
		);
	}

	async shouldHaveCurrentPrice() {
		await expect(this.page.locator('span:has-text("Current Price") + span')).not.toHaveText('-');
	}
}
