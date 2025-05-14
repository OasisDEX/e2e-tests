import { expect } from '#earnProtocolFixtures';
import { MetaMask } from '@synthetixio/synpress/playwright';
import { App } from 'srcEarnProtocol/app';
import { LazyNominatedTokens } from 'srcEarnProtocol/utils/types';

// Deposit flow until rejecting first tx
export const switchPosition = async ({
	metamask,
	app,
	nominatedToken,
	targetToken,
}: {
	metamask: MetaMask;
	app: App;
	nominatedToken: LazyNominatedTokens;
	targetToken: LazyNominatedTokens;
}) => {
	await app.positionPage.sidebar.switch.selectTargetPosition({ token: targetToken });
	await app.positionPage.sidebar.switch.previewSwitch();

	const sidebarButtonLocator = app.page.locator('[class*="_sidebarCta_"] button').first();

	await expect(
		sidebarButtonLocator,
		'[Agree], [Approve] or [Switch] buttons should not be visible'
	).toContainText(/Agree|Approve|Switch/);

	let sidebarButtonLabel = await sidebarButtonLocator.innerText();

	// Sign T&C if needed
	if (sidebarButtonLabel.includes('Agree and sign')) {
		await app.positionPage.sidebar.termsAndConditions.agreeAndSign();
		await metamask.confirmSignature();

		await expect(
			sidebarButtonLocator,
			'[Approve] or [Switch] buttons should not be visible'
		).toContainText(/Approve|Switch/);

		sidebarButtonLabel = await sidebarButtonLocator.innerText();
	}

	if (sidebarButtonLabel.includes('Approve')) {
		await app.positionPage.sidebar.approve(nominatedToken);
		await metamask.rejectTransaction();
	} else {
		await app.positionPage.sidebar.switch.confirmSwitch();
		await metamask.rejectSignature();
	}
};
