import { AppLinks, Loader } from "ui";
import Layout from "components/Layout";
import Head from "next/head";
import { useEffect } from "react";
import { isAndroid } from "react-device-detect";

const GetTheApp = () => {
  useEffect(() => {
    window.location.href = isAndroid
      ? "https://app.movetcare.com" //"https://play.google.com/store/apps/details?id=com.movet&hl=en_US&gl=US"
      : "https://apps.apple.com/us/app/movet-on-demand-vet-services/id1478031556";
  }, []);
  return (
    <Layout>
      <Head>
        <title>MoVET App Download</title>
      </Head>
      <section className=" bg-white rounded-xl p-4 sm:p-8 italic flex flex-col flex-grow items-center justify-center text-center max-w-screen-md mx-4 sm:mx-auto px-4 sm:px-8 overflow-hidden sm:mt-8 sm:mb-24 text-2xl">
        <Loader
          message={`Taking you to the ${
            isAndroid ? "Google Play" : "App Store"
          } store...`}
        />
        <div className="flex justify-center mt-4">
          <AppLinks />
        </div>
      </section>
    </Layout>
  );
};

export default GetTheApp;
