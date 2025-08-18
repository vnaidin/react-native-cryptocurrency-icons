import { ImageSourcePropType } from "react-native";
import { CryptoIconProps } from "./types";

export const PLACEHOLDER_MAP: Record<
    CryptoIconProps["originSize"],
    ImageSourcePropType
> = {
    32: require("../icons/32/placeholder.png"),
    64: require("../icons/64/placeholder.png"),
    128: require("../icons/128/placeholder.png"),
};