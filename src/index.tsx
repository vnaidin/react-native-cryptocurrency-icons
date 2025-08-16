import React from "react";
import { Image, ImageStyle, StyleProp } from "react-native";
import { icons } from "./iconsMap";

type Props = {
	symbol: string;
	originSize: 32 | 64 | 128;
	size?: number;
	style?: StyleProp<ImageStyle>;
};

export const CryptoIcon = ({ symbol, size = 32, style, originSize }: Props) => {
	const icon =
		icons[originSize as keyof typeof icons][
			symbol.toUpperCase() as keyof (typeof icons)[keyof typeof icons]
		];
	if (!icon) return <Image
            source={require(`../icons/${originSize}/placeholder.png`)}
            style={[{ width: size, height: size, resizeMode: "contain" }, style]}
        />;

	return (
		<Image
			source={icon}
			style={[{ width: size, height: size, resizeMode: "contain" }, style]}
		/>
	);
};

export default CryptoIcon;
