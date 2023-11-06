import React from "react";
import { Image, useColorScheme } from "react-native";

export const MoVETLogo = ({
  type,
  height,
  width,
  resizeMode,
  style,
  override,
}: {
  type?: "default" | "white" | "black" | "paw-white" | "paw-black";
  height?: number;
  width?: number;
  resizeMode?: string;
  style?: any;
  override?: "default" | "white" | "black" | "paw-white" | "paw-black";
}) => {
  const isDarkMode = useColorScheme() !== "light";
  let source = null;
  switch (override) {
    case "default":
      source = require("assets/images/logos/logo.png");
      break;
    case "white":
      source = require("assets/images/logos/logo-white.png");
      break;
    case "black":
      source = require("assets/images/logos/logo-black.png");
      break;
    case "paw-white":
      source = require("assets/images/logos/logo-paw-white.png");
      break;
    case "paw-black":
      source = require("assets/images/logos/logo-paw-black.png");
      break;
    default:
      source = require("assets/images/logos/logo.png");
      break;
  }
  return (
    <Image
      alt="MoVET Care Logo"
      style={[{ width: width || 140, height: height || 30 }, style]}
      source={
        override && source !== null
          ? source
          : isDarkMode
          ? type === "white"
            ? require("assets/images/logos/logo-black.png")
            : type === "black"
            ? require("assets/images/logos/logo-white.png")
            : type === "paw-white"
            ? require("assets/images/logos/logo-paw-black.png")
            : type === "paw-black"
            ? require("assets/images/logos/logo-paw-white.png")
            : require("assets/images/logos/logo-white.png")
          : type === "white"
          ? require("assets/images/logos/logo-white.png")
          : type === "black"
          ? require("assets/images/logos/logo-black.png")
          : type === "paw-white"
          ? require("assets/images/logos/logo-paw-white.png")
          : type === "paw-black"
          ? require("assets/images/logos/logo-paw-black.png")
          : require("assets/images/logos/logo.png")
      }
      resizeMode={(resizeMode as any) || "contain"}
    />
  );
};
