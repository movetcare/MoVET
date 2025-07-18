// IMPORTANT!!!
// ONLY USE THIS VARIABLE WITHIN A "useEffect" OR ELSE IT WILL CAUSE REACT HYDRATION ERRORS!

export const environment =
  typeof window !== "undefined" &&
  (window.location.hostname === "movetcare.com" ||
    window.location.hostname === "admin.movetcare.com" ||
    window.location.hostname === "app.movetcare.com")
    ? "production"
    : typeof window !== "undefined" &&
      (window.location.hostname === "stage.movetcare.com" ||
        window.location.hostname === "stage.admin.movetcare.com" ||
        window.location.hostname === "stage.app.movetcare.com")
    ? "staging"
    : typeof window !== "undefined" && window.location.hostname === "localhost"
    ? "development"
    : "unknown";
