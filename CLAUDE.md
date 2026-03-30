# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run build        # Compile TypeScript (src/ → dist/) — always run before publishing
npm run generate     # Regenerate iconsMap.ts + CoinSymbol type from icons/128/, then validate
npm run check        # Validate iconsMap.ts references match files on disk (bidirectional)
npm run generateDoc  # Regenerate the static HTML icon gallery in docs/
npm run deploy:docs  # generateDoc + push to gh-pages branch
```

No test suite. The pre-commit hook (Husky) runs `npm run check && npm version patch --no-git-tag-version && git add package.json` on every commit — this auto-bumps the patch version, so don't manually edit the version in `package.json`.

## Architecture

React Native image library that maps cryptocurrency symbols to bundled PNG assets. The component is intentionally minimal — no SVG, no vector rendering, just static PNGs via React Native's `Image` so it works across RN, Expo, and bare workflows without any native linking.

**How it works end-to-end:**

`CryptoIcon` ([src/index.tsx](src/index.tsx)) lowercases `symbol`, looks it up in the flat `icons` map from [src/iconsMap.ts](src/iconsMap.ts), and renders an `<Image>`. Unknown symbols silently fall back to a placeholder from [src/placeholder.ts](src/placeholder.ts). The `size` prop controls rendered `width`/`height` in points (defaults to 32); the 128px asset scales down in hardware — always sharp on retina.

**The iconsMap is hand-maintained** — [src/iconsMap.ts](src/iconsMap.ts) is ~520 lines of static `require()` calls pointing at `icons/128/`. Metro bundler requires static paths to bundle assets; dynamic paths won't work in React Native.

**Adding a new coin — two steps:**
1. Drop a PNG into [icons/128/](icons/128/) (transparent background, `<symbol>.png` lowercase)
2. Run `npm run generate` — regenerates `iconsMap.ts` and the `CoinSymbol` union type from the filesystem, then validates

**Publishing:** GitHub Actions publishes to npm automatically on pushes to `master` that touch `package.json`, `src/**`, or `dist/**`. Always run `npm run build` locally first since `dist/` is committed and included in the published package.
