import { SetBalanceTokens } from 'utils/testData';
import * as tenderly from '../utils/tenderly';

type Networks = 'mainnet' | 'optimism' | 'arbitrum' | 'base';

const { NETWORK, WALLET_ADDRESS, FORK_ID, TOKENS } = process.env;
const network = NETWORK as Networks;
const forkId = FORK_ID ?? '';
const tokens = (TOKENS ?? '').split(' ') as SetBalanceTokens[];

let walletAddress: string = WALLET_ADDRESS ?? '';

(async () => {
	for (const token of tokens) {
		await tenderly.setTokenBalance({
			forkId,
			network,
			token,
			balance: tenderly.tokenBalances[token],
			walletAddress: walletAddress,
		});
	}

	console.log(`Selected network: ${NETWORK}`);
	console.log(`Wallet address: ${WALLET_ADDRESS}`);
	console.log('-------------------------------------');
	tokens.forEach((token) => {
		console.log(`${token} - ${tenderly.tokenBalances[token]}`);
	});
	console.log('-------------------------------------');
	console.log('Fork RPC: ', `https://rpc.tenderly.co/fork/${forkId}`);
})();
