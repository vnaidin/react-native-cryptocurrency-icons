import React, { JSX, memo } from "react";
import { Image, ImageSourcePropType } from "react-native";
import { icons } from "./iconsMap";
import { CryptoIconProps } from "./types";
import { PLACEHOLDER } from "./placeholder";

export const getCryptoIconSource = (symbol: string): ImageSourcePropType =>
	icons[symbol.toLowerCase()] ?? PLACEHOLDER;

export const getSupportedSymbols = (): string[] => Object.keys(icons);

const CryptoIcon = memo(({
	symbol,
	size = 32,
	style,
	resizeMode = "contain",
	accessibilityLabel,
}: CryptoIconProps): JSX.Element => (
	<Image
		source={getCryptoIconSource(symbol)}
		style={[{ width: size, height: size, resizeMode }, style]}
		accessibilityLabel={accessibilityLabel ?? symbol.toUpperCase()}
	/>
));

export { CryptoIcon, CryptoIconProps };
