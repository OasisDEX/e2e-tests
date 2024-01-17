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

export const setup = async ({
	app,
	network,
}: {
	app: App;
	network: 'mainnet' | 'optimism' | 'arbitrum' | 'base';
}) => {
	const walletAddress = await metamask.walletAddress();

	await app.page.goto('');
	await app.homepage.shouldBeVisible();

	// 'UseNetworkSwitcherForks' flag needs to be always passed for tests with wallet and fork
	const flags = process.env.FLAGS
		? process.env.FLAGS.split(' ').concat('UseNetworkSwitcherForks:true')
		: ['UseNetworkSwitcherForks:true'];
	await localStorage.updateFlagsAndRejectCookies({
		app,
		flags,
	});

	await wallet.connect(app);
	await termsAndconditions.accept(app);

	const resp = await tenderly.createFork({ network });
	const forkId = resp.data.root_transaction.fork_id;

	await fork.addToApp({ app, forkId, network });

	await tenderly.setEthBalance({ forkId, walletAddress, ethBalance: '100' });

	// Logging forkId and walletAddress for debugging purposes
	//  - Info displayed in 'Attachments > stdout' section of playwright reports
	console.log('+++ Foork Id: ', forkId);
	console.log('+++ Wallet Address: ', walletAddress);

	return { forkId, walletAddress };
};

export const setupNewFork = async ({
	app,
	network,
}: {
	app: App;
	network: 'mainnet' | 'optimism' | 'arbitrum' | 'base';
}) => {
	await app.page.evaluate(() => window.localStorage.removeItem('ForkNetwork'));

	await app.page.goto('');
	await app.homepage.shouldBeVisible();

	const resp = await tenderly.createFork({ network });
	const forkId = resp.data.root_transaction.fork_id;

	await expect(async () => {
		await app.page.goto('');
		await app.header.useCasesShouldBeVisible();
		await app.header.connectWalletShouldNotBeVisible();
	}).toPass();

	await fork.addToApp({ app, forkId, network });

	return { forkId };
};
