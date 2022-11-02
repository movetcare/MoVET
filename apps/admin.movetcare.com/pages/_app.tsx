import '../tailwind.css';
import "@fortawesome/fontawesome-svg-core/styles.css";
import type { AppProps } from 'next/app';
import { UserContext } from 'contexts/UserContext';
import { useUserData } from 'hooks/AuthUser';
import { Toaster } from 'react-hot-toast';
import Layout from 'components/Layout';

const MoVET = ({ Component, pageProps }: AppProps) => {
  const userData: any = useUserData();
  return (
    <UserContext.Provider value={userData}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
      <Toaster position="top-right" reverseOrder={false} />
    </UserContext.Provider>
  );
};

export default MoVET;
