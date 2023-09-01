import { App } from 'src/app';

export const enableNetworkSwitcherFoks = async (app: App) => {
	const localStorage = await app.page.evaluate(() => window.localStorage);
	const features = JSON.parse(localStorage.features);
	features.UseNetworkSwitcherForks = true;
	await app.page.evaluate(
		(features) => localStorage.setItem('features', JSON.stringify(features)),
		features
	);
	await app.page.reload();
};
