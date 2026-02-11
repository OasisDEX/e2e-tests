import { defineWalletSetup } from '@synthetixio/synpress';
import 'dotenv/config';
import { addNetwork, commonMetamaskSetup, PASSWORD } from '../commonWalletSetup';

const walletPK = process.env.VERY_OLD_TEST_WALLET_PK as string;

export default defineWalletSetup(PASSWORD, async (context, walletPage) => {
	const metamask = await commonMetamaskSetup({ context, walletPage });

	await metamask.importWalletFromPrivateKey(walletPK);

	await addNetwork({ metamask, network: 'optimism' });
});
