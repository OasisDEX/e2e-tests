import { BrowserContext, Page } from '@playwright/test';

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

export const waitUntilStable = async (page: Page) => {
	await page.waitForLoadState('domcontentloaded');
	await page.waitForLoadState('networkidle');
};

async function getNotificationPageAndWaitForLoad(context: BrowserContext, extensionId: string) {
	const notificationPageUrl = `chrome-extension://${extensionId}/notification.html`;

	const isNotificationPage = (page: Page) => page.url().includes(notificationPageUrl);

	// Check if notification page is already open.
	let notificationPage = context.pages().find(isNotificationPage);

	if (!notificationPage) {
		notificationPage = await context.waitForEvent('page', {
			predicate: isNotificationPage,
		});
	}

	await waitUntilStable(notificationPage as Page);

	// Set pop-up window viewport size to resemble the actual MetaMask pop-up window.
	await notificationPage.setViewportSize({
		width: 360,
		height: 592,
	});

	return notificationPage;
}

export const approveRPC = async (extensionId: string, context: BrowserContext) => {
	const notificationPage = await getNotificationPageAndWaitForLoad(context, extensionId);

	await notificationPage
		// .locator('.confirmation-warning-modal__content section .mm-button-primary--type-danger')
		.locator('.confirmation-warning-modal__content .mm-button-primary--type-danger')
		.click();
};
