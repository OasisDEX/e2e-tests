import { defineWalletSetup } from '@synthetixio/synpress';
import { commonMetamaskSetup, PASSWORD } from '../commonWalletSetup';

export default defineWalletSetup(PASSWORD, async (context, walletPage) => {
	await commonMetamaskSetup({ context, walletPage });
});
