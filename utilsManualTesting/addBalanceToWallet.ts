import { SetBalanceTokens } from 'utils/testData';
import * as tenderly from '../utils/tenderly';

type Networks = 'mainnet' | 'optimism' | 'arbitrum' | 'base';

const { NETWORK, WALLET_ADDRESS, VT_RPC, TOKENS } = process.env;
const network = NETWORK as Networks;
const vtRPC = VT_RPC ?? '';
const tokens = (TOKENS ?? '').split(' ') as SetBalanceTokens[];

let walletAddress: string = WALLET_ADDRESS ?? '';

(async () => {
	for (const token of tokens) {
		await tenderly.setTokenBalance({
			vtRPC,
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
	console.log('Testnet RPC: ', vtRPC);
})();
