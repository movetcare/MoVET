import Header from "components/Header";
import Footer from "components/Footer";

const Layout = ({ children }: any) => {
  return (
    <>
      <Header />
      <main className={`bg-movet-white z-50`}>{children}</main>
      <Footer />
    </>
  );
};

export default Layout;
