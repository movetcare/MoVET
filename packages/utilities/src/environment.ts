export const environment =
  typeof window !== "undefined" &&
  window.location.hostname.includes("movetcare.com")
    ? "production"
    : typeof window !== "undefined" && window.location.hostname === "localhost"
    ? "development"
    : process.env.NODE_ENV === "development"
    ? "development"
    : "development";
