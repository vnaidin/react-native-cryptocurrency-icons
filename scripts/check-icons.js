const fs = require("fs");
const path = require("path");

const iconsMapPath = path.join(__dirname, "../src/iconsMap.ts");
const projectRoot = path.join(__dirname, "..");
const iconsFolders = [32, 64, 128].map((size) => path.join(projectRoot, `icons/${size}`));

const content = fs.readFileSync(iconsMapPath, "utf8");
const requireRegex = /require\(['"](\.\.\/icons\/(\d+)\/([^'\"]+\.png))['"]\)/g;

let match;
let missing = [];
let referenced = new Set();

// Check that all requires point to existing files and collect referenced files
while ((match = requireRegex.exec(content)) !== null) {
	const relPath = match[1];
	const size = match[2];
	const file = match[3];
	const iconPath = path.resolve(projectRoot, "src", relPath);
	referenced.add(`${size}/${file}`);
	if (!fs.existsSync(iconPath)) {
		missing.push(iconPath);
	}
}

if (missing.length) {
	console.log("Missing icon files referenced in iconsMap.ts:");
	missing.forEach((f) => console.log(f));
} 

// Now check for files that exist but are not referenced in the map
let unreferenced = [];
for (const folder of iconsFolders) {
	if (!fs.existsSync(folder)) continue;
	const files = fs.readdirSync(folder).filter((f) => f.endsWith(".png")&& !f.startsWith("placeholder"));
	const size = path.basename(folder);
	for (const file of files) {
		if (!referenced.has(`${size}/${file}`)) {
			unreferenced.push(`${size}/${file}`);
		}
	}
}

if (unreferenced.length) {
	console.log(
		"\nIcon files present in icons folders but NOT referenced in iconsMap.ts:"
	);
	unreferenced.forEach((f) => console.log(f));
}
