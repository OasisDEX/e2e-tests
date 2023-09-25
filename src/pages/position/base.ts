import { expect, Page } from '@playwright/test';

export class Base {
	readonly page: Page;

	constructor(page: Page) {
		this.page = page;
	}

	async getLiquidationPrice(): Promise<number> {
		const value = await this.page.locator('span:has-text("Liquidation Price") + span').innerText();
		return parseFloat(value.slice(0, value.indexOf(' ')));
	}

	async getLoanToValue(): Promise<number> {
		const value = await this.page.locator('span:has-text("Loan to Value") + span').innerText();
		return parseFloat(value.slice(0, -1));
	}

	async waitForSliderToBeEditable() {
		await expect(async () => {
			await expect(this.page.locator('input[type="range"]')).not.toHaveAttribute('max', '0');
		}).toPass();
	}

	/**
	 *
	 * @param value should be between '0' and '1' both included | 0: far left | 1: far right
	 */
	async moveSlider({ process, value }: { process: 'setup' | 'manage'; value: number }) {
		await expect(async () => {
			const initialSliderValue = await this.page
				.locator('input[type="range"]')
				.getAttribute('value');

			const slider = this.page.locator('input[type="range"]');
			const sliderBoundingBox = await slider.boundingBox();

			// Scroll down so that slider is fully visible and next dragTo doesn't fail
			await this.page
				.getByText(process === 'setup' ? 'Connect a wallet' : 'Adjust Risk')
				.scrollIntoViewIfNeeded();

			await slider.dragTo(slider, {
				force: true,
				targetPosition: {
					x: sliderBoundingBox.width * value,
					y: 0,
				},
			});

			const newSliderValue = await this.page.locator('input[type="range"]').getAttribute('value');
			expect(newSliderValue !== initialSliderValue).toBe(true);
		}).toPass();
	}

	async confirm() {
		await this.page.getByRole('button', { name: 'Confirm' }).click();
	}
}
