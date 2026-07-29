/**
 * Web entry point for @vnaidin/react-native-cryptocurrency-icons.
 *
 * This file is intentionally separate from the React Native entry (index.tsx)
 * and has NO dependency on react-native. It exports:
 *   - `getCryptoIconUrl(symbol)` — returns a URL string suitable for <img src>
 *   - `CryptoIcon` — a lightweight React web component (<img> with fallback avatar)
 *
 * For bundlers that support `new URL(..., import.meta.url)` (Vite, webpack 5+),
 * the PNG is resolved at build time and hashed into the output.
 *
 * The RN entry point (index.tsx / dist/index.js) is unaffected by this file.
 */
import React, { useState, CSSProperties } from "react";
import { webIconsList } from "./webIconsList";

export type CryptoIconWebProps = {
	/** Cryptocurrency symbol, case-insensitive (e.g. "BTC", "eth"). */
	symbol: string;
	/** Width & height in pixels. Defaults to 32. */
	size?: number;
	/** Extra className for the root element. */
	className?: string;
	/** Extra inline style for the root element. */
	style?: CSSProperties;
	/** Alt text. Defaults to symbol in uppercase. */
	alt?: string;
};

/**
 * Returns a resolved URL string for the icon PNG, or `null` if the symbol
 * is not in the known icon set. Works with Vite / webpack 5+ via
 * `new URL(..., import.meta.url)`.
 */
export function getCryptoIconUrl(symbol: string): string | null {
	const key = symbol.toLowerCase();
	if (!webIconsList.has(key)) return null;
	return new URL(`../icons/128/${key}.png`, import.meta.url).href;
}

/**
 * Returns true if a PNG icon exists for the given symbol.
 */
export function isCryptoIconSupported(symbol: string): boolean {
	return webIconsList.has(symbol.toLowerCase());
}

/**
 * Returns all supported symbol strings.
 */
export function getSupportedSymbols(): string[] {
	return [...webIconsList];
}

/**
 * Lightweight web `<img>` component for cryptocurrency icons.
 * Falls back to a colored letter-avatar when no icon is available or on error.
 */
export const CryptoIcon = React.memo(function CryptoIcon({
	symbol,
	size = 32,
	className,
	style,
	alt,
}: CryptoIconWebProps): React.ReactElement {
	const url = getCryptoIconUrl(symbol);
	const [errored, setErrored] = useState(false);

	const rootStyle: CSSProperties = {
		width: size,
		height: size,
		display: "inline-flex",
		alignItems: "center",
		justifyContent: "center",
		borderRadius: "50%",
		overflow: "hidden",
		flexShrink: 0,
		...style,
	};

	if (url && !errored) {
		return (
			<span className={className} style={rootStyle}>
				<img
					src={url}
					alt={alt ?? symbol.toUpperCase()}
					width={size}
					height={size}
					onError={() => setErrored(true)}
					style={{ width: "100%", height: "100%", objectFit: "contain" }}
				/>
			</span>
		);
	}

	// Fallback: letter avatar with a deterministic color derived from the symbol
	const letter = symbol.slice(0, 2).toUpperCase();
	const hue =
		symbol
			.toLowerCase()
			.split("")
			.reduce((acc, c) => acc + c.charCodeAt(0), 0) % 360;

	return (
		<span
			className={className}
			style={{
				...rootStyle,
				background: `hsl(${hue}, 55%, 38%)`,
				color: "#fff",
				fontSize: size * 0.32,
				fontWeight: 700,
				fontFamily: "sans-serif",
			}}
		>
			{letter}
		</span>
	);
});

export type { CryptoIconWebProps as CryptoIconProps };
