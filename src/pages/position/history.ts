import { expect, Page } from '@playwright/test';
import { step } from '#noWalletFixtures';

type LogName =
	| 'Auto sell added'
	| 'Auto sell executed'
	| 'Borrow'
	| 'Open Position'
	| 'Migrated from Spark into Summer.Fi!';

type LogPropertyName =
	| 'Collateral Deposit'
	| 'Execution LTV'
	| 'Fees incl. gas'
	| 'Liquidation price'
	| 'Loan To Value'
	| 'Market price'
	| 'Minimum sell price'
	| 'Multiple'
	| 'Net value'
	| 'Position debt'
	| 'Swapped'
	| 'Target LTV'
	| 'Total collateral'
	| 'View on Arbiscan'
	| 'View on Etherscan';

type LogProperty = { name: LogPropertyName; value: string };

type LogData = LogProperty[];

export class History {
	readonly page: Page;

	constructor(page: Page) {
		this.page = page;
	}

	@step
	async openLog(logname: LogName) {
		await this.page
			.locator(`li:has-text("${logname}")`)
			.filter({ has: this.page.locator('time') })
			.last()
			.click();
	}

	@step
	async shouldHaveLogData(logData: LogData) {
		for (const property in logData) {
			if (logData[property].name.includes('View on ')) {
				await expect(
					this.page.locator(`a[href="${logData[property].value}"]`),
					`logData[property].name link should be visible`
				).toBeVisible();
			} else {
				await expect(
					this.page.getByText(logData[property].name, { exact: true }).locator('..')
				).toContainText(logData[property].value);
			}
		}
	}
}
