require('dotenv').config();
import { devices, type PlaywrightTestConfig, type ReporterDescription } from '@playwright/test';
import { baseUrl } from 'utils/config';

// Config to hold extra property
interface TestConfig extends PlaywrightTestConfig {
	reporter: ReporterDescription[];
}

// Default configuration
const defaultConfig: PlaywrightTestConfig = {
	testDir: './tests',
	fullyParallel: process.env.FULLY_PARALLEL === 'true' ? true : false,
	timeout: process.env.TIMEOUT ? parseInt(process.env.TIMEOUT) : 30_000,
	retries: process.env.RETRIES ? parseInt(process.env.RETRIES) : 2,
	workers: process.env.WORKERS ? parseInt(process.env.WORKERS) : 1,
	reporter: [['html', { open: 'never' }]],

	/* Fail the build on CI if you accidentally left test.only in the source code. */
	forbidOnly: !!process.env.CI,

	use: {
		baseURL: baseUrl,
		headless: process.env.HEADLESS === 'false' ? false : true,
		// trace: 'retain-on-failure',
		screenshot: 'only-on-failure',
		video: 'retain-on-failure',
	},

	/* Configure projects for major browsers */
	projects: [
		{
			name: 'no-wallet',
			testMatch: ['noWallet/**'],
			use: {
				...devices['Desktop Chrome'],
			},
		},

		{
			name: 'no-wallet-portfolio',
			testMatch: ['noWallet/portfolio/stagingVsProd.spec.ts'],
			use: {
				...devices['Desktop Chrome'],
			},
		},

		{
			name: 'with-wallet-aave-other',
			testMatch: [
				'withWallet/aaveV3/arbitrum/**',
				'withWallet/aaveV3/optimism/**',
				'withWallet/aaveV3/base/**',
			],
			use: { ...devices['Desktop Chrome'] },
		},

		{
			name: 'with-wallet-aave-ethereum',
			testMatch: ['withWallet/aaveV2/**', 'withWallet/aaveV3/ethereum/**'],
			use: { ...devices['Desktop Chrome'] },
		},

		{
			name: 'with-wallet-aave-arbitrum',
			testMatch: ['withWallet/aaveV3/arbitrum/**'],
			use: { ...devices['Desktop Chrome'] },
		},

		{
			name: 'with-wallet-aave-base',
			testMatch: ['withWallet/aaveV3/base/**'],
			use: { ...devices['Desktop Chrome'] },
		},

		{
			name: 'with-wallet-aave-optimism',
			testMatch: ['withWallet/aaveV3/optimism/**'],
			use: { ...devices['Desktop Chrome'] },
		},

		{
			name: 'with-wallet-aave-arbitrum-and-optimism',
			testMatch: ['withWallet/aaveV3/arbitrum/**', 'withWallet/aaveV3/optimism/**'],
			use: { ...devices['Desktop Chrome'] },
		},

		{
			name: 'with-wallet-ajna-and-morphoblue',
			testMatch: ['withWallet/ajna/**', 'withWallet/morphoBlue/**'],
			use: { ...devices['Desktop Chrome'] },
		},

		{
			name: 'with-wallet-ajna',
			testMatch: ['withWallet/ajna/**'],
			use: { ...devices['Desktop Chrome'] },
		},

		{
			name: 'with-wallet-ajna-ethereum',
			testMatch: ['withWallet/ajna/ethereum/**'],
			use: { ...devices['Desktop Chrome'] },
		},

		{
			name: 'with-wallet-ajna-arbitrum',
			testMatch: ['withWallet/ajna/arbitrum/**'],
			use: { ...devices['Desktop Chrome'] },
		},

		{
			name: 'with-wallet-ajna-base',
			testMatch: ['withWallet/ajna/base/**'],
			use: { ...devices['Desktop Chrome'] },
		},

		{
			name: 'with-wallet-ajna-optimism',
			testMatch: ['withWallet/ajna/optimism/**'],
			use: { ...devices['Desktop Chrome'] },
		},

		{
			name: 'with-wallet-morphoblue-ethereum',
			testMatch: ['withWallet/morphoBlue/**'],
			use: { ...devices['Desktop Chrome'] },
		},

		{
			name: 'with-wallet-maker-and-spark',
			testMatch: ['withWallet/maker/**', 'withWallet/spark/**'],
			use: { ...devices['Desktop Chrome'] },
		},

		{
			name: 'with-wallet-spark-ethereum',
			testMatch: ['withWallet/spark/**'],
			use: { ...devices['Desktop Chrome'] },
		},

		{
			name: 'with-wallet-maker-ethereum',
			testMatch: ['withWallet/maker/**'],
			use: { ...devices['Desktop Chrome'] },
		},

		{
			name: 'with-wallet-swap',
			testMatch: [
				'withWallet/aaveV3/swap/**',
				'withWallet/maker/swap/**',
				'withWallet/morphoBlue/swap/**',
				'withWallet/spark/swap/**',
			],
			use: { ...devices['Desktop Chrome'] },
		},

		{
			name: 'with-wallet-swap-aaveV3',
			testMatch: ['withWallet/aaveV3/swap/**'],
			use: { ...devices['Desktop Chrome'] },
		},

		{
			name: 'with-wallet-swap-maker',
			testMatch: ['withWallet/maker/swap/**'],
			use: { ...devices['Desktop Chrome'] },
		},

		{
			name: 'with-wallet-swap-morphoblue',
			testMatch: ['withWallet/morphoBlue/swap/**'],
			use: { ...devices['Desktop Chrome'] },
		},

		{
			name: 'with-wallet-swap-spark',
			testMatch: ['withWallet/spark/swap/**'],
			use: { ...devices['Desktop Chrome'] },
		},
	],
};

// Set reporter folder depending on REPORT_FOLDER value
const config: TestConfig = {
	...defaultConfig,
	reporter: [
		['html', { open: 'never', outputFolder: `playwright-reports/${process.env.REPORT_FOLDER}` }],
	],
};

export default config;
