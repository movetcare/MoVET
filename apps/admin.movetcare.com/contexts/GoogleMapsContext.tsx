import { createContext } from "react";
import type { GoogleMapsState } from "types";
export const GoogleMapsContext = createContext<GoogleMapsState>({
  isLoaded: false,
});
