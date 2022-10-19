import { Header } from "components/Header";
import { Footer } from "components/Footer";
import { AnnouncementBanner } from "ui";

const Layout = ({ children, announcement }: any) => {
  return (
    <div className="flex flex-col items-center justify-center">
      {announcement && (
        <AnnouncementBanner announcement={announcement} layout="top" />
      )}
      <Header />
      <main className="w-full flex-1 overflow-x-hidden">{children}</main>
      <Footer />
      {announcement && (
        <AnnouncementBanner announcement={announcement} layout="bottom" />
      )}
    </div>
  );
};

export default Layout;
