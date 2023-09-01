import axios from 'axios';
import { JsonRpcProvider } from '@ethersproject/providers';
import { ethers } from 'ethers';

require('dotenv').config();

const { TENDERLY_USER, TENDERLY_PROJECT, TENDERLY_ACCESS_KEY, WALLET_ADDRESS } = process.env;

const TENDERLY_FORK_API = `https://api.tenderly.co/api/v1/account/${TENDERLY_USER}/project/${TENDERLY_PROJECT}/fork`;

const body = {
	network_id: '1',
};

const request = axios.create({
	baseURL: 'https://api.tenderly.co/api/v1',
	headers: {
		'X-Access-Key': TENDERLY_ACCESS_KEY,
		'Content-Type': 'application/json',
	},
});

export const createFork = async () => {
	return await request.post(TENDERLY_FORK_API, body);
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
