// import playwright from '@synthetixio/synpress/commands/playwright';

// import * as playwright from '@synthetixio/synpress/commands';

import * as playwright from '@synthetixio/synpress';

import { Page } from '@playwright/test';
import { MetaMask } from '@synthetixio/synpress/playwright';

export const allowToAddRPC = async (metamask: MetaMask) => {
	// await metamask.notificationPage.page.

	// ============

	const notificationPage = await playwright.switchToMetamaskNotification();
    const notificationPage = await playwright.();
	await playwright.waitAndClick(
		'#popover-content .confirmation-warning-modal__footer__approve-button',
		notificationPage
	);
	return true;
};

export const changeToCustomGasSettings = async () => {
	const notificationPage = await playwright.switchToMetamaskNotification();
	await playwright.waitAndClick('button[data-testid="edit-gas-fee-button"]', notificationPage);
	await playwright.waitAndClick('button[aria-label="custom"]', notificationPage);
	await playwright.waitAndSetValue('55', 'input[data-testid="base-fee-input"]', notificationPage);
	await playwright.waitAndClick(
		'#popover-content .popover-footer button.btn-primary',
		notificationPage
	);

	return true;
};

// export async function addNewAccount(page: Page, accountName: string) {
// 	// TODO: Use zod to validate this.
// 	if (accountName.length === 0) {
// 		throw new Error('[AddNewAccount] Account name cannot be an empty string');
// 	}

// 	await page.locator(Selectors.accountMenu.accountButton).click();

// 	await page.locator(Selectors.accountMenu.addAccountMenu.addAccountButton).click();
// 	await page.locator(Selectors.accountMenu.addAccountMenu.addNewAccountButton).click();

// 	await page
// 		.locator(Selectors.accountMenu.addAccountMenu.addNewAccountMenu.accountNameInput)
// 		.fill(accountName);

// 	await page.locator(Selectors.accountMenu.addAccountMenu.addNewAccountMenu.createButton).click();
// }
