const fs = require("fs");
const path = require("path");

const iconsMapPath = path.join(__dirname, "../src/iconsMap.ts");
const projectRoot = path.join(__dirname, "..");

const content = fs.readFileSync(iconsMapPath, "utf8");
const requireRegex = /require\(['"](\.\.\/icons\/\d+\/[^'"]+\.png)['"]\)/g;

let match;
let missing = [];

while ((match = requireRegex.exec(content)) !== null) {
	const iconPath = path.resolve(projectRoot, "src", match[1]);
	if (!fs.existsSync(iconPath)) {
		missing.push(iconPath);
	}
}

if (missing.length) {
	console.log("Missing icon files:");
	missing.forEach((f) => console.log(f));
	process.exit(1);
} else {
	console.log("All icon files exist!");
}
