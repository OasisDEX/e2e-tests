import * as tenderly from '../utils/tenderly';

type Networks = 'mainnet' | 'optimism' | 'arbitrum' | 'base';
type Tokens = 'CBETH' | 'DAI' | 'ETH' | 'USDC' | 'RETH' | 'SDAI' | 'WBTC' | 'WSTETH';

const { NETWORK, WALLET_ADDRESS } = process.env;
const network = NETWORK as Networks;

const tokens = Object.keys(tenderly.tokenAddresses[network]) as Tokens[];
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
	console.log('*** FUNDS ***');
	console.log(`ETH - ${tenderly.tokenBalances['ETH']}`);
	tokens.forEach((token) => {
		console.log(`${token} - ${tenderly.tokenBalances[token]}`);
	});
	console.log('-------------------------------------');
	console.log('Fork RPC: ', vtRPC);
})();
