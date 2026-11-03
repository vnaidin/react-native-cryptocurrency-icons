const fs = require("fs");
const path = require("path");

const iconsMapPath = path.join(__dirname, "../src/iconsMap.ts");
const projectRoot = path.join(__dirname, "..");
const iconsFolder = path.join(projectRoot, "icons/native");

const content = fs.readFileSync(iconsMapPath, "utf8");
const requireRegex = /require\(['"](\.\.\/icons\/native\/([^'\"]+\.webp))['"]\)/g;

let match;
let missing = [];
let referenced = new Set();

// Check that all requires point to existing files and collect referenced files
while ((match = requireRegex.exec(content)) !== null) {
	const relPath = match[1];
	const file = match[2];
	const iconPath = path.resolve(projectRoot, "src", relPath);
	referenced.add(file);
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
if (fs.existsSync(iconsFolder)) {
	unreferenced = fs
		.readdirSync(iconsFolder)
		.filter((f) => f.endsWith(".webp") && !f.startsWith("placeholder") && !referenced.has(f));
}

if (unreferenced.length) {
	console.log(
		"\nIcon files present in icons folders but NOT referenced in iconsMap.ts:"
	);
	unreferenced.forEach((f) => console.log(f));
}
