import { expect, Page } from '@playwright/test';
import { step } from '#noWalletFixtures';

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
	| 'Fees incl. gas';

type LogProperty = { property: LogPropertyName; value: string };

type LogData = LogProperty[];

export class History {
	readonly page: Page;

	constructor(page: Page) {
		this.page = page;
	}

	@step
	async openLog(logname: 'Open Position') {
		await this.page.locator(`li:has-text("${logname}")`).click();
	}

	@step
	async shouldHaveLogData(logData: LogData) {
		for (const property in logData) {
			await expect(
				this.page.getByText(logData[property].property, { exact: true }).locator('..')
			).toContainText(logData[property].value);
		}
	}
}
