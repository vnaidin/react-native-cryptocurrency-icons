import React from "react";
import { Image, ImageStyle, StyleProp } from "react-native";
import { icons } from "./iconsMap";
const PLACEHOLDER_MAP = {
	32: require("../icons/32/placeholder.png"),
	64: require("../icons/64/placeholder.png"),
	128: require("../icons/128/placeholder.png"),
} as const;

type Props = {
	symbol: string;
	originSize: 32 | 64 | 128;
	size?: number;
	style?: StyleProp<ImageStyle>;
};

export const CryptoIcon = ({ symbol, size = 32, style, originSize = 32 }: Props) => {
	const icon =
		icons[originSize as keyof typeof icons][
			symbol.toLowerCase() as keyof (typeof icons)[keyof typeof icons]
		];
	if (!icon)
		return (
			<Image
				source={PLACEHOLDER_MAP[originSize]}
				style={[{ width: size, height: size, resizeMode: "contain" }, style]}
			/>
		);

	return (
		<Image
			source={icon}
			style={[{ width: size, height: size, resizeMode: "contain" }, style]}
		/>
	);
};

export default CryptoIcon;
