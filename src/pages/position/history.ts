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
	| 'Total collateral'
	| 'Position debt'
	| 'Loan To Value'
	| 'Liquidation price'
	| 'Multiple'
	| 'Net value'
	| 'Swapped'
	| 'Market price'
	| 'Fees incl. gas'
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
