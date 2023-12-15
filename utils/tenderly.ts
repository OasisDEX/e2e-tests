import axios from 'axios';
import { ethers, JsonRpcProvider } from 'ethers';
import { IAccountGuardAbi, IAccountImplementationAbi } from './abis';

require('dotenv').config();

const { TENDERLY_USER, TENDERLY_PROJECT, TENDERLY_ACCESS_KEY } = process.env;

const TENDERLY_FORK_API = `https://api.tenderly.co/api/v1/account/${TENDERLY_USER}/project/${TENDERLY_PROJECT}/fork`;

const request = axios.create({
	baseURL: 'https://api.tenderly.co/api/v1',
	headers: {
		'X-Access-Key': TENDERLY_ACCESS_KEY,
		'Content-Type': 'application/json',
	},
});

export const createFork = async ({
	network,
}: {
	network: 'mainnet' | 'optimism' | 'arbitrum' | 'base';
}) => {
	const network_ids = {
		mainnet: '1',
		optimism: '10',
		arbitrum: '42161',
		base: '8453',
	};
	const network_id = network_ids[network];

	return await request.post(TENDERLY_FORK_API, { network_id });
};

export const deleteFork = async (forkId: string) => {
	return await request.delete(`${TENDERLY_FORK_API}/${forkId}`);
};

const mainnetTokenAddresses = {
	DAI: '0x6b175474e89094c44da98b954eedeac495271d0f',
	SDAI: '0x83F20F44975D03b1b09e64809B757c47f942BEeA',
	RETH: '0xae78736cd615f374d3085123a210448e74fc6393',
	WSTETH: '0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0',
	CBETH: '0xbe9895146f7af43049ca1c1ae358b0541ea49704',
	WBTC: '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599',
};

/**
 *
 * @param balance In token units
 */
export const setTokenBalance = async ({
	forkId,
	token,
	balance,
	walletAddress,
}: {
	forkId: string;
	token: 'ETH' | 'DAI' | 'SDAI' | 'RETH' | 'WSTETH' | 'CBETH' | 'WBTC';
	balance: string;
	// walletAddress?: string;
	walletAddress: string;
}) => {
	const provider = new JsonRpcProvider(`https://rpc.tenderly.co/fork/${forkId}`);

	const WALLETS = [walletAddress];

	if (token === 'ETH') {
		await provider.send('tenderly_setBalance', [
			WALLETS,
			ethers.toQuantity(ethers.parseUnits(balance, 'ether')),
		]);
	} else {
		await provider.send('tenderly_setErc20Balance', [
			mainnetTokenAddresses[token],
			walletAddress,
			token.includes('BTC')
				? ethers.toQuantity(ethers.parseUnits(balance, 8))
				: ethers.toQuantity(ethers.parseUnits(balance, 'ether')),
		]);
	}
};

/**
 *
 * @param ethBalance In ETH units
 */
export const setEthBalance = async ({
	forkId,
	ethBalance,
	walletAddress,
}: {
	forkId: string;
	ethBalance: string;
	walletAddress: string;
}) => {
	const provider = new JsonRpcProvider(`https://rpc.tenderly.co/fork/${forkId}`);

	const WALLETS = [walletAddress];

	await provider.send('tenderly_setBalance', [
		WALLETS,
		ethers.toQuantity(ethers.parseUnits(ethBalance, 'ether')),
	]);
};

/**
 *
 * @param daiBalance In DAI units
 */
export const setDaiBalance = async ({
	forkId,
	daiBalance,
	walletAddress,
}: {
	forkId: string;
	daiBalance: string;
	walletAddress: string;
}) => {
	const provider = new JsonRpcProvider(`https://rpc.tenderly.co/fork/${forkId}`);

	await provider.send('tenderly_setErc20Balance', [
		'0x6b175474e89094c44da98b954eedeac495271d0f',
		walletAddress,
		ethers.toQuantity(ethers.parseUnits(daiBalance, 'ether')),
	]);
};

/**
 *
 * @param sDaiBalance In DAI units
 */
export const setSdaiBalance = async ({
	forkId,
	sDaiBalance,
	walletAddress,
}: {
	forkId: string;
	sDaiBalance: string;
	walletAddress: string;
}) => {
	const provider = new JsonRpcProvider(`https://rpc.tenderly.co/fork/${forkId}`);

	await provider.send('tenderly_setErc20Balance', [
		'0x83F20F44975D03b1b09e64809B757c47f942BEeA',
		walletAddress,
		ethers.toQuantity(ethers.parseUnits(sDaiBalance, 'ether')),
	]);
};

/**
 *
 * @param rEthBalance In rETH units
 */
export const setRethBalance = async ({
	forkId,
	rEthBalance,
	walletAddress,
}: {
	forkId: string;
	rEthBalance: string;
	walletAddress: string;
}) => {
	const provider = new JsonRpcProvider(`https://rpc.tenderly.co/fork/${forkId}`);

	await provider.send('tenderly_setErc20Balance', [
		'0xae78736cd615f374d3085123a210448e74fc6393',
		walletAddress,
		ethers.toQuantity(ethers.parseUnits(rEthBalance, 'ether')),
	]);
};

/**
 *
 * @param wstEthBalance In wstETH units
 */
export const setWstethBalance = async ({
	forkId,
	wstEthBalance,
	walletAddress,
}: {
	forkId: string;
	wstEthBalance: string;
	walletAddress: string;
}) => {
	const provider = new JsonRpcProvider(`https://rpc.tenderly.co/fork/${forkId}`);

	await provider.send('tenderly_setErc20Balance', [
		'0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0',
		walletAddress,
		ethers.toQuantity(ethers.parseUnits(wstEthBalance, 'ether')),
	]);
};

/**
 *
 * @param cbEthBalance In cbETH units
 */
export const setCbEthBalanceBase = async ({
	forkId,
	cbEthBalance,
	walletAddress,
}: {
	forkId: string;
	cbEthBalance: string;
	walletAddress: string;
}) => {
	const provider = new JsonRpcProvider(`https://rpc.tenderly.co/fork/${forkId}`);

	await provider.send('tenderly_setErc20Balance', [
		'0x2Ae3F1Ec7F1F5012CFEab0185bfc7aa3cf0DEc22',
		walletAddress,
		ethers.toQuantity(ethers.parseUnits(cbEthBalance, 'ether')),
	]);
};

/**
 *
 * @param wbtcBalance In cbETH units
 */
export const setWbtcBalance = async ({
	forkId,
	wbtcBalance,
	walletAddress,
}: {
	forkId: string;
	wbtcBalance: string;
	walletAddress: string;
}) => {
	const provider = new JsonRpcProvider(`https://rpc.tenderly.co/fork/${forkId}`);

	await provider.send('tenderly_setErc20Balance', [
		'0x2260fac5e5542a773aa44fbcfedf7c193bc2c599',
		walletAddress,
		ethers.toQuantity(ethers.parseUnits(wbtcBalance, 8)),
	]);
};

/**
 *
 * @param account Addres of the proxy to take ownershipt of
 * @param newOwner New wallet address
 */
export const changeAccountOwner = async ({
	account,
	newOwner,
	forkId,
}: {
	account: string;
	newOwner: string;
	forkId: string;
}): Promise<boolean> => {
	const provider = new JsonRpcProvider(`https://rpc.tenderly.co/fork/${forkId}`);
	const accountInterface = new ethers.Interface(IAccountImplementationAbi);
	const guardInterface = new ethers.Interface(IAccountGuardAbi);
	const contract = new ethers.Contract(account, accountInterface, provider);
	const guard = await contract.guard();
	const owner = await contract.owner();
	const encoded = guardInterface.encodeFunctionData('changeOwner', [newOwner, account]);
	try {
		await provider.send('eth_sendTransaction', [{ from: owner, to: guard, input: encoded }]);
		return true;
	} catch (error) {
		return false;
	}
};
