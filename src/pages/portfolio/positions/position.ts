import { step } from '#noWalletFixtures';
import { expect, Locator } from '@playwright/test';
import { portfolioTimeout } from 'utils/config';
import { Tokens } from 'utils/testData';

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
	async shouldHave(args: {
		assets?: string | { usdsStakingType: 'Sky Rewards Rate' | 'Chronicle Points' };
		rays?: string;
		netValue?: { token?: Tokens; greaterThanZero?: boolean; amount?: string };
		earnings?: { token?: Tokens; greaterThanZero?: boolean; amount?: string };
		currentAPY?: string;
	}) {
		if (args.assets) {
			const assetsLocator = this.positionLocator
				.getByText(typeof args.assets === 'string' ? 'Position' : args.assets.usdsStakingType)
				.locator('xpath=//preceding::*[1]');

			const assetsText = typeof args.assets === 'string' ? args.assets : 'USDS';

			await expect(assetsLocator).toContainText(assetsText);
		}

		if (args.rays) {
			const regExp = new RegExp(`\\+ ${args.rays}`);
			await expect(this.positionLocator.getByText('Rays / year')).toHaveText(regExp);
		}

		if (args.netValue) {
			const netValueLocator = this.positionLocator
				.getByTestId('portfolio-position-details')
				.filter({ hasText: 'Net Value is the current value of the collateral ' })
				.locator('span')
				.nth(1);

			if (args.netValue?.amount) {
				const regExp = new RegExp(`${args.netValue?.amount} ${args.netValue?.token ?? ''}`);
				await expect(netValueLocator).toHaveText(regExp);
			}

			if (args.netValue?.greaterThanZero) {
				const netValueText = await netValueLocator.innerText();
				const netValueNumber = parseFloat(netValueText.replace(args.netValue?.token ?? '$', ''));

				expect(netValueNumber).toBeGreaterThan(0);
			}
		}

		if (args.earnings) {
			const netValueLocator = this.positionLocator
				.getByTestId('portfolio-position-details')
				.filter({ hasText: 'The earnings show the additional ' })
				.locator('span')
				.nth(1);

			if (args.netValue?.amount) {
				const regExp = new RegExp(`${args.netValue?.amount} ${args.netValue?.token ?? ''}`);
				await expect(netValueLocator).toHaveText(regExp);
			}

			if (args.netValue?.greaterThanZero) {
				const netValueText = await netValueLocator.innerText();
				const netValueNumber = parseFloat(netValueText.replace(args.netValue?.token ?? '$', ''));

				expect(netValueNumber).toBeGreaterThan(0);
			}
		}

		if (args.currentAPY) {
			const regExp = new RegExp(`${args.currentAPY}%`);
			await expect(
				this.positionLocator
					.getByTestId('portfolio-position-details')
					.filter({ hasText: 'Annualised rate this position is currently earning' })
			).toHaveText(regExp);
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
			const automationIcon: Locator = this.positionLocator
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

	@step
	async getRaysPerYear() {
		const raysText = await this.positionLocator.getByText(' Rays / year').innerText();
		const raysNumber = parseFloat(raysText.slice(2, -12).replace(',', ''));

		return raysNumber;
	}
}
