import { isProductionEnvironment } from "./isProductionEnvironment";

export const getPlatformUrl = (application?: "website" | "app") => {
  switch (application) {
    case "website":
      return isProductionEnvironment
        ? "https://movetcare.com"
        : "http://localhost:3000";
    case "app":
      return isProductionEnvironment
        ? "https://app.movetcare.com"
        : "http://localhost:3001";
    default:
      return isProductionEnvironment
        ? "https://app.movetcare.com"
        : "http://localhost:3001";
  }
};
