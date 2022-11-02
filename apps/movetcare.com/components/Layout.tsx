/* eslint-disable @typescript-eslint/no-explicit-any */
import dynamic from "next/dynamic";
import { Header } from "components/Header";
import { Footer } from "components/Footer";

let Announcement: any = null;
const Layout = ({ children, announcement }: any) => {
  if (announcement?.isActive) {
    Announcement = dynamic(() => import("ui").then((mod) => mod.Announcement));
  }
  return (
    <div className="flex flex-col items-center justify-center bg-movet-white min-h-screen">
      {Announcement && (
        <Announcement announcement={announcement} layout="top" />
      )}
      <Header />
      <main className="w-full flex-1 overflow-x-hidden">{children}</main>
      <Footer />
      {Announcement && (
        <Announcement announcement={announcement} layout="bottom" />
      )}
    </div>
  );
};

export default Layout;
