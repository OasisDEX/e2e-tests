import { step } from '#noWalletFixtures';
import { expect, Locator } from '@playwright/test';
import { portfolioTimeout } from 'utils/config';

type AutomationStatus = {
	automation: 'Stop-Loss' | 'Auto Sell' | 'Auto Buy' | 'Take Profit';
	status: 'On' | 'Off';
}[];

export class Position {
	readonly positionLocator: Locator;

	constructor(positionLocator: Locator) {
		this.positionLocator = positionLocator;
	}

	@step
	async shouldHave(args: { assets?: string }) {
		if (args.assets) {
			await expect(
				this.positionLocator.getByText('Position').locator('xpath=//preceding::span[1]')
			).toContainText(args.assets, { timeout: portfolioTimeout });
		}
	}

	@step
	async view() {
		await expect(
			this.positionLocator.getByRole('button', { name: 'View' }),
			'"View" should be visible'
		).toBeVisible({
			timeout: portfolioTimeout,
		});
		await this.positionLocator.getByRole('button', { name: 'View' }).click();
	}

	@step
	async shouldHaveAutomations(automations: AutomationStatus) {
		for (let i = 0; i < automations.length; i++) {
			const automationIcon: Locator = await this.positionLocator
				.getByText(automations[i].automation)
				.locator('..');

			const backgroundColor = await automationIcon.evaluate((el) => {
				return window.getComputedStyle(el).getPropertyValue('background-color');
			});

			const actualStatus = backgroundColor === 'rgb(231, 252, 250)' ? 'On' : 'Off';

			expect(
				actualStatus,
				`${automations[i].automation} should be ${automations[i].status}`
			).toEqual(automations[i].status);
		}
	}
}
