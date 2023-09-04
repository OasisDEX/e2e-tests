import * as metamask from '@synthetixio/synpress/commands/metamask';
import * as wallet from '#walletUtils';
import * as termsAndconditions from '#termsAndConditions';
import * as tenderly from 'utils/tenderly';
import * as localStorage from 'utils/localStorage';
import * as fork from 'utils/fork';
import { App } from 'src/app';

export const setup = async (app: App) => {
	const walletAddress = await metamask.walletAddress();

	await app.page.goto('');

	await wallet.connect(app);
	await termsAndconditions.accept(app);

	await localStorage.enableNetworkSwitcherFoks(app);

	const resp = await tenderly.createFork();
	const forkId = resp.data.root_transaction.fork_id;

	await fork.addToApp({ app, forkId });

	await tenderly.setEthBalance({ forkId, ethBalance: '15000' });

	return { forkId, walletAddress };
};
