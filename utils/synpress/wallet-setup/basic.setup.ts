import { defineWalletSetup } from '@synthetixio/synpress';
import { commonMetamaskSetup, PASSWORD } from './common';

export default defineWalletSetup(PASSWORD, async (context, walletPage) => {
	await commonMetamaskSetup({ context, walletPage });
});
