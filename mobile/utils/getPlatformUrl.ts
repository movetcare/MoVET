import { isProductionEnvironment } from "./isProductionEnvironment";

export const getPlatformUrl = (
  application: "website" | "app" | "mobile" = "app",
) => {
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
      return isProductionEnvironment ? "movet://" : "exp://127.0.0.1:8081/--/";
    default:
      return isProductionEnvironment
        ? "https://app.movetcare.com"
        : "http://localhost:3001";
  }
};
