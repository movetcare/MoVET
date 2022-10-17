export const environment =
  typeof window !== "undefined" && window.location.hostname === "movetcare.com"
    ? "production"
    : typeof window !== "undefined" && window.location.hostname === "localhost"
    ? "development"
    : "staging";
