import { testWithSynpress } from '@synthetixio/synpress';
import { logInWithWalletAddress } from 'srcEarnProtocol/utils/logIn';
import { test as withRealWalletBaseFixtures } from '../../srcEarnProtocol/fixtures/withRealWalletBase';

const test = testWithSynpress(withRealWalletBaseFixtures);

test.describe('DCA strategy - With wallet', async () => {
	test.beforeEach(async ({ app, metamask }, testInfo) => {
		testInfo.setTimeout(testInfo.timeout + 25_000);

		await logInWithWalletAddress({
			metamask,
			app,
			wallet: 'MetaMask',
		});

		await app.dca.openPage();
	});

	test('It should create a new DCA strategy - Ethereum - until rejecting first tx', async ({
		app,
		metamask,
	}) => {
		await app.dca.openStartingVaultDropdown();
		await app.dca.selectVault({
			type: 'Starting',
			riskManagementType: 'Risk-Managed by BlockAnalitica',
			token: 'USDC',
			riskLevel: 'Higher Risk',
		});

		await app.dca.openTargetVaultDropdown();
		await app.dca.selectVault({
			type: 'Target',
			riskManagementType: 'Risk-Managed by BlockAnalitica',
			token: 'ETH',
			riskLevel: 'Lower Risk',
		});

		await app.dca.selectFrequency('Monthly');
		await app.dca.enterAmount('6');
		await app.dca.priceLimit('4500');
		await app.dca.maxNumberOfTrades('5');
		await app.dca.tradeUntil('2026-12-31');

		await app.dca.previewDcaStrategy();

		// TODO: Assert Review info

		await app.dca.agreeAndSign();
		await metamask.rejectTransaction();
	});

	test('It should create a new DCA strategy - Base - until rejecting first tx', async ({
		app,
		metamask,
	}) => {
		await app.dca.selectNetwork('Base');
		await app.dca.openStartingVaultDropdown();
		await app.dca.selectVault({
			type: 'Starting',
			riskManagementType: 'Risk-Managed by BlockAnalitica',
			token: 'ETH',
			riskLevel: 'Lower Risk',
		});

		await app.dca.selectFrequency('Monthly');
		await app.dca.enterAmount('0.01');
		await app.dca.priceLimit('1000');
		await app.dca.maxNumberOfTrades('5');
		await app.dca.tradeUntil('2026-12-31');

		await app.dca.previewDcaStrategy();

		// TODO: Assert Review info

		await app.dca.agreeAndSign();
		await metamask.rejectTransaction();
	});
});
