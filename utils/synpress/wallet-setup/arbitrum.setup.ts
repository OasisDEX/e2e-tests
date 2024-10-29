import { defineWalletSetup } from '@synthetixio/synpress';
import { addNetwork, commonMetamaskSetup, PASSWORD } from './common';

export default defineWalletSetup(PASSWORD, async (context, walletPage) => {
	const metamask = await commonMetamaskSetup({ context, walletPage });

	await addNetwork({ metamask, network: 'arbitrum' });
});
