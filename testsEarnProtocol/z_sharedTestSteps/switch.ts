import { expect } from '#earnProtocolFixtures';
import { MetaMask } from '@synthetixio/synpress/playwright';
import { App } from 'srcEarnProtocol/app';
import { LazyNominatedTokens, Risks } from 'srcEarnProtocol/utils/types';
import { expectDefaultTimeout } from 'utils/config';

// Switch flow until rejecting first tx
export const switchPosition = async ({
	metamask,
	app,
	nominatedToken,
	targetToken,
	risk,
}: {
	metamask: MetaMask;
	app: App;
	nominatedToken: LazyNominatedTokens;
	targetToken: LazyNominatedTokens;
	risk?: Risks;
}) => {
	await app.positionPage.sidebar.switch.selectTargetPosition({ token: targetToken, risk });
	await app.page.waitForTimeout(expectDefaultTimeout / 3);
	await app.positionPage.sidebar.switch.previewSwitch();

	const sidebarButtonLocator = app.page.locator('[class*="_sidebarCta_"] button').first();

	await expect(
		sidebarButtonLocator,
		'[Agree], [Approve] or [Switch] buttons should not be visible'
	).toContainText(/Agree|Approve|Switch/, { timeout: expectDefaultTimeout * 3 });

	let sidebarButtonLabel = await sidebarButtonLocator.innerText();

	// Sign T&C if needed
	if (sidebarButtonLabel.includes('Agree and sign')) {
		await app.positionPage.sidebar.termsAndConditions.agreeAndSign();
		await metamask.confirmSignature();

		await expect(
			sidebarButtonLocator,
			'[Approve] or [Switch] buttons should not be visible'
		).toContainText(/Approve|Switch/, { timeout: expectDefaultTimeout * 3 });

		sidebarButtonLabel = await sidebarButtonLocator.innerText();
	}

	if (sidebarButtonLabel.includes('Approve')) {
		//
		// TO BE DONE - Check preview values
		await app.positionPage.sidebar.switch.shouldHavePreviewInfo({
			nominatedToken,
			targetToken,
		});
		//

		await app.positionPage.sidebar.approve(nominatedToken === 'ETH' ? 'WETH' : nominatedToken);
		await metamask.rejectTransaction();
	} else {
		await app.positionPage.sidebar.switch.confirmSwitch();
		await metamask.rejectSignature();
	}

	// Leaving app in a stable state to avoid random fails in following test steps
	await app.positionPage.sidebar.buttonShouldBeVisible('Loading');
	await app.positionPage.sidebar.buttonShouldBeVisible(/Approve|Switch/, {
		timeout: expectDefaultTimeout * 3,
	});
};
