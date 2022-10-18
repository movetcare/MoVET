import { Header } from "components/Header";
import { Footer } from "components/Footer";
import { AnnouncementBanner } from "ui";

const Layout = ({ children, announcement }: any) => {
  return (
    <>
      {announcement && (
        <AnnouncementBanner announcement={announcement} layout="top" />
      )}
      <Header />
      <main>{children}</main>
      <Footer />
      {announcement && (
        <AnnouncementBanner announcement={announcement} layout="bottom" />
      )}
    </>
  );
};

export default Layout;
