import Head from 'next/head';
import { auth } from 'services/firebase';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { onAuthStateChanged } from 'firebase/auth';
import { SignIn } from 'components/SignIn';

const Home = () => {
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      if (user) {
        const claimsString = (user as any)?.reloadUserInfo?.customAttributes;
        if (claimsString) {
          const claims = JSON.parse(claimsString);
          if (claims?.isSuperAdmin || claims?.isAdmin || claims?.isStaff)
            router.push('/dashboard');
        }
      }
    });
    return () => unsubscribe();
  });

  return (
    <section className="flex flex-col items-center justify-center min-py-2">
      <Head>
        <title>MoVET</title>
      </Head>
      <SignIn />
    </section>
  );
};

export default Home;
