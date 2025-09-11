import { MetaMask } from '@synthetixio/synpress/playwright';
import { App } from 'srcEarnProtocol/app';
import { LvTokens } from 'srcEarnProtocol/utils/types';

// Unstake LV tokens flow until rejecting first tx
export const unstakeLvTokens = async ({
	metamask,
	app,
	lvToken,
	lvTokenAmount,
	dollarAmount,
}: {
	metamask: MetaMask;
	app: App;
	lvToken: LvTokens;
	lvTokenAmount: string;
	dollarAmount: string;
}) => {
	await app.positionPage.sidebar.unstake();
	await app.positionPage.sidebar.shouldHaveStakedTokens({
		lvToken: lvToken,
		lvTokenAmount: lvTokenAmount,
		dollarAmount: dollarAmount,
	});

	await app.positionPage.sidebar.confirmUnstake();

	await metamask.rejectSignature();
};
