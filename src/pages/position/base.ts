import { step } from '#noWalletFixtures';
import { expect, Page } from '@playwright/test';
import { expectDefaultTimeout } from 'utils/config';

export class Base {
	readonly page: Page;

	constructor(page: Page) {
		this.page = page;
	}

	@step
	async getLiquidationPrice(protocol?: 'Maker'): Promise<number> {
		const value = await this.page.locator('span:has-text("Liquidation Price") + span').innerText();
		const slicedValue = (protocol ? value.slice(1) : value.slice(0, value.indexOf(' '))).replace(
			',',
			''
		);

		return parseFloat(slicedValue);
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
			const sliderBoundingBox = (await slider.boundingBox()) ?? { x: 0, y: 0, width: 0, height: 0 };

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
		automation?: 'AutoSell' | 'AutoBuy' | 'Stop-Loss';
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
	async shouldHaveConfirmButton() {
		await expect(
			this.page.getByRole('button', { name: 'Confirm' }),
			'Should show "Confirm" button'
		).toBeVisible();
	}

	@step
	async removeTrigger() {
		await this.page.getByRole('button', { name: 'Remove trigger' }).click();
	}

	@step
	async shouldHaveTransactionCostOrFee(protocol?: 'Ajna' | 'Maker' | undefined) {
		const regExpCost = new RegExp(`(([0-9])\|(n/a))`);
		const regExpFee = new RegExp(`((\\$.*\\$)\|(n/a))`);
		const regExpFeePlusMaxGasFee = new RegExp(`(([0-9].*\\$)\|(n/a))`);

		let assertedText: string | RegExp = '';
		let expectedRegExp: string | RegExp = '';

		await expect(async () => {
			const maxTransactionCostIsVisible = await this.page
				.getByText('Max transaction cost')
				.isVisible();
			const transactionFeeIsVisible = await this.page.getByText('Transaction fee').isVisible();
			const feesPlusMaxGasFeeIsVisible = await this.page
				.getByText('Fees + (max gas fee)')
				.isVisible();

			expect(
				maxTransactionCostIsVisible || transactionFeeIsVisible || feesPlusMaxGasFeeIsVisible
			).toBeTruthy();

			assertedText = maxTransactionCostIsVisible
				? 'Max transaction cost'
				: transactionFeeIsVisible
				? 'Transaction fee'
				: 'Fees + (max gas fee)';
			expectedRegExp =
				maxTransactionCostIsVisible || !protocol
					? regExpCost
					: protocol === 'Maker'
					? regExpFeePlusMaxGasFee
					: regExpFee;
		}).toPass();

		await expect(
			this.page.getByText(assertedText).locator(protocol === 'Maker' ? '../..' : '..'),
			'Should have `n/a` or expected amount'
		).toHaveText(expectedRegExp, { timeout: expectDefaultTimeout * 5 });
	}
}
