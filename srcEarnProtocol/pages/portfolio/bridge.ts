import { expect, step } from '#earnProtocolFixtures';
import { Locator, Page } from '@playwright/test';
import { toUtf8CodePoints } from 'ethers';
import { expectDefaultTimeout } from 'utils/config';

type BridgeNetworks = 'Arbitrum' | 'Base' | 'Mainnet' | 'Sonic';

export class Bridge {
	readonly page: Page;

	readonly bridgeLocator: Locator;

	constructor(page: Page) {
		this.page = page;
		this.bridgeLocator = page.locator('[class*="bridgePageWrapper"]');
	}

	@step
	async shouldBeVisible(args?: { timeout: number }) {
		await expect(this.bridgeLocator.getByText('Fees')).toBeVisible({
			timeout: args?.timeout ?? expectDefaultTimeout,
		});
	}

	@step
	async open(walletAddress: string) {
		await expect(async () => {
			await this.page.goto(`/earn/bridge/${walletAddress}?via=portfolio`);
			await this.shouldBeVisible({ timeout: expectDefaultTimeout * 2 });
		}).toPass();
	}

	@step
	async selectNetwork({ fromOrTo, network }: { fromOrTo: 'From' | 'To'; network: BridgeNetworks }) {
		const dropdownLocator = this.bridgeLocator.locator(
			`label:has-text("${fromOrTo}") + [class*="_dropdown_"]`
		);

		await expect(dropdownLocator).toBeVisible();

		await dropdownLocator.click();
		await dropdownLocator.locator(`[class*="_dropdownOption_"]:has-text("${network}")`).click();

		await expect(dropdownLocator).toContainText(network);
	}

	@step
	async shouldHaveBalance(balance: string) {
		const regExp = new RegExp(balance);
		await expect(this.bridgeLocator.locator('p:has-text("balance") + p')).toContainText(regExp);
	}

	@step
	async enterAmount(amount: string) {
		await this.bridgeLocator.locator('input').clear();
		await this.bridgeLocator.locator('input').fill(amount);
		// Click outside input box for app to process input amount
		await this.bridgeLocator.click({ position: { x: 0, y: 0 } });
	}

	@step
	async shouldHaveAmountInUSD(amount: string) {
		const regExp = new RegExp(`\\$${amount}`);
		await expect(this.bridgeLocator.locator('input + p')).toContainText(regExp);
	}

	@step
	async confirmBridge() {
		await this.bridgeLocator.getByRole('button', { name: 'Bridge', exact: true }).click();
	}
}
