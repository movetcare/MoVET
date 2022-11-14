export const environment =
  typeof window !== "undefined" &&
  (window.location.hostname === "movetcare.com" ||
    window.location.hostname === "admin.movetcare.com" ||
    window.location.hostname === "app.movetcare.com")
    ? "production"
    : "development";
