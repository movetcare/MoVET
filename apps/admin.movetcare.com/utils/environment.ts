const environment =
  typeof window !== "undefined" &&
  window.location.hostname === "admin.movetcare.com"
    ? "production"
    : typeof window !== "undefined" &&
      window.location.hostname === "stage.admin.movetcare.com"
    ? "staging"
    : typeof window !== "undefined" && window.location.hostname === "localhost"
    ? "development"
    : "unknown";

export default environment;
