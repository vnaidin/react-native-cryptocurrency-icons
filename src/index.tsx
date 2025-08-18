import React, { JSX } from "react";
import { Image, ImageSourcePropType } from "react-native";
import { icons } from "./iconsMap";
import { CryptoIconProps } from "./types";
import { PLACEHOLDER_MAP } from "./placeholder";

/**
 * CryptoIcon component to display cryptocurrency icons.
 *
 * @param {CryptoIconProps} props - Properties for the CryptoIcon component.
 * @returns {JSX.Element} The rendered CryptoIcon component.
 */
const CryptoIcon = ({
	symbol,
	size = 32,
	style,
	originSize = 32,
}: CryptoIconProps): JSX.Element => {
	const icon: ImageSourcePropType =
		icons[originSize as CryptoIconProps["originSize"]][
			symbol.toLowerCase() as keyof (typeof icons)[CryptoIconProps["originSize"]]
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

export { CryptoIcon, CryptoIconProps };
