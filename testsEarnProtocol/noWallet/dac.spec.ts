import { test } from '#earnProtocolFixtures';

test.describe('DCA Strategy', async () => {
	test.beforeEach(async ({ app }) => {
		await app.dca.openPage();
	});

	test('It should select network', async ({ app }) => {
		// 'Ethereum' selected by default
		await app.dca.shouldHaveNetworkSelected('Ethereum');

		// Select 'Base'
		await app.dca.selectNetwork('Base');
		await app.dca.shouldHaveNetworkSelected('Base');

		// Select 'Ethereum'
		await app.dca.selectNetwork('Ethereum');
		await app.dca.shouldHaveNetworkSelected('Ethereum');
	});

	(
		[
			{
				network: 'Ethereum',
				svRiskManagementType: 'DAO Risk-Managed',
				svToken: 'USDC',
				svRiskLevel: 'Higher Risk',
				tvRiskManagementType: 'Risk-Managed by BlockAnalitica',
				tvToken: 'ETH',
				tvRiskLevel: 'Lower Risk',
			},
			{
				network: 'Ethereum',
				svRiskManagementType: 'DAO Risk-Managed',
				svToken: 'USDC',
				svRiskLevel: 'Higher Risk',
				tvRiskManagementType: 'Risk-Managed by BlockAnalitica',
				tvToken: 'ETH',
				tvRiskLevel: 'Higher Risk',
			},
			{
				network: 'Ethereum',
				svRiskManagementType: 'Risk-Managed by BlockAnalitica',
				svToken: 'USDC',
				svRiskLevel: 'Higher Risk',
				tvRiskManagementType: 'Risk-Managed by BlockAnalitica',
				tvToken: 'ETH',
				tvRiskLevel: 'Lower Risk',
			},
			{
				network: 'Ethereum',
				svRiskManagementType: 'Risk-Managed by BlockAnalitica',
				svToken: 'USDC',
				svRiskLevel: 'Higher Risk',
				tvRiskManagementType: 'Risk-Managed by BlockAnalitica',
				tvToken: 'ETH',
				tvRiskLevel: 'Higher Risk',
			},
			{
				network: 'Ethereum',
				svRiskManagementType: 'Risk-Managed by BlockAnalitica',
				svToken: 'USDC',
				svRiskLevel: 'Lower Risk',
				tvRiskManagementType: 'Risk-Managed by BlockAnalitica',
				tvToken: 'ETH',
				tvRiskLevel: 'Lower Risk',
			},
			{
				network: 'Ethereum',
				svRiskManagementType: 'Risk-Managed by BlockAnalitica',
				svToken: 'USDC',
				svRiskLevel: 'Lower Risk',
				tvRiskManagementType: 'Risk-Managed by BlockAnalitica',
				tvToken: 'ETH',
				tvRiskLevel: 'Higher Risk',
			},
			{
				network: 'Ethereum',
				svRiskManagementType: 'Risk-Managed by BlockAnalitica',
				svToken: 'USDT',
				svRiskLevel: 'Lower Risk',
				tvRiskManagementType: 'Risk-Managed by BlockAnalitica',
				tvToken: 'ETH',
				tvRiskLevel: 'Lower Risk',
			},
			{
				network: 'Ethereum',
				svRiskManagementType: 'Risk-Managed by BlockAnalitica',
				svToken: 'USDT',
				svRiskLevel: 'Lower Risk',
				tvRiskManagementType: 'Risk-Managed by BlockAnalitica',
				tvToken: 'ETH',
				tvRiskLevel: 'Higher Risk',
			},

			{
				network: 'Ethereum',
				svRiskManagementType: 'Risk-Managed by BlockAnalitica',
				svToken: 'ETH',
				svRiskLevel: 'Lower Risk',
				tvRiskManagementType: 'DAO Risk-Managed',
				tvToken: 'USDC',
				tvRiskLevel: 'Higher Risk',
			},
			{
				network: 'Ethereum',
				svRiskManagementType: 'Risk-Managed by BlockAnalitica',
				svToken: 'ETH',
				svRiskLevel: 'Lower Risk',
				tvRiskManagementType: 'Risk-Managed by BlockAnalitica',
				tvToken: 'USDC',
				tvRiskLevel: 'Lower Risk',
			},
			{
				network: 'Ethereum',
				svRiskManagementType: 'Risk-Managed by BlockAnalitica',
				svToken: 'ETH',
				svRiskLevel: 'Lower Risk',
				tvRiskManagementType: 'Risk-Managed by BlockAnalitica',
				tvToken: 'USDC',
				tvRiskLevel: 'Higher Risk',
			},
			{
				network: 'Ethereum',
				svRiskManagementType: 'Risk-Managed by BlockAnalitica',
				svToken: 'ETH',
				svRiskLevel: 'Lower Risk',
				tvRiskManagementType: 'Risk-Managed by BlockAnalitica',
				tvToken: 'USDT',
				tvRiskLevel: 'Lower Risk',
			},
			{
				network: 'Ethereum',
				svRiskManagementType: 'Risk-Managed by BlockAnalitica',
				svToken: 'ETH',
				svRiskLevel: 'Higher Risk',
				tvRiskManagementType: 'DAO Risk-Managed',
				tvToken: 'USDC',
				tvRiskLevel: 'Higher Risk',
			},
			{
				network: 'Ethereum',
				svRiskManagementType: 'Risk-Managed by BlockAnalitica',
				svToken: 'ETH',
				svRiskLevel: 'Higher Risk',
				tvRiskManagementType: 'Risk-Managed by BlockAnalitica',
				tvToken: 'USDC',
				tvRiskLevel: 'Lower Risk',
			},
			{
				network: 'Ethereum',
				svRiskManagementType: 'Risk-Managed by BlockAnalitica',
				svToken: 'ETH',
				svRiskLevel: 'Higher Risk',
				tvRiskManagementType: 'Risk-Managed by BlockAnalitica',
				tvToken: 'USDC',
				tvRiskLevel: 'Higher Risk',
			},
			{
				network: 'Ethereum',
				svRiskManagementType: 'Risk-Managed by BlockAnalitica',
				svToken: 'ETH',
				svRiskLevel: 'Higher Risk',
				tvRiskManagementType: 'Risk-Managed by BlockAnalitica',
				tvToken: 'USDT',
				tvRiskLevel: 'Lower Risk',
			},
			{
				network: 'Base',
				svRiskManagementType: 'Risk-Managed by BlockAnalitica',
				svToken: 'ETH',
				svRiskLevel: 'Lower Risk',
				tvRiskManagementType: 'Risk-Managed by BlockAnalitica',
				tvToken: 'USDC',
				tvRiskLevel: 'Lower Risk',
			},
			{
				network: 'Base',
				svRiskManagementType: 'Risk-Managed by BlockAnalitica',
				svToken: 'USDC',
				svRiskLevel: 'Lower Risk',
				tvRiskManagementType: 'Risk-Managed by BlockAnalitica',
				tvToken: 'ETH',
				tvRiskLevel: 'Lower Risk',
			},
		] as const
	).forEach(
		({
			network,
			svRiskManagementType,
			svToken,
			svRiskLevel,
			tvRiskManagementType,
			tvToken,
			tvRiskLevel,
		}) => {
			test(`It should select Starting Vault '${network} ${svToken} ${svRiskLevel === 'Lower Risk' ? 'LR' : 'HR'} ${svRiskManagementType === 'Risk-Managed by BlockAnalitica' ? 'BA' : 'DAO'}' and Target Vault '${network} ${tvToken} ${tvRiskLevel === 'Lower Risk' ? 'LR' : 'HR'} ${tvRiskManagementType === 'Risk-Managed by BlockAnalitica' ? 'BA' : 'DAO'}'`, async ({
				app,
			}) => {
				await app.dca.selectNetwork(network);
				await app.dca.shouldHaveNetworkSelected(network);

				await app.dca.openStartingVaultDropdown();
				await app.dca.shouldHaveVaultDropdownOpened('starting');
				await app.dca.selectVault({
					type: 'Starting',
					riskManagementType: svRiskManagementType,
					token: svToken,
					riskLevel: svRiskLevel,
				});

				await app.dca.openTargetVaultDropdown();
				await app.dca.shouldHaveVaultDropdownOpened('target');
				await app.dca.selectVault({
					type: 'Target',
					riskManagementType: tvRiskManagementType,
					token: tvToken,
					riskLevel: tvRiskLevel,
				});

				await app.dca.vaultShouldBe({
					type: 'Starting',
					riskManagementType: svRiskManagementType,
					token: svToken,
					riskLevel: svRiskLevel,
				});

				await app.dca.vaultShouldBe({
					type: 'Target',
					riskManagementType: tvRiskManagementType,
					token: tvToken,
					riskLevel: tvRiskLevel,
				});
			});
		},
	);

	test('It should select how often the strategy runs', async ({ app }) => {
		// 'Daily' should be selected by default
		await app.dca.shouldHaveFrequencySelected('Daily');

		// Select 'Weekly'
		await app.dca.selectFrequency('Weekly');
		await app.dca.shouldHaveFrequencySelected('Weekly');
		await app.dca.shouldHaveKpiCards([
			{
				frequency: '7 days',
				spend: '250.00.*USDC',
				accumulate: '0.[0-9]{2,4}.*ETH',
				executions: '1',
			},
			{
				frequency: '30 days',
				spend: '1.00K.*USDC',
				accumulate: '0.[0-9]{2,4}.*ETH',
				executions: '4',
			},
			{
				frequency: '90 days',
				spend: '3.00K.*USDC',
				accumulate: '[0-2].[0-9]{2,4}.*ETH',
				executions: '12',
			},
		]);

		// Select 'Monthly'
		await app.dca.selectFrequency('Monthly');
		await app.dca.shouldHaveFrequencySelected('Monthly');
		await app.dca.shouldHaveKpiCards([
			{
				frequency: '30 days',
				spend: '250.00.*USDC',
				accumulate: '0.[0-9]{2,4}.*ETH',
				executions: '1',
			},
			{
				frequency: '90 days',
				spend: '750.00.*USDC',
				accumulate: '0.[0-9]{2,4}.*ETH',
				executions: '3',
			},
			{
				frequency: '180 days',
				spend: '1.50K.*USDC',
				accumulate: '[0-1].[0-9]{2,4}.*ETH',
				executions: '6',
			},
		]);

		// Select 'Daily'
		await app.dca.selectFrequency('Daily');
		await app.dca.shouldHaveFrequencySelected('Daily');
		await app.dca.shouldHaveKpiCards([
			{
				frequency: '7 days',
				spend: '1.75K.*USDC',
				accumulate: '0.[0-9]{2,4}.*ETH',
				executions: '7',
			},
			{
				frequency: '30 days',
				spend: '7.50K.*USDC',
				accumulate: '[1-4].[0-9]{2,4}.*ETH',
				executions: '30',
			},
			{
				frequency: '90 days',
				spend: '22.50K.*USDC',
				accumulate: '[0-9]{1,2}.[0-9]{2,4}.*ETH',
				executions: '90',
			},
		]);
	});

	test('It should ask to Connect Wallet when trying to create a new DCA strategy', async ({
		app,
	}) => {
		await app.dca.previewDcaStrategy();

		await app.dca.connectWallet();
		await app.modals.logIn.shouldBeVisible();
	});

	test('It should show Preview info', async ({ app }) => {
		await app.dca.priceLimit('5000');
		await app.dca.maxNumberOfTrades('200');
		await app.dca.tradeUntil('20/12/2026');
		await app.dca.previewDcaStrategy();

		await app.dca.preview.shouldBeVisible();
		await app.dca.preview.shouldHave({
			network: 'Ethereum',
			startingVault: {
				riskManagementType: 'Risk-Managed by BlockAnalitica',
				token: 'USDC',
				riskLevel: 'Lower Risk',
			},

			// TODO: Add amount per run, frequency in days, price limit, max number of trades and trade until
		});
	});
});
