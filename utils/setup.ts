import * as metamask from '@synthetixio/synpress/commands/metamask';
import * as wallet from '#walletUtils';
import * as termsAndconditions from '#termsAndConditions';
import * as tenderly from 'utils/tenderly';
import * as localStorage from 'utils/localStorage';
import * as fork from 'utils/fork';
import { App } from 'src/app';

import { test, chromium } from '@playwright/test';
import { initialSetup } from '@synthetixio/synpress/commands/metamask';
import { prepareMetamask } from '@synthetixio/synpress/helpers';
import { setExpectInstance } from '@synthetixio/synpress/commands/playwright';

export const metamaskSetUp = async ({
	network,
}: {
	network: 'mainnet' | 'optimism' | 'arbitrum' | 'base';
}) => {
	// required for synpress as it shares same expect instance as playwright
	await setExpectInstance(expect);

	// download metamask
	const metamaskPath = await prepareMetamask(process.env.METAMASK_VERSION || '10.25.0');

	// prepare browser args
	const browserArgs = [
		`--disable-extensions-except=${metamaskPath}`,
		`--load-extension=${metamaskPath}`,
		'--remote-debugging-port=9222',
	];

	if (process.env.CI) {
		browserArgs.push('--disable-gpu');
	}

	if (process.env.HEADLESS_MODE) {
		browserArgs.push('--headless=new');
	}

	// launch browser
	const context = await chromium.launchPersistentContext('', {
		headless: false,
		args: browserArgs,
	});

	// wait for metamask
	await context.pages()[0].waitForTimeout(3000);

	// setup metamask
	await initialSetup(chromium, {
		secretWordsOrPrivateKey: 'test test test test test test test test test test test junk',
		network,
		password: 'Tester@1234',
		enableAdvancedSettings: true,
		enableExperimentalSettings: false,
	});

	return { context };
};

export const expect = test.expect;

/**
 * @param extraFeaturesFlags should be a string, for example, 'flag1:true flag2:false'
 */
export const setup = async ({
	app,
	network,
	extraFeaturesFlags,
	automationMinNetValueFlags,
	withoutFork,
	withExistingWallet,
}: {
	app: App;
	network: 'mainnet' | 'optimism' | 'arbitrum' | 'base';
	extraFeaturesFlags?: string;
	automationMinNetValueFlags?: string;
	withoutFork?: boolean;
	withExistingWallet?: { privateKey: string };
}) => {
	let forkId: string;
	const walletAddress = await metamask.walletAddress();
	// Logging walletAddress for debugging purposes
	//  - Info displayed in 'Attachments > stdout' section of playwright reports
	console.log(' Wallet Address: ', walletAddress);

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

	if (withExistingWallet) {
		await metamask.importAccount(withExistingWallet?.privateKey);
	}

	await wallet.connect(app);
	await termsAndconditions.accept(app);

	if (!withoutFork) {
		const resp = await tenderly.createFork({ network });
		forkId = resp.data.root_transaction.fork_id;

		await fork.addToApp({ app, forkId, network });

		await tenderly.setTokenBalance({
			forkId,
			walletAddress,
			network,
			token: 'ETH',
			balance: '1000',
		});

		// Logging forkId for debugging purposes
		//  - Info displayed in 'Attachments > stdout' section of playwright reports
		console.log(' Fork Id: ', forkId);
	}

	return { forkId, walletAddress };
};

export const setupNewFork = async ({
	app,
	network,
}: {
	app: App;
	network: 'mainnet' | 'optimism' | 'arbitrum' | 'base';
}) => {
	const walletAddress = await metamask.walletAddress();
	await app.page.evaluate(() => window.localStorage.removeItem('ForkNetwork'));

	await app.page.goto('');
	await app.homepage.shouldBeVisible();

	const resp = await tenderly.createFork({ network });
	const forkId = resp.data.root_transaction.fork_id;

	await expect(async () => {
		await app.page.goto('');
		await app.header.portfolioShouldBeVisible();
	}).toPass();

	await fork.addToApp({ app, forkId, network });

	await tenderly.setTokenBalance({ forkId, walletAddress, network, token: 'ETH', balance: '100' });

	return { forkId };
};
