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

	async deposit({ token, amount }: { token: string; amount: string }) {
		await this.page
			.getByText(`Deposit ${token}`)
			.locator('../..')
			.getByPlaceholder(`0 ${token}`)
			.fill(amount);
	}

	async borrow({ token, amount }: { token: string; amount: string }) {
		await this.page
			.getByText(`Borrow ${token}`)
			.locator('../..')
			.getByPlaceholder(`0 ${token}`)
			.fill(amount);
	}

	async shouldHaveLiquidationPrice({ amount, pair }: { amount: string; pair: string }) {
		const regExp = new RegExp(`${amount} ${pair}`);
		await expect(this.page.locator('span:has-text("Liquidation Price") + span')).toContainText(
			regExp,
			{ timeout: 10_000 } // Liquidation price takes longer to be updated
		);
	}

	async shouldHaveCurrentPrice({ amount, pair }: { amount: string; pair: string }) {
		const regExp = new RegExp(`${amount} ${pair}`);
		await expect(this.page.locator('span:has-text("Current Price") + span')).toContainText(regExp);
	}

	async shouldHaveMaxBorrowingAmount({ amount, token }: { amount: string; token: string }) {
		const regExp = new RegExp('Max ' + amount + ' ' + token);
		await expect(
			this.page.locator(`div:has-text("Borrow ${token}") + div:has-text("Max")`)
		).toContainText(regExp);
	}
}
