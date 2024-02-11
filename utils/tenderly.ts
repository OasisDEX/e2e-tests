import axios from 'axios';
import { ethers, JsonRpcProvider } from 'ethers';
import { IAccountGuardAbi, IAccountImplementationAbi } from './abis';

require('dotenv').config();

const { TENDERLY_USER, TENDERLY_PROJECT, TENDERLY_ACCESS_KEY } = process.env;

const TENDERLY_FORK_API = `https://api.tenderly.co/api/v1/account/${TENDERLY_USER}/project/${TENDERLY_PROJECT}/fork`;
const TENDERLY_SIMULATIONS_API = `https://api.tenderly.co/api/v1/account/${TENDERLY_USER}/project/${TENDERLY_PROJECT}/simulations?page=1&perPage=20`;

const request = axios.create({
	baseURL: 'https://api.tenderly.co/api/v1',
	headers: {
		'X-Access-Key': TENDERLY_ACCESS_KEY,
		'Content-Type': 'application/json',
	},
});

export const getSimulations = async () => {
	return await request.get(TENDERLY_SIMULATIONS_API);
};
// fetch(
// 	'https://api.tenderly.co/api/v1/account/juanjo/project/project/simulations?page=1&perPage=20',
// 	{
// 		headers: {
// 			'X-Access-Key': '${TENDERLY_ACCESS_KEY}',
// 			'content-type': 'application/json',
// 		},
// 		body: null,
// 		method: 'GET',
// 	}
// );

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

export const tokenAddresses = {
	mainnet: {
		AJNA: '0x9a96ec9b57fb64fbc60b423d1f4da7691bd35079',
		CBETH: '0xbe9895146f7af43049ca1c1ae358b0541ea49704',
		DAI: '0x6b175474e89094c44da98b954eedeac495271d0f',
		GHO: '0x40D16FC0246aD3160Ccc09B8D0D3A2cD28aE6C2f',
		RETH: '0xae78736cd615f374d3085123a210448e74fc6393',
		SDAI: '0x83F20F44975D03b1b09e64809B757c47f942BEeA',
		TBTC: '0x18084fbA666a33d37592fA2633fD49a74DD93a88',
		USDC: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
		WBTC: '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599',
		WETH: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
		WSTETH: '0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0',
	},
	arbitrum: {
		DAI: '0xda10009cbd5d07dd0cecc66161fc93d7c9000da1',
		RETH: '0xEC70Dcb4A1EFa46b8F2D97C310C9c4790ba5ffA8',
		USDC: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831',
		WBTC: '0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f',
		WSTETH: '0x5979D7b546E38E414F7E9822514be443A4800529',
	},
	base: {
		CBETH: '0x2Ae3F1Ec7F1F5012CFEab0185bfc7aa3cf0DEc22',
		DAI: '0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb',
		USDC: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
	},
	optimism: {
		DAI: '0xda10009cbd5d07dd0cecc66161fc93d7c9000da1',
		RETH: '0x9Bcef72be871e61ED4fBbc7630889beE758eb81D',
		USDC: '0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85',
		WBTC: '0x68f180fcCe6836688e9084f035309E29Bf0A2095',
		WSTETH: '0x1F32b1c2345538c0c6f582fCB022739c4A194Ebb',
	},
};

export const tokenBalances = {
	AJNA: '10000',
	CBETH: '1000',
	DAI: '200000',
	ETH: '1000',
	GHO: '10000',
	RETH: '1000',
	SDAI: '200000',
	TBTC: '10000',
	USDC: '200000',
	WBTC: '10',
	WETH: '1000',
	WSTETH: '1000',
};

/**
 *
 * @param balance In token units
 */
export const setTokenBalance = async ({
	forkId,
	network,
	token,
	balance,
	walletAddress,
}: {
	forkId: string;
	network: 'mainnet' | 'optimism' | 'arbitrum' | 'base';
	token: 'CBETH' | 'DAI' | 'ETH' | 'USDC' | 'RETH' | 'SDAI' | 'WBTC' | 'WSTETH';
	balance: string;
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
			tokenAddresses[network][token],
			walletAddress,
			token === 'WBTC'
				? ethers.toQuantity(ethers.parseUnits(balance, 8))
				: token === 'USDC'
				? ethers.toQuantity(ethers.parseUnits(balance, 6))
				: ethers.toQuantity(ethers.parseUnits(balance, 'ether')),
		]);
	}
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
 * @param wbtcBalance In WBTC units
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
