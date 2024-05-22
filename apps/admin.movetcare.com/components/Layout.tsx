import Header from "components/Header";
import Footer from "components/Footer";
import AuthCheck from "components/AuthCheck";
import { GoogleMapsProvider } from "providers/GoogleMapsProvider";
import { useRouter } from "next/router";
import { useAnnouncementBanner } from "hooks/useAnnouncementBanner";
import { AnnouncementBannerContext } from "contexts/AnnouncementBannerContext";

const Layout = ({ children }: any) => {
  const router = useRouter();
  const isAuthPage =
    router.pathname === "/" ||
    router.pathname === "/signout" ||
    router.pathname.includes("/test/login") ||
    router.query.mode === "embed";
  const announcementBanner = useAnnouncementBanner({ mode: "web" });
  return router.pathname.includes("/test/login") ? (
    <main
      className={
        "h-screen flex flex-grow items-center justify-center p-8 md:px-12 lg:px-24 bg-movet-white"
      }
    >
      {children}
    </main>
  ) : (
    <AuthCheck>
      <AnnouncementBannerContext.Provider value={announcementBanner as any}>
        {!isAuthPage && <Header />}
        <main
          className={
            isAuthPage
              ? router.query.mode === "embed"
                ? "h-screen flex-grow items-center justify-center p-8 w-full"
                : "h-screen flex flex-grow items-center justify-center p-8 md:px-12 lg:px-24 bg-movet-white"
              : router.pathname === "/telehealth/chat"
                ? "p-4 sm:p-8 bg-movet-white"
                : "p-4 sm:p-8 bg-movet-white"
          }
        >
          <GoogleMapsProvider
            googleMapsApiKey={"AIzaSyD-8-Mxe05Y1ySHD7XoDcumWt3vjA-URF0"}
            language="en"
            libraries={["places"]}
          >
            {children}
          </GoogleMapsProvider>
        </main>
        {!isAuthPage && <Footer />}
      </AnnouncementBannerContext.Provider>
    </AuthCheck>
  );
};

export default Layout;
