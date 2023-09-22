require('dotenv').config();
import { devices, type PlaywrightTestConfig, type ReporterDescription } from '@playwright/test';

// Config to hold extra property
interface TestConfig extends PlaywrightTestConfig {
	reporter: ReporterDescription[];
}

// Default configuration
const defaultConfig: PlaywrightTestConfig = {
	testDir: './tests',
	fullyParallel: process.env.FULLY_PARALLEL === 'true' ? true : false,
	timeout: process.env.TIMEOUT ? parseInt(process.env.TIMEOUT) : 30_000,
	retries: process.env.RETRIES ? parseInt(process.env.RETRIES) : 0,
	workers: process.env.WORKERS ? parseInt(process.env.WORKERS) : 1,
	reporter: [['html', { open: 'never' }]],

	/* Fail the build on CI if you accidentally left test.only in the source code. */
	forbidOnly: !!process.env.CI,

	use: {
		baseURL: process.env.BASE_URL,
		headless: process.env.HEADLESS === 'false' ? false : true,
		trace: 'on-first-retry',
	},

	/* Configure projects for major browsers */
	projects: [
		{
			name: 'no-wallet',
			testMatch: ['noWallet/**'],
			testIgnore: ['noWallet/ajna/**'],
			use: {
				...devices['Desktop Chrome'],
				screenshot: 'only-on-failure',
			},
		},

		{
			name: 'with-wallet',
			testMatch: ['withWallet/**'],
			testIgnore: ['noWallet/ajna**'],
			use: { ...devices['Desktop Chrome'] },
		},
	],
};

// Set reporter path for no-wallet tests
const noWalletConfig: TestConfig = {
	reporter: [['html', { open: 'never', outputFolder: 'playwright-reports/no-wallet' }]],
};

// Set reporter path for with-wallet tests
const withWalletConfig: TestConfig = {
	reporter: [['html', { open: 'never', outputFolder: 'playwright-reports/with-wallet' }]],
};

const wallet = process.env.WITH_WALLET;

// Config object with default configuration and specific reporter path
const config: TestConfig = {
	...defaultConfig,
	...(wallet ? withWalletConfig : noWalletConfig),
};

export default config;
