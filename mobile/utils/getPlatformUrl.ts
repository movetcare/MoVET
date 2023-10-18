import { isProductionEnvironment } from "./isProductionEnvironment";

export const getPlatformUrl = (application?: "website" | "app" | "mobile") => {
  switch (application) {
    case "website":
      return isProductionEnvironment
        ? "https://movetcare.com"
        : "http://localhost:3000";
    case "app":
      return isProductionEnvironment
        ? "https://app.movetcare.com"
        : "http://localhost:3001";
    case "mobile":
      return isProductionEnvironment ? "movet://" : "exp-movet:/";
    default:
      return isProductionEnvironment
        ? "https://app.movetcare.com"
        : "http://localhost:3001";
  }
};
