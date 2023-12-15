import { input, rawlist } from '@inquirer/prompts';
import * as tenderly from '../utils/tenderly';

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

	const walletAddress = await input({ message: 'Enter your wallet address: ' });
	// const ethBalance = await input({ message: 'Enter the ETH balance you need: ' });

	const resp = await tenderly.createFork({ network });
	const forkId = resp.data.root_transaction.fork_id;

	// When using 'Promise.all()' some of the transactions randomly fail
	await tenderly.setTokenBalance({ forkId, token: 'ETH', balance: '5000', walletAddress });
	await tenderly.setTokenBalance({ forkId, token: 'DAI', balance: '200000', walletAddress });
	await tenderly.setTokenBalance({ forkId, token: 'SDAI', balance: '200000', walletAddress });
	await tenderly.setTokenBalance({ forkId, token: 'RETH', balance: '5000', walletAddress });
	await tenderly.setTokenBalance({ forkId, token: 'WSTETH', balance: '5000', walletAddress });
	await tenderly.setTokenBalance({ forkId, token: 'CBETH', balance: '5000', walletAddress });
	await tenderly.setTokenBalance({ forkId, token: 'WBTC', balance: '10', walletAddress });

	console.log(`Selected network: ${network}`);
	console.log(`Wallet address: ${walletAddress}`);
	console.log('-------------------------------------');
	console.log('Tokens and balance:');
	console.log('ETH - 5000');
	console.log('RETH - 5000');
	console.log('WSTETH - 5000');
	console.log('CBETH - 5000');
	console.log('DAI - 200000');
	console.log('SDAI - 200000');
	console.log('WBTC - 10');
	console.log('-------------------------------------');
	console.log('Fork RPC: ', `https://rpc.tenderly.co/fork/${forkId}`);
})();
