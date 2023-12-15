import * as tenderly from '../utils/tenderly';

const { NETWORK, WALLET_ADDRESS } = process.env;

(async () => {
	const resp = await tenderly.createFork({ network: NETWORK });
	const forkId = resp.data.root_transaction.fork_id;

	if (NETWORK === 'mainnet') {
		await tenderly.setTokenBalance({
			forkId,
			token: 'ETH',
			balance: '5000',
			walletAddress: WALLET_ADDRESS,
		});
		await tenderly.setTokenBalance({
			forkId,
			token: 'DAI',
			balance: '200000',
			walletAddress: WALLET_ADDRESS,
		});
		await tenderly.setTokenBalance({
			forkId,
			token: 'SDAI',
			balance: '200000',
			walletAddress: WALLET_ADDRESS,
		});
		await tenderly.setTokenBalance({
			forkId,
			token: 'RETH',
			balance: '5000',
			walletAddress: WALLET_ADDRESS,
		});
		await tenderly.setTokenBalance({
			forkId,
			token: 'WSTETH',
			balance: '5000',
			walletAddress: WALLET_ADDRESS,
		});
		await tenderly.setTokenBalance({
			forkId,
			token: 'CBETH',
			balance: '5000',
			walletAddress: WALLET_ADDRESS,
		});
		await tenderly.setTokenBalance({
			forkId,
			token: 'WBTC',
			balance: '10',
			walletAddress: WALLET_ADDRESS,
		});
	}

	console.log(`Selected network: ${NETWORK}`);
	if (NETWORK === 'mainnet') {
		console.log(`Wallet address: ${WALLET_ADDRESS}`);
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
	}
	console.log('Fork RPC: ', `https://rpc.tenderly.co/fork/${forkId}`);
})();
