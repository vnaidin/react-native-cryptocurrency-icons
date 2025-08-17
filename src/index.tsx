import React from "react";
import { Image } from "react-native";
import { icons } from "./iconsMap";
import { IconProps } from "./types";
const PLACEHOLDER_MAP = {
	32: require("../icons/32/placeholder.png"),
	64: require("../icons/64/placeholder.png"),
	128: require("../icons/128/placeholder.png"),
} as const;



export const CryptoIcon = ({ symbol, size = 32, style, originSize = 32 }: IconProps) => {
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
			source={typeof icon === "string" ? { uri: icon } : icon}
			style={[{ width: size, height: size, resizeMode: "contain" }, style]}
		/>
	);
};

export default CryptoIcon;
