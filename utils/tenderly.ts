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
 * @param sDaiBalance In DAI units
 */
export const setSdaiBalance = async ({
	forkId,
	sDaiBalance,
}: {
	forkId: string;
	sDaiBalance: string;
}) => {
	const provider = new JsonRpcProvider(`https://rpc.tenderly.co/fork/${forkId}`);

	await provider.send('tenderly_setErc20Balance', [
		'0x83F20F44975D03b1b09e64809B757c47f942BEeA',
		WALLET_ADDRESS,
		ethers.toQuantity(ethers.parseUnits(sDaiBalance, 'ether')),
	]);
};

/**
 *
 * @param rEthBalance In rETH units
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

/**
 *
 * @param cbEthBalance In cbETH units
 */
export const setCbEthBalance = async ({
	forkId,
	cbEthBalance,
}: {
	forkId: string;
	cbEthBalance: string;
}) => {
	const provider = new JsonRpcProvider(`https://rpc.tenderly.co/fork/${forkId}`);

	await provider.send('tenderly_setErc20Balance', [
		'0x2Ae3F1Ec7F1F5012CFEab0185bfc7aa3cf0DEc22',
		WALLET_ADDRESS,
		ethers.toQuantity(ethers.parseUnits(cbEthBalance, 'ether')),
	]);
};
