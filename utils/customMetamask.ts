import playwright from '@synthetixio/synpress/commands/playwright';

export const allowToAddRPC = async () => {
	const notificationPage = await playwright.switchToMetamaskNotification();
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
