import * as Device from "expo-device";
import { isProductionEnvironment } from "./isProductionEnvironment";
export type ApplicationTypes = "website" | "app" | "mobile";
export const getPlatformUrl = (application: ApplicationTypes = "app") => {
  const isAndroid = !Device.brand?.toLowerCase()?.includes("apple");
  switch (application) {
    case "website":
      return isProductionEnvironment || isAndroid
        ? "https://movetcare.com"
        : "http://localhost:3000";
    case "app":
      return isProductionEnvironment || isAndroid
        ? "https://app.movetcare.com"
        : "http://localhost:3001";
    case "mobile":
      return isProductionEnvironment || isAndroid
        ? "movet://"
        : "exp://127.0.0.1:8081/--/";
    default:
      return isProductionEnvironment || isAndroid
        ? "https://app.movetcare.com"
        : "http://localhost:3001";
  }
};
