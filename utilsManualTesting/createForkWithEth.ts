import * as tenderly from '../utils/tenderly';
import 'dotenv/config';

type Networks = 'mainnet' | 'optimism' | 'arbitrum' | 'base';

const { NETWORK, WALLET_ADDRESS } = process.env;
const network = NETWORK as Networks;

let walletAddress: string = WALLET_ADDRESS as string;

(async () => {
	const { vtRPC } = await tenderly.createFork({ network });

	await tenderly.setTokenBalance({
		vtRPC,
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
	console.log('Testnet RPC: ', vtRPC);
})();
