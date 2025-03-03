import { input, rawlist } from '@inquirer/prompts';
import * as tenderly from '../utils/tenderly';

type Tokens = 'CBETH' | 'DAI' | 'ETH' | 'USDC' | 'RETH' | 'SDAI' | 'WBTC' | 'WSTETH';

let walletAddress: string;

(async () => {
	const network: 'mainnet' | 'optimism' | 'arbitrum' | 'base' = await rawlist({
		message: 'Select a network',
		choices: [
			{ name: 'Mainnet', value: 'mainnet' },
			{ name: 'Arbitrum', value: 'arbitrum' },
			{ name: 'Base', value: 'base' },
			{ name: 'Optimism', value: 'optimism' },
		],
	});

	const tokens = Object.keys(tenderly.tokenAddresses[network]) as Tokens[];

	const { vtRPC } = await tenderly.createFork({ network });

	walletAddress = await input({ message: 'Enter your wallet address: ' });

	await tenderly.setTokenBalance({
		vtRPC,
		network,
		token: 'ETH',
		balance: tenderly.tokenBalances['ETH'],
		walletAddress: walletAddress,
	});

	for (const token of tokens) {
		await tenderly.setTokenBalance({
			vtRPC,
			network,
			token,
			balance: tenderly.tokenBalances[token],
			walletAddress: walletAddress,
		});
	}

	console.log(`Selected network: ${network}`);
	console.log(`Wallet address: ${walletAddress}`);
	console.log('-------------------------------------');
	console.log('*** FUNDS ***');
	console.log(`ETH - ${tenderly.tokenBalances['ETH']}`);
	tokens.forEach((token) => {
		console.log(`${token} - ${tenderly.tokenBalances[token]}`);
	});
	console.log('-------------------------------------');
	console.log('Testnet RPC: ', vtRPC);
})();
