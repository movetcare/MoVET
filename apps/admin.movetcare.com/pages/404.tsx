import Loader from 'components/Loader';
import Head from 'next/head';
import { useEffect } from 'react';
import environment from 'utils/environment';

export default function Custom404() {
  useEffect(() => {
    setTimeout(
      () =>
        (window.location.href =
          (environment === 'development' ? 'http://' : 'https://') +
          `${window.location.host}`),
      3000
    );
  }, []);
  return (
    <div className="bg-transparent flex flex-col items-center justify-center min-py-2">
      <Head>
        <title>404 - Not Found</title>
      </Head>
      <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center md:min-h-screen">
        <div className="mb-16 text-movet-white">
          <Loader />
          <h1 className="text-5xl font-bold font-abside text-movet-black">
            404 Not Found
          </h1>
          <h2 className="text-3xl italic mt-4 text-movet-black">
            Taking you home now...
          </h2>
        </div>
      </main>
    </div>
  );
}
