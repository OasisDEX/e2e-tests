import { App } from 'src/app';

export const enableFlags = async ({ app, flags }: { app: App; flags: string[] }) => {
	const localStorage = await app.page.evaluate(() => window.localStorage);
	const features = JSON.parse(localStorage.features);

	flags.forEach((flag) => (features[flag] = true));

	await app.page.evaluate(
		(features) => localStorage.setItem('features', JSON.stringify(features)),
		features
	);
	await app.page.reload();
};
