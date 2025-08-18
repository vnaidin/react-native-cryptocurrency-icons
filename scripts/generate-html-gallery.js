const fs = require("fs");
const path = require("path");

const SRC_PATH = path.join(__dirname, "../src/iconsMap.ts");
const OUT_PATH = path.join(__dirname, "../docs/index.html");

const content = fs.readFileSync(SRC_PATH, "utf8");
const entryRegex =
	/(["']?)([\w$]+)\1\s*:\s*require\(["']\.\.\/icons\/(\d+)\/([\w$-]+)\.png["']\),?/g;
const result = {};
const sizesToParse = [32, 64, 128];
for (const size of sizesToParse) {
	const blockRegex = new RegExp(
		`(["']?${size}["']?)\\s*:\\s*\\{([\\s\\S]*?)\\}\\s*(?=,|\\}|$)`
	);
	const blockMatch = blockRegex.exec(content);
	if (!blockMatch) continue;
	const block = blockMatch[2];
	result[size] = {};
	let entryMatch;
	while ((entryMatch = entryRegex.exec(block))) {
		const symbol = entryMatch[2];
		const relPath = `icons/${size}/${entryMatch[4]}.png`;
		result[size][symbol] = relPath;
	}
}

// Generate HTML
const sizes = Object.keys(result).sort((a, b) => Number(a) - Number(b));
let html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cryptocurrency Icons Gallery</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <h1>Cryptocurrency Icons Gallery</h1>
    <div class="readme-example">
        <h2>Usage Example</h2>
        <p>Install the package and use in your React Native project:</p>
        <div style="position:relative;">
            <pre><code id="install-code">npm install @vnaidin/react-native-cryptocurrency-icons
</code></pre>
            <button class="copy-btn" data-copy-target="install-code" title="Copy" style="position:absolute;top:8px;right:8px;">Copy</button>
        </div>
        <p>Import package and use component:</p>
        <div style="position:relative;">
            <pre><code id="import-code">import { CryptoIcon } from '@vnaidin/react-native-cryptocurrency-icons';
        
&lt;CryptoIcon symbol="btc" size=&#123;32&#125; /&gt;
</code></pre>
            <button class="copy-btn" data-copy-target="import-code" title="Copy" style="position:absolute;top:8px;right:8px;">Copy</button>
        </div>
        <p>See <a href="https://github.com/vnaidin/react-native-cryptocurrency-icons#readme" target="_blank">README.md</a> for more details.</p>
    </div>
    <script>
    document.addEventListener('DOMContentLoaded', function() {
        document.querySelectorAll('.copy-btn').forEach(function(btn) {
            btn.addEventListener('click', function() {
                var targetId = btn.getAttribute('data-copy-target');
                var code = document.getElementById(targetId);
                if (code) {
                    var text = code.innerText || code.textContent;
                    copyToClipboard(text);
                    showCopyNotification();
                }
            });
        });
    });
    </script>
`;
// Add search bar and search logic
html += `<script>
function copyToClipboard(text) {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text);
    } else {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
    }
}
</script>
<div style="max-width:600px;margin:2rem auto 1rem;">
    <input id="icon-search" type="text" placeholder="Search by symbol..." style="width:100%;padding:12px 16px;font-size:1.1rem;border-radius:8px;border:1px solid #ccc;box-sizing:border-box;">
</div>
<script>
document.addEventListener('DOMContentLoaded', function() {
    var searchInput = document.getElementById('icon-search');
    if (!searchInput) return;
    searchInput.addEventListener('input', function() {
        var query = this.value.trim().toLowerCase();
        document.querySelectorAll('.size-section').forEach(function(section) {
            var anyVisible = false;
            section.querySelectorAll('.icon-item').forEach(function(item) {
                var label = item.querySelector('.icon-label').textContent.toLowerCase();
                if (!query || label.includes(query)) {
                    item.style.display = '';
                    anyVisible = true;
                } else {
                    item.style.display = 'none';
                }
            });
            section.style.display = anyVisible ? '' : 'none';
        });
    });
});
</script>
`;
html += `<div id="copy-notification" style="display:none;position:fixed;top:24px;left:50%;transform:translateX(-50%);background:#222;color:#fff;padding:10px 22px;border-radius:8px;box-shadow:0 2px 8px #0003;font-size:1rem;z-index:9999;transition:opacity 0.2s;">Copied to clipboard!</div>
<script>
function showCopyNotification() {
    var notif = document.getElementById('copy-notification');
    notif.style.display = 'block';
    notif.style.opacity = '1';
    setTimeout(function() {
        notif.style.opacity = '0';
        setTimeout(function() { notif.style.display = 'none'; }, 300);
    }, 1200);
}
const origCopyToClipboard = copyToClipboard;
window.copyToClipboard = function(text) {
    origCopyToClipboard(text);
    showCopyNotification();
};
</script>
`;
sizes.forEach((size) => {
	html += `<div class="size-section">
        <div class="size-title">Size: ${size}px</div>
        <div class="icons-grid">
`;
	Object.entries(result[size]).forEach(([symbol, relPath]) => {
		html += `      <div class="icon-item">
                <img src="${relPath}" alt="${symbol}" style="cursor:pointer" title="Copy usage to clipboard"
                    onclick="copyToClipboard('<CryptoIcon symbol=\\'${symbol}\\' originSize=\\{${size}\\} />')">
                <div class="icon-label">${symbol}</div>
            </div>\n`;
	});
	html += `    </div>\n  </div>\n`;
});

// Add footer
const year = new Date().getFullYear();
html += `<footer style="margin:2rem auto 1rem;text-align:center;color:#888;font-size:1rem;">
    &copy; ${year} react-native-cryptocurrency-icons
</footer>
`;
html += `</body>\n</html>\n`;

fs.writeFileSync(OUT_PATH, html);
console.log(`Generated static gallery at ${OUT_PATH}`);
