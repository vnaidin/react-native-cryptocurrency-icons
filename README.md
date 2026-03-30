# React Native Cryptocurrency Icons

514+ cryptocurrency icons as PNG components for React Native. Works with bare RN, Expo, and any Metro-based workflow — no native linking, no SVG renderer needed.

**[Browse the gallery →](https://vnaidin.github.io/react-native-cryptocurrency-icons)**

---

## Install

```sh
npm install @vnaidin/react-native-cryptocurrency-icons
```

## Usage

```tsx
import { CryptoIcon } from '@vnaidin/react-native-cryptocurrency-icons';

<CryptoIcon
  symbol="btc"
  size={32}
/>
```

`symbol` is case-insensitive. Unknown symbols silently fall back to a placeholder — no crash.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `symbol` | `string` | — | Coin symbol, e.g. `"btc"`, `"ETH"` |
| `size` | `number` | `32` | Rendered width/height in points |
| `resizeMode` | `ImageResizeMode` | `"contain"` | How the image scales within its bounds |
| `accessibilityLabel` | `string` | symbol uppercased | Screen reader label |
| `style` | `StyleProp<ImageStyle>` | — | Extra styles passed to `<Image>` |

### Utilities

```ts
import {
  getCryptoIconSource,
  getSupportedSymbols,
} from '@vnaidin/react-native-cryptocurrency-icons';

// Get the image source directly (useful for custom Image components)
const source = getCryptoIconSource('eth');

// Get all supported symbol strings
const symbols = getSupportedSymbols(); // ['0xbtc', 'aave', 'ada', ...]
```

---

## Adding a new coin

1. Drop a PNG into `icons/originals/` — any size, transparent background, named `<symbol>.png` (lowercase)
2. Run `npm run generate` — resizes to 128×128 and regenerates `src/iconsMap.ts`
3. Run `npm run build` and commit

Missing a coin? [Open an issue](https://github.com/vnaidin/react-native-cryptocurrency-icons/issues/new?assignees=vnaidin&labels=coin+request&template=add-currency.md&title=Add+Currency+%28Symbol%29).

---

## Dev reference

```sh
npm run generate     # Resize originals/ → icons/128/, regenerate iconsMap.ts + validate
npm run build        # Compile TypeScript (src/ → dist/) — run before committing
npm run check        # Validate iconsMap.ts ↔ icons/128/ are in sync (bidirectional)
npm run generateDoc  # Regenerate docs/index.html gallery
```

**Pre-commit hook** (Husky) runs `check` + auto-bumps the patch version in `package.json` — don't edit the version manually.

**Publishing** is automatic via GitHub Actions on pushes to `master` that touch `package.json`, `src/**`, or `dist/**`. Always run `npm run build` locally first — `dist/` is committed and included in the published package.

**Docs** (`docs/index.html`) are regenerated and deployed to GitHub Pages automatically on pushes to `master` that touch `docs/**`, `scripts/generate-html-gallery.js`, or `src/iconsMap.ts`.

---

## License

CC0-1.0 — icons originally from [cryptoicons.co](http://cryptoicons.co) by [Christopher Downer](https://github.com/cjdowner). React Native adaptation by [vnaidin](https://github.com/vnaidin).
