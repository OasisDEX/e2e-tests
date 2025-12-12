import { expect, step } from '#earnProtocolFixtures';
import { Page } from '@playwright/test';
import { expectDefaultTimeout } from 'utils/config';

export class Manage {
	readonly page: Page;

	constructor(page: Page) {
		this.page = page;
	}

	@step
	async shouldBeVisible() {
		await expect(
			this.page.getByText('Stake SUMR to earn rewards'),
			'"Stake SUMR to earn rewards" header shouldbe visible'
		).toBeVisible();
	}

	@step
	async openPage() {
		await expect(async () => {
			await this.page.goto('/earn/staking/manage');
			await this.shouldBeVisible();
		}).toPass();
	}

	@step
	async shouldHaveBalance({ balance, timeout }: { balance: string; timeout?: number }) {
		const regExp = new RegExp(`${balance}.*SUMR`);
		await expect(this.page.getByText('Balance', { exact: true }).locator('..')).toContainText(
			regExp,
			{ timeout: timeout ?? expectDefaultTimeout }
		);
	}
	@step
	async sumrAmountToStake(amount: string) {
		await this.page.locator('[class*="_inputWrapper_"] input').fill(amount);
	}

	@step
	async acceptPenaltyWarning() {
		await this.page.locator('[class*="_checkboxSectionWrapper_"]').click();
	}

	@step
	async approveSumr() {
		await this.page.getByRole('button', { name: 'Approve SUMR' }).click();
	}

	/**
	 * @param days should be between '0' and '1080' both included | 0: far left | 1080: far right
	 */
	@step
	async selectLockupDays(days: number) {
		const value = days / 1080;

		await expect(async () => {
			const initialSliderValue = await this.page
				.locator('input[type="range"]')
				.getAttribute('value');

			const slider = this.page.locator('input[type="range"]');
			const sliderBoundingBox = (await slider.boundingBox()) ?? { x: 0, y: 0, width: 0, height: 0 };

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
}
