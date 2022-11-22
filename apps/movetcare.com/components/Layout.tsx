/* eslint-disable @typescript-eslint/no-explicit-any */
import dynamic from "next/dynamic";
import { Header } from "components/Header";
import { Footer } from "components/Footer";
import { useRouter } from "next/router";

let Announcement: any = null;
const Layout = ({ children, announcement }: any) => {
  if (announcement?.isActive) {
    Announcement = dynamic(() => import("ui").then((mod) => mod.Announcement));
  }
  const router = useRouter();
  const { mode } = router.query || {};
  const isAppMode = mode === "app";
  return (
    <div className="flex flex-col items-center justify-center bg-movet-white min-h-screen">
      {Announcement && (
        <Announcement announcement={announcement} layout="top" />
      )}
      {!isAppMode && <Header />}
      <main
        className={`w-full flex-1 overflow-x-hidden${
          isAppMode ? " bg-white" : " bg-movet-white"
        }`}
      >
        {children}
      </main>
      {!isAppMode && <Footer />}
      {Announcement && (
        <Announcement announcement={announcement} layout="bottom" />
      )}
    </div>
  );
};

export default Layout;
