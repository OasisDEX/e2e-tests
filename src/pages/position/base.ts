import { step } from '#noWalletFixtures';
import { expect, Page } from '@playwright/test';

export class Base {
	readonly page: Page;

	constructor(page: Page) {
		this.page = page;
	}

	@step
	async getLiquidationPrice(): Promise<number> {
		const value = await this.page.locator('span:has-text("Liquidation Price") + span').innerText();
		return parseFloat(value.slice(0, value.indexOf(' ')).replace(',', ''));
	}

	@step
	async getLoanToValue(protocol?: 'Ajna'): Promise<number> {
		const ltvLocator = protocol
			? 'span:has-text("Loan to Value") + span span'
			: 'span:has-text("Loan to Value") + span';
		const value = await this.page.locator(ltvLocator).innerText();
		return parseFloat(value.slice(0, -1));
	}

	@step
	async getLendingPrice(): Promise<number> {
		const value = await this.page.locator('span:has-text("lending price") + span').innerText();
		return parseFloat(value);
	}

	@step
	async getMaxLTV(): Promise<number> {
		const value = await this.page.locator('span:has-text("Max LTV") + span').innerText();
		return parseFloat(value.slice(0, -1));
	}

	@step
	async waitForSliderToBeEditable() {
		await expect(async () => {
			await expect(this.page.locator('input[type="range"]')).not.toHaveAttribute('max', '0');
		}).toPass();
	}

	/**
	 * @param value should be between '0' and '1' both included | 0: far left | 1: far right
	 */
	@step
	async moveSlider({
		value,
		withWallet,
		process,
	}: {
		value: number;
		withWallet?: boolean;
		process?: 'set up' | 'manage';
	}) {
		await expect(async () => {
			const initialSliderValue = await this.page
				.locator('input[type="range"]')
				.getAttribute('value');

			const slider = this.page.locator('input[type="range"]');
			const sliderBoundingBox = await slider.boundingBox();

			// Scroll down so that slider is fully visible and next dragTo doesn't fail
			if (!withWallet && process) {
				await this.page
					.getByText(process === 'set up' ? 'Connect a wallet' : 'Adjust Risk')
					.scrollIntoViewIfNeeded();
			}

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

	/**
	 * @param value should be between '0' and '1' both included | 0: far left | 1: far right
	 */
	@step
	async moveSliderAutomations({
		automation,
		value,
	}: {
		automation: 'AutoSell' | 'AutoBuy' | 'Stop-Loss';
		value: number;
	}) {
		await expect(async () => {
			const triggerSlider = this.page
				.locator('input[type="range"]')
				.nth(automation === 'AutoSell' ? 1 : 0);

			const initialSliderValue = await triggerSlider.getAttribute('value');

			const sliderOffsetWidth = await triggerSlider.evaluate((el) => {
				return el.getBoundingClientRect().width;
			});

			await triggerSlider.click({
				force: true,
				position: { x: sliderOffsetWidth * value, y: 0 },
			});

			const newSliderValue = await triggerSlider.getAttribute('value');

			expect(newSliderValue !== initialSliderValue).toBe(true);
		}).toPass();
	}

	@step
	async moveSliderAutomationsOmni({
		value,
		sliderPosition,
	}: {
		value: number;
		sliderPosition?: 1 | 2 | 3;
	}) {
		await expect(async () => {
			const sliderRail = this.page
				.locator('.rc-slider-rail')
				.nth(sliderPosition ? sliderPosition - 1 : 0);
			const sliderPill = this.page
				.locator('[role="slider"]')
				.nth(sliderPosition ? sliderPosition - 1 : 0);

			const initialPillValue = await sliderPill.getAttribute('aria-valuenow');

			const sliderOffsetWidth = await sliderRail.evaluate((el) => {
				return el.getBoundingClientRect().width;
			});

			await sliderRail.click({
				force: true,
				position: { x: sliderOffsetWidth * value, y: 0 },
			});

			const newPillValue = await sliderPill.getAttribute('aria-valuenow');
			expect(newPillValue !== initialPillValue).toBe(true);
		}).toPass();
	}

	/**
	 * @param value should be between '0' and '1' both included | 0: far left | 1: far right
	 */
	@step
	async moveSliderOmni({ value }: { value: number }) {
		await expect(async () => {
			const sliderRail = this.page.locator('.rc-slider-rail');
			const sliderPill = this.page.locator('[role="slider"]');

			const initialPillValue = await sliderPill.getAttribute('aria-valuenow');

			const sliderOffsetWidth = await sliderRail.evaluate((el) => {
				return el.getBoundingClientRect().width;
			});

			await sliderRail.click({
				force: true,
				position: { x: sliderOffsetWidth * value, y: 0 },
			});

			const newPillValue = await sliderPill.getAttribute('aria-valuenow');
			expect(newPillValue !== initialPillValue).toBe(true);
		}).toPass();
	}

	@step
	async setNoThreshold() {
		await this.page.locator('span > span:has-text("Set No Threshold")').click();
	}

	@step
	async setThreshold() {
		await this.page.locator('span:has-text("Set Threshold")').click();
	}

	@step
	async shouldHaveMessage(text: string) {
		await expect(this.page.getByText(text), `"${text}" should be visible`).toBeVisible();
	}

	@step
	async confirm() {
		await this.page.getByRole('button', { name: 'Confirm' }).click();
	}

	@step
	async removeTrigger() {
		await this.page.getByRole('button', { name: 'Remove trigger' }).click();
	}
}
