import { expect, step } from '#institutionsNoWalletFixtures';
import { Page } from '@playwright/test';

export class FeeAndRevenueAdmin {
	readonly page: Page;

	constructor(page: Page) {
		this.page = page;
	}

	@step
	async shouldBeVisible() {
		await expect(
			this.page.getByRole('heading', { name: 'Fee & revenue admin' }),
			'"Fee & revenue admin" header should be visible'
		).toBeVisible();
	}

	@step
	async shouldHaveFeeRevenue({ vaultAumFee }: { vaultAumFee: string }) {
		const regExp = new RegExp(`${vaultAumFee}%`);
		await expect(
			this.page.getByRole('row').filter({ hasText: 'Vault AUM Fee' }),
			`Should have Vault AUM Fee: ${regExp}%`
		).toContainText(regExp);
	}

	@step
	async shouldHaveNoThirdPArtyCosts() {
		await expect(this.page.getByText('No third party costs')).toBeVisible();
	}
}
