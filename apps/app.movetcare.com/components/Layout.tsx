import { useRouter } from "next/router";
import { GoogleMapsProvider } from "providers/GoogleMapsProvider";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Layout = ({ children }: any) => {
  const router = useRouter();
  const { mode } = router.query || {};
  const isAppMode = mode === "app";
  return (
    <main
      className={`flex items-center justify-center${
        isAppMode
          ? " w-full bg-white py-4"
          : " bg-movet-white min-h-screen max-w-screen-md mx-auto px-4 sm:px-8 overflow-hidden"
      }`}
    >
      <GoogleReCaptchaProvider
        reCaptchaKey="6LfnisYaAAAAAGruEJpAsGlTLVkguzkx5WOOb0h1"
        scriptProps={{
          async: true,
          defer: true,
          appendTo: "body",
        }}
      >
        {router.pathname.includes(
          "/schedule-an-appointment/location-selection"
        ) ? (
          <GoogleMapsProvider
            googleMapsApiKey={"AIzaSyD-8-Mxe05Y1ySHD7XoDcumWt3vjA-URF0"}
            language="en"
            libraries={["places"]}
          >
            {children}
          </GoogleMapsProvider>
        ) : (
          children
        )}
      </GoogleReCaptchaProvider>
    </main>
  );
};

export default Layout;
