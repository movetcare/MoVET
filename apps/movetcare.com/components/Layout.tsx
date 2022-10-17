import Header from 'components/Header';
import Footer from 'components/Footer';
import { useRouter } from 'next/router';

const Layout = ({ children }: any) => {
  const router = useRouter();
  const isSecondaryPage =
    router.pathname.includes('terms') ||
    router.pathname.includes('privacy') ||
    router.pathname.includes('emergency') ||
    router.pathname.includes('prep') ||
    router.pathname.includes('blog') ||
    router.pathname.includes('careers');
  return (
    <>
      <Header />
      <div
        className={`pt-4 bg-movet-white z-50${isSecondaryPage ? ' sm:pb-28' : ''
          }`}
      >
        {children}
      </div>
      <Footer />
    </>
  );
};

export default Layout;
