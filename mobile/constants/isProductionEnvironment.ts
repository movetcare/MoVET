import Constants from "expo-constants";

export const isProductionEnvironment =
  Constants?.expoConfig?.extra?.environment === "production";
