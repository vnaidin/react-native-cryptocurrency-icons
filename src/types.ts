import { ImageStyle, StyleProp } from "react-native";
import { icons } from "./iconsMap";

/** Union of all supported cryptocurrency symbol strings, derived from the icon map. */
export type CoinSymbol = keyof typeof icons;

export type CryptoIconProps = {
	/** Cryptocurrency symbol (e.g. "btc", "eth"). Case-insensitive. Falls back to placeholder if not found. */
	symbol: string;
	/** Rendered width/height in points. Defaults to 32. */
	size?: number;
	/** How the image scales within its bounds. Defaults to "contain". */
	resizeMode?: ImageStyle["resizeMode"];
	/** Accessibility label read by screen readers. Defaults to the symbol in uppercase. */
	accessibilityLabel?: string;
	style?: StyleProp<ImageStyle>;
};
