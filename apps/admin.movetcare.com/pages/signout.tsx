import Loader from 'components/Loader';
import { signOut } from 'firebase/auth';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { auth } from 'services/firebase';

export default function SignOut() {
  const router = useRouter();

  useEffect(() => {
    signOut(auth).finally(() => router.push('/'));
  });

  return (
    <section className="flex flex-col items-center justify-center">
      <Head>
        <title>Sign Out</title>
      </Head>
      <div className="bg-white rounded-lg">
        <Loader />
        <h1 className="text-xl font-bold mb-8 -mt-4 italic">Signing Out...</h1>
      </div>
    </section>
  );
}
