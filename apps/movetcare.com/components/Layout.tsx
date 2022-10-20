import dynamic from "next/dynamic";
import { Header } from "components/Header";
import { Footer } from "components/Footer";
import Head from "next/head";
let AnnouncementBanner: any = null;
const Layout = ({ children, announcement }: any) => {
  if (announcement?.isActive) {
    AnnouncementBanner = dynamic(() =>
      import("ui").then((mod) => mod.AnnouncementBanner)
    );
  }
  return (
    <div className="flex flex-col items-center justify-center bg-movet-white min-h-screen">
      <Head>
        <title>MoVET - Your neighborhood vet, delivered</title>
      </Head>
      {AnnouncementBanner && (
        <AnnouncementBanner announcement={announcement} layout="top" />
      )}
      <Header />
      <main className="w-full flex-1 overflow-x-hidden">{children}</main>
      <Footer />
      {AnnouncementBanner && (
        <AnnouncementBanner announcement={announcement} layout="bottom" />
      )}
    </div>
  );
};

export default Layout;
