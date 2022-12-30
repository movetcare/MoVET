import { FC, useContext } from "react";
import { useJsApiLoader } from "@react-google-maps/api";
import { GoogleMapsContext } from "contexts/GoogleMapsContext";

export const GoogleMapsProvider: FC<any> = ({
  children,
  ...loadScriptOptions
}: any) => {
  const { isLoaded, loadError } = useJsApiLoader(loadScriptOptions);

  return (
    <GoogleMapsContext.Provider value={{ isLoaded, loadError }}>
      {children}
    </GoogleMapsContext.Provider>
  );
};

export const useGoogleMaps = () => useContext(GoogleMapsContext);
