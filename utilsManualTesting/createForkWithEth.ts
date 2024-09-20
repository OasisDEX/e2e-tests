import * as tenderly from '../utils/tenderly';

type Networks = 'mainnet' | 'optimism' | 'arbitrum' | 'base';

const { NETWORK, WALLET_ADDRESS } = process.env;
const network = NETWORK as Networks;

let walletAddress: string = WALLET_ADDRESS;

(async () => {
	const resp = await tenderly.createFork({ network });
	const forkId = resp.data.root_transaction.fork_id;

	await tenderly.setTokenBalance({
		forkId,
		network,
		token: 'ETH',
		balance: tenderly.tokenBalances['ETH'],
		walletAddress: walletAddress,
	});

	console.log(`Selected network: ${NETWORK}`);
	console.log(`Wallet address: ${WALLET_ADDRESS}`);
	console.log('-------------------------------------');
	console.log('*** FUNDS ***');
	console.log(`ETH - ${tenderly.tokenBalances['ETH']}`);
	console.log('-------------------------------------');
	console.log('Fork RPC: ', `https://rpc.tenderly.co/fork/${forkId}`);
})();
