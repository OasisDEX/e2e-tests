import axios from 'axios';
import { JsonRpcProvider } from '@ethersproject/providers';
import { ethers } from 'ethers';

require('dotenv').config();

const { TENDERLY_USER, TENDERLY_PROJECT, TENDERLY_ACCESS_KEY, WALLET_ADDRESS } = process.env;

const TENDERLY_FORK_API = `https://api.tenderly.co/api/v1/account/${TENDERLY_USER}/project/${TENDERLY_PROJECT}/fork`;

const request = axios.create({
	baseURL: 'https://api.tenderly.co/api/v1',
	headers: {
		'X-Access-Key': TENDERLY_ACCESS_KEY,
		'Content-Type': 'application/json',
	},
});

export const createFork = async ({ network }: { network: 'mainnet' | 'optimism' | 'arbitrum' }) => {
	const network_id = network === 'mainnet' ? '1' : network === 'optimism' ? '10' : '42161';

	return await request.post(TENDERLY_FORK_API, { network_id });
};

export const deleteFork = async (forkId: string) => {
	return await request.delete(`${TENDERLY_FORK_API}/${forkId}`);
};

/**
 *
 * @param ethBalance In ETH units
 */
export const setEthBalance = async ({
	forkId,
	ethBalance,
}: {
	forkId: string;
	ethBalance: string;
}) => {
	const provider = new JsonRpcProvider(`https://rpc.tenderly.co/fork/${forkId}`);

	const WALLETS = [WALLET_ADDRESS];

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
}: {
	forkId: string;
	daiBalance: string;
}) => {
	const provider = new JsonRpcProvider(`https://rpc.tenderly.co/fork/${forkId}`);

	await provider.send('tenderly_setErc20Balance', [
		'0x6b175474e89094c44da98b954eedeac495271d0f',
		WALLET_ADDRESS,
		ethers.toQuantity(ethers.parseUnits(daiBalance, 'ether')),
	]);
};

/**
 *
 * @param daiBalance In DAI units
 */
export const setWstethBalance = async ({
	forkId,
	rEthBalance,
}: {
	forkId: string;
	rEthBalance: string;
}) => {
	const provider = new JsonRpcProvider(`https://rpc.tenderly.co/fork/${forkId}`);

	await provider.send('tenderly_setErc20Balance', [
		'0xae78736cd615f374d3085123a210448e74fc6393',
		WALLET_ADDRESS,
		ethers.toQuantity(ethers.parseUnits(rEthBalance, 'ether')),
	]);
};
