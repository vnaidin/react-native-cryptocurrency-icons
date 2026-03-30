const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const originalsDir = path.join(__dirname, "../icons/originals");
const iconsDir = path.join(__dirname, "../icons/128");
const iconsMapPath = path.join(__dirname, "../src/iconsMap.ts");

const SIZE = 128;

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
		return `\t${key}: require("../icons/128/${symbol}.png"),`;
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

resizeOriginals().then(generateSources).catch((err) => {
	console.error(err.message);
	process.exit(1);
});
