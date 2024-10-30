import { defineWalletSetup } from '@synthetixio/synpress';
import { addNetwork, commonMetamaskSetup, PASSWORD } from '../commonWalletSetup';

export default defineWalletSetup(PASSWORD, async (context, walletPage) => {
	const metamask = await commonMetamaskSetup({ context, walletPage });

	await addNetwork({ metamask, network: 'arbitrum' });
});
