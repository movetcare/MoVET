"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.environment = void 0;
exports.environment = typeof window !== "undefined" &&
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
//# sourceMappingURL=environment.js.map