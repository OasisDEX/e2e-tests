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

export const metamaskSetUp = async () => {
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
		network: 'mainnet',
		password: 'Tester@1234',
		enableAdvancedSettings: true,
		enableExperimentalSettings: false,
	});

	return { context };
};

export const expect = test.expect;

export const setup = async (app: App) => {
	const walletAddress = await metamask.walletAddress();

	await app.page.goto('');

	await wallet.connect(app);
	await termsAndconditions.accept(app);

	// 'UseNetworkSwitcherForks' flag needs to be always passed for tests with wallet and fork
	const flags = process.env.ENABLE_FLAGS
		? process.env.ENABLE_FLAGS.split(' ').concat('UseNetworkSwitcherForks')
		: ['UseNetworkSwitcherForks'];
	await localStorage.enableFlags({
		app,
		flags,
	});

	const resp = await tenderly.createFork();
	const forkId = resp.data.root_transaction.fork_id;

	await fork.addToApp({ app, forkId });

	await tenderly.setEthBalance({ forkId, ethBalance: '15000' });
	await tenderly.setDaiBalance({ forkId, daiBalance: '50000' });

	return { forkId, walletAddress };
};
