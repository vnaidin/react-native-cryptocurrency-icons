const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const originalsDir = path.join(__dirname, "../icons/originals");
const iconsDir = path.join(__dirname, "../icons/128");
const nativeDir = path.join(__dirname, "../icons/native");
const iconsMapPath = path.join(__dirname, "../src/iconsMap.ts");

const SIZE = 128;
// What React Native bundles. Change this to trade sharpness for app size.
const NATIVE_SIZE = 95;

async function resizeOriginals() {
	const pngs = fs
		.readdirSync(originalsDir)
		.filter((f) => f.endsWith(".png") && !f.startsWith("placeholder"));

	if (pngs.length === 0) return;

	console.log(`Resizing ${pngs.length} PNG(s) from originals...`);

	await Promise.all(
		pngs.map(async (file) => {
			const src = path.join(originalsDir, file);
			const dest = path.join(iconsDir, file);

			const meta = await sharp(src).metadata();
			if (meta.width === SIZE && meta.height === SIZE && fs.existsSync(dest)) return;

			await sharp(src)
				.resize(SIZE, SIZE, {
					fit: "contain",
					background: { r: 0, g: 0, b: 0, alpha: 0 },
				})
				.png()
				.toFile(dest);

			console.log(`  ${file} → icons/128/${file}`);
		})
	);
}

async function generateNativeIcons() {
	fs.rmSync(nativeDir, { recursive: true, force: true });
	fs.mkdirSync(nativeDir, { recursive: true });

	const pngs = fs.readdirSync(iconsDir).filter((f) => f.endsWith(".png"));
	const sizeOf = (dir) =>
		fs.readdirSync(dir).reduce((sum, f) => sum + fs.statSync(path.join(dir, f)).size, 0);

	await Promise.all(
		pngs.map((file) =>
			sharp(path.join(iconsDir, file))
				.resize(NATIVE_SIZE, NATIVE_SIZE)
				.webp({ quality: 80, alphaQuality: 90, effort: 6 })
				.toFile(path.join(nativeDir, file.replace(".png", ".webp")))
		)
	);

	const mb = (bytes) => (bytes / 1048576).toFixed(2);
	console.log(
		`Native icons: ${pngs.length} at ${NATIVE_SIZE}px, ${mb(sizeOf(iconsDir))} MB → ${mb(sizeOf(nativeDir))} MB`
	);
}

function generateSources() {
	const symbols = fs
		.readdirSync(iconsDir)
		.filter((f) => f.endsWith(".png") && !f.startsWith("placeholder"))
		.map((f) => f.replace(".png", ""))
		.sort();

	if (symbols.length === 0) {
		console.error("No icons found in icons/128/");
		process.exit(1);
	}

	// iconsMap.ts
	const requireLine = (symbol) => {
		const key = /^[a-z_$][a-z0-9_$]*$/i.test(symbol) ? symbol : `"${symbol}"`;
		return `\t${key}: require("../icons/native/${symbol}.webp"),`;
	};

	fs.writeFileSync(
		iconsMapPath,
		[
			`import { ImageSourcePropType } from "react-native";`,
			``,
			`export const icons: Record<string, ImageSourcePropType> = {`,
			...symbols.map(requireLine),
			`};`,
			``,
		].join("\n")
	);

	console.log(`Generated ${symbols.length} icons.`);
}

resizeOriginals().then(generateNativeIcons).then(generateSources).catch((err) => {
	console.error(err.message);
	process.exit(1);
});
