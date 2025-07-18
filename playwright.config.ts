import { devices, type PlaywrightTestConfig, type ReporterDescription } from '@playwright/test';
import { baseUrl, earnProtocolBaseUrl } from 'utils/config';
import 'dotenv/config';

// Config to hold extra property
interface TestConfig extends PlaywrightTestConfig {
	reporter: ReporterDescription[];
}

// Default configuration
const defaultConfig: PlaywrightTestConfig = {
	testDir: './tests',
	fullyParallel: process.env.FULLY_PARALLEL === 'true' ? true : false,
	timeout: process.env.TIMEOUT ? parseInt(process.env.TIMEOUT) : 40_000,
	retries: process.env.RETRIES ? parseInt(process.env.RETRIES) : 2,
	workers: process.env.WORKERS ? parseInt(process.env.WORKERS) : 1,
	reporter: [['html', { open: 'never' }]],

	/* Fail the build on CI if you accidentally left test.only in the source code. */
	forbidOnly: !!process.env.CI,

	use: {
		baseURL: baseUrl,
		/* 'headless' setting coming from synpress for tests with wallet
			--> Add 'HEADLESS=<any value> to.env file for headless mode
		*/
		// headless: process.env.HEADLESS === 'false' ? false : true,
		headless: process.env.HEADLESS ? true : false,
		// trace: 'retain-on-failure',
		screenshot: 'only-on-failure',
		video: 'retain-on-failure',
		extraHTTPHeaders: {
			// We set this header per GitHub guidelines.
			Accept: 'application/vnd.github.v3+json',
			// Add authorization token to all requests.
			// Assuming personal access token available in the environment.
			// 'Authorization': `token ${process.env.API_TOKEN}`,
		},
	},

	/* Configure projects for major browsers */
	projects: [
		{
			name: 'synpress-v4',
			testMatch: ['**synpressV4/**'],
			use: {
				...devices['Desktop Chrome'],
			},
		},

		{
			name: 'lazy',
			testDir: './testsEarnProtocol',
			testIgnore: 'production/**',
			use: {
				baseURL: earnProtocolBaseUrl,
				...devices['Desktop Chrome'],
			},
		},

		{
			name: 'lazy-no-wallet',
			testDir: './testsEarnProtocol/noWallet',
			// testMatch: ['noWallet/**'],
			use: {
				baseURL: earnProtocolBaseUrl,
				...devices['Desktop Chrome'],
			},
		},

		{
			name: 'lazy-real-wallet',
			testDir: './testsEarnProtocol/withRealWallet',
			// testMatch: ['withRealWallet/**'],
			use: {
				baseURL: earnProtocolBaseUrl,
				...devices['Desktop Chrome'],
			},
		},

		{
			name: 'lazy-test-wallet',
			testDir: './testsEarnProtocol',
			testMatch: ['withTestWallet/**'],
			use: {
				baseURL: earnProtocolBaseUrl,
				...devices['Desktop Chrome'],
			},
		},

		{
			name: 'lazy-production',
			testDir: './testsEarnProtocol',
			testMatch: ['production/**'],
			use: {
				baseURL: 'https://summer.fi/earn',
				...devices['Desktop Chrome'],
			},
		},

		{
			name: 'lazy-production-no-wallet',
			testDir: './testsEarnProtocol',
			testMatch: ['production/noWallet/**'],
			use: {
				baseURL: 'https://summer.fi/earn',
				...devices['Desktop Chrome'],
			},
		},

		{
			name: 'lazy-production-real-wallet',
			testDir: './testsEarnProtocol',
			testMatch: ['production/realWallet/**'],
			use: {
				baseURL: 'https://summer.fi/earn',
				...devices['Desktop Chrome'],
			},
		},

		{
			name: 'api-tests',
			testMatch: ['api/**'],
			use: {
				...devices['Desktop Chrome'],
			},
		},

		{
			name: 'verify-staging',
			testMatch: ['verifyStaging.spec.ts'],
			use: {
				...devices['Desktop Chrome'],
			},
		},

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
			name: 'with-real-wallet',
			testMatch: ['withRealWallet/**'],
			use: { ...devices['Desktop Chrome'] },
		},

		{
			name: 'with-wallet-rays',
			testMatch: ['withWallet/rays/**'],
			use: { ...devices['Desktop Chrome'] },
		},

		{
			name: 'with-wallet-token-swap-rate',
			testMatch: ['withWallet/tokenSwapRate/**'],
			use: { ...devices['Desktop Chrome'] },
		},

		{
			name: 'with-wallet-rays-and-token-swap-rate',
			testMatch: ['withWallet/rays/**', 'withWallet/tokenSwapRate/**'],
			use: { ...devices['Desktop Chrome'] },
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
			name: 'with-wallet-aave-ethereum-new',
			testMatch: ['withWallet/aaveV3_new/ethereum/**'],
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
			name: 'with-wallet-ajna-all-but-optimism',
			testMatch: [
				'withWallet/ajna/arbitrum/**',
				'withWallet/ajna/base/**',
				'withWallet/ajna/ethereum/**',
			],
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
			name: 'with-wallet-morphoblue',
			testMatch: ['withWallet/morphoBlue/**'],
			use: { ...devices['Desktop Chrome'] },
		},

		{
			name: 'with-wallet-morphoblue-ethereum',
			testMatch: ['withWallet/morphoBlue/ethereum/**'],
			use: { ...devices['Desktop Chrome'] },
		},

		{
			name: 'with-wallet-morphoblue-base',
			testMatch: ['withWallet/morphoBlue/base/**'],
			use: { ...devices['Desktop Chrome'] },
		},

		{
			name: 'with-wallet-morpho-and-ajna-ethereum',
			testMatch: ['withWallet/morphoBlue/ethereum/**', 'withWallet/ajna/ethereum/**'],
			use: { ...devices['Desktop Chrome'] },
		},

		{
			name: 'with-wallet-morpho-and-ajna-base',
			testMatch: ['withWallet/morphoBlue/base/**', 'withWallet/ajna/base/**'],
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
			testMatch: ['withWallet/swap/**'],
			use: { ...devices['Desktop Chrome'] },
		},

		{
			name: 'with-wallet-swap-aavev3',
			testMatch: ['withWallet/swap/aave**'],
			use: { ...devices['Desktop Chrome'] },
		},

		{
			name: 'with-wallet-swap-maker',
			testMatch: ['withWallet/swap/maker**'],
			use: { ...devices['Desktop Chrome'] },
		},

		{
			name: 'with-wallet-swap-morphoblue',
			testMatch: ['withWallet/swap/morpho**'],
			use: { ...devices['Desktop Chrome'] },
		},

		{
			name: 'with-wallet-swap-spark',
			testMatch: ['withWallet/swap/spark**'],
			use: { ...devices['Desktop Chrome'] },
		},

		{
			name: 'with-wallet-open-positions',
			testMatch: ['withWallet/z_openPositions/**'],
			use: { ...devices['Desktop Chrome'] },
		},

		{
			name: 'with-wallet-open-positions-aave',
			testMatch: ['withWallet/z_openPositions/aave**/**'],
			use: { ...devices['Desktop Chrome'] },
		},

		{
			name: 'with-wallet-open-positions-aave-ethereum',
			testMatch: ['withWallet/z_openPositions/aave**/ethereum/**'],
			use: { ...devices['Desktop Chrome'] },
		},

		{
			name: 'with-wallet-open-positions-aave-ethereum-earn-multiply',
			testMatch: [
				'withWallet/z_openPositions/aave**/ethereum/**Mult**',
				'withWallet/z_openPositions/aave**/ethereum/**Earn**',
			],
			use: { ...devices['Desktop Chrome'] },
		},

		{
			name: 'with-wallet-open-positions-aave-ethereum-borrow',
			testMatch: ['withWallet/z_openPositions/aave**/ethereum/**Borr**'],
			use: { ...devices['Desktop Chrome'] },
		},

		{
			name: 'with-wallet-open-positions-aave-l2s',
			testMatch: [
				'withWallet/z_openPositions/aaveV3/arbitrum/**',
				'withWallet/z_openPositions/aaveV3/base/**',
				'withWallet/z_openPositions/aaveV3/optimism/**',
			],
			use: { ...devices['Desktop Chrome'] },
		},

		{
			name: 'with-wallet-open-positions-aave:base-and-arbitrum',
			testMatch: [
				'withWallet/z_openPositions/aaveV3/arbitrum/**',
				'withWallet/z_openPositions/aaveV3/base/**',
			],
			use: { ...devices['Desktop Chrome'] },
		},

		{
			name: 'with-wallet-open-positions-other',
			testMatch: [
				'withWallet/z_openPositions/morphoBlue/**',
				'withWallet/z_openPositions/spark/**',
			],
			use: { ...devices['Desktop Chrome'] },
		},

		{
			name: 'with-wallet-open-positions-aave-arbitrum',
			testMatch: ['withWallet/z_openPositions/aaveV3/arbitrum/**'],
			use: { ...devices['Desktop Chrome'] },
		},

		{
			name: 'with-wallet-open-positions-aave-base',
			testMatch: ['withWallet/z_openPositions/aaveV3/base/**'],
			use: { ...devices['Desktop Chrome'] },
		},

		{
			name: 'with-wallet-open-positions-aave-optimism',
			testMatch: ['withWallet/z_openPositions/aaveV3/optimism/**'],
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
