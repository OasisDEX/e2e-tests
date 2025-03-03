import { Expect } from '@playwright/test';
import * as wallet from '#walletUtils';
import * as termsAndconditions from '#termsAndConditions';
import * as tenderly from 'utils/tenderly';
import * as localStorage from 'utils/localStorage';
import * as fork from 'utils/fork';
import { App } from 'src/app';
import { SetBalanceTokens } from './testData';
import { MetaMask } from '@synthetixio/synpress/playwright';
import 'dotenv/config';

/**
 * @param extraFeaturesFlags should be a string, for example, 'flag1:true flag2:false'
 */
export const setup = async ({
	metamask,
	app,
	network = 'mainnet',
	extraFeaturesFlags,
	automationMinNetValueFlags,
	withoutFork,
}: {
	metamask: MetaMask;
	app: App;
	network?: 'mainnet' | 'optimism' | 'arbitrum' | 'base';
	extraFeaturesFlags?: string;
	automationMinNetValueFlags?: string;
	withoutFork?: boolean;
}) => {
	let vtId: string = '';
	let vtRPC: string = '';

	await app.page.goto('');
	await app.homepage.shouldBeVisible();

	// 'UseNetworkSwitcherForks' flag needs to be always passed for tests with wallet and fork
	const featuresFlags = ['UseNetworkSwitcherForks:true'];
	if (extraFeaturesFlags) {
		featuresFlags.push(...extraFeaturesFlags.split(' '));
	}
	if (process.env.FLAGS_FEATURES) {
		featuresFlags.push(...process.env.FLAGS_FEATURES.split(' '));
	}

	const setupAutomationMinNetValueFlags: string[] = automationMinNetValueFlags
		? automationMinNetValueFlags.split(' ')
		: [];
	if (process.env.FLAGS_AUTOMATION_MIN_NET_VALUE) {
		setupAutomationMinNetValueFlags.push(...process.env.FLAGS_AUTOMATION_MIN_NET_VALUE.split(' '));
	}

	await localStorage.updateFlagsAndRejectCookies({
		app,
		featuresFlags,
		automationMinNetValueFlags: setupAutomationMinNetValueFlags,
	});

	await wallet.connect({ metamask, app });
	await termsAndconditions.accept({ metamask, app });

	// Log wallet in database as having accepted ToS
	const walletAddress = await metamask.getAccountAddress();
	await app.page.request.post('/api/tos', {
		data: {
			docVersion: 'version-27.08.2024',
			walletAddress,
		},
	});

	if (!withoutFork) {
		({ vtId, vtRPC } = await tenderly.createFork({ network }));

		console.log('Testnet RPC: ', vtRPC);

		await tenderly.setTokenBalance({
			vtRPC,
			walletAddress,
			network,
			token: 'ETH',
			balance: '1000',
		});

		await fork.addToApp({ metamask, app, vtRPC, network });

		// Logging Testnet Id for debugging purposes
		//  - Info displayed in 'Attachments > stdout' section of playwright reports
		console.log('Testnet Id: ', vtId);
	}

	return { vtId, vtRPC, walletAddress };
};

export const setupNewFork = async ({
	metamask,
	expect,
	app,
	network,
}: {
	metamask: MetaMask;
	expect: Expect;
	app: App;
	network: 'mainnet' | 'optimism' | 'arbitrum' | 'base';
}) => {
	const walletAddress = await metamask.getAccountAddress();
	await app.page.evaluate(() => window.localStorage.removeItem('ForkNetwork'));

	await app.page.goto('');
	await app.homepage.shouldBeVisible();

	const { vtRPC, vtId } = await tenderly.createFork({ network });

	await expect(async () => {
		await app.page.goto('');
		await app.header.portfolioShouldBeVisible();
	}).toPass();

	await fork.addToApp({ metamask, app, vtRPC, network });

	await tenderly.setTokenBalance({ vtRPC, walletAddress, network, token: 'ETH', balance: '100' });

	return { vtId, vtRPC };
};

export const createNewFork = async ({
	network,
}: {
	network: 'mainnet' | 'optimism' | 'arbitrum' | 'base';
}) => {
	const { vtId, vtRPC } = await tenderly.createFork({ network });

	return { vtId, vtRPC };
};

export const createAndSetNewFork = async ({
	metamask,
	walletAddress,
	network,
	addTokenBalance,
	app,
}: {
	metamask: MetaMask;
	walletAddress: string;
	network: 'mainnet' | 'optimism' | 'arbitrum' | 'base';
	addTokenBalance?: { token: SetBalanceTokens; balance: string };
	app: App;
}) => {
	const chainIds = {
		arbitrum: 42161,
		base: 8453,
		mainnet: 1,
		optimism: 10,
	};

	const chainId = chainIds[network];

	const { vtId, vtRPC } = await createNewFork({ network });
	console.log('Testnet Id:', vtId);
	console.log('Testnet RPC:', vtRPC);

	await tenderly.setTokenBalance({
		vtRPC,
		walletAddress,
		network,
		token: 'ETH',
		balance: '1000',
	});

	if (addTokenBalance) {
		await tenderly.setTokenBalance({
			vtRPC,
			network,
			walletAddress,
			token: addTokenBalance.token,
			balance: addTokenBalance.balance,
		});
	}

	console.log('chainId: ', chainId);

	const newWalletNetwork = {
		name: 'testFork',
		rpcUrl: vtRPC,
		chainId,
		symbol: 'ETH',
	};

	await metamask.addNetwork(newWalletNetwork);

	await app.page.evaluate(
		({
			vtRPC,
			network,
			chainId,
		}: {
			vtRPC: string;
			network: 'mainnet' | 'optimism' | 'arbitrum' | 'base';
			chainId: number;
		}) =>
			window.localStorage.setItem(
				'ForkNetwork',
				`{"${
					network === 'mainnet' ? 'ethereum' : network
				}": {"url": "${vtRPC}", "id": "${chainId}"}}`
			),
		{ vtRPC, network, chainId }
	);

	await app.page.reload();

	return { vtId, vtRPC };
};
