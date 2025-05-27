import { defineWalletSetup } from '@synthetixio/synpress';
import { addNetwork, commonMetamaskSetup, PASSWORD } from '../../commonWalletSetup';
import 'dotenv/config';

const walletPK = process.env.EMPTY_TEST_WALLET_PK as string;

export default defineWalletSetup(PASSWORD, async (context, walletPage) => {
	const metamask = await commonMetamaskSetup({ context, walletPage });

	await metamask.importWalletFromPrivateKey(walletPK);

	await addNetwork({ metamask, network: 'base' });
});
