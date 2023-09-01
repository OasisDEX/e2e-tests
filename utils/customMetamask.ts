import playwright from '@synthetixio/synpress/commands/playwright';

export const allowToAddRPC = async () => {
	const notificationPage = await playwright.switchToMetamaskNotification();
	await playwright.waitAndClick(
		'#popover-content .confirmation-warning-modal__footer__approve-button',
		notificationPage
	);
	return true;
};
