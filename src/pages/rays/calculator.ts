import { expect, step } from '#noWalletFixtures';
import { Locator, Page } from '@playwright/test';
import { expectDefaultTimeout } from 'utils/config';

export class Calculator {
	readonly page: Page;

	readonly calculatorLocator: Locator;

	constructor(page: Page) {
		this.page = page;
		this.calculatorLocator = this.page
			.getByRole('button', { name: 'Calculate $RAYS' })
			.locator('..');
	}

	@step
	async typeAmount(amount: string) {
		await this.calculatorLocator.locator('input').first().type(amount);
	}

	@step
	async selectMigration(selection: 'Yes' | 'No') {
		await this.calculatorLocator
			.locator('div[class*="_radioButtonWrapper"]')
			.filter({ hasText: selection })
			.click();
	}

	@step
	async calculateRays() {
		await this.calculatorLocator.getByRole('button', { name: 'Calculate $RAYS' }).click();
	}

	@step
	async shouldEstimateRays({
		perYear,
		migration,
		afterOneYear,
	}: {
		perYear: number;
		migration: number;
		afterOneYear: number;
	}) {
		await expect(async () => {
			const estimatedRaysPerYear: string = await this.calculatorLocator
				.locator('div[class*="CalculatorModal_valueBox"]')
				.nth(0)
				.getAttribute('title');
			expect(estimatedRaysPerYear).toContain(perYear === 0 ? '0' : perYear.toExponential(1));

			const estimatedRaysMigration: string = await this.calculatorLocator
				.locator('div[class*="CalculatorModal_valueBox"]')
				.nth(1)
				.getAttribute('title');
			expect(estimatedRaysMigration).toContain(migration === 0 ? '0' : migration.toExponential(1));

			const estimatedRaysAfterOneYear: string = await this.calculatorLocator
				.locator('div[class*="CalculatorModal_valueBox"]')
				.nth(2)
				.getAttribute('title');
			expect(estimatedRaysAfterOneYear).toContain(
				afterOneYear === 0 ? '0' : afterOneYear.toExponential(1)
			);
		}).toPass({ timeout: expectDefaultTimeout });
	}
}
