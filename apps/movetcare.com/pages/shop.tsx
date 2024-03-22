import Layout from "components/Layout";
import Head from "next/head";
import Image from "next/image";

const Shop = () => {
  return (
    <Layout>
      <Head>
        <title>MoVET Shop</title>
      </Head>
      <h2 className="text-4xl mb-4 tracking-wide mt-8 text-center">
        Our Trusted Brands
      </h2>
      <section className="bg-white rounded-xl p-4 sm:p-8 italic flex flex-col flex-grow items-center justify-center text-center max-w-screen-md mx-4 sm:mx-auto px-4 sm:px-8 overflow-hidden sm:mt-8 sm:mb-24 text-2xl">
        <div className="grid sm:grid-col-1 md:grid-cols-2 lg:grid-cols-4 gap-6 justify-center items-center">
          <a
            href="https://www.adaptil.com/us/Products/ADAPTIL-comforting-messages"
            target="_blank"
          >
            <Image
              src="/images/company-logos/shop/adaptil-logo.png"
              alt="Adaptil Logo"
              height={60}
              width={250}
              priority
            />
          </a>
          <a href="https://www.douxo.com/us" target="_blank">
            <Image
              src="/images/company-logos/shop/douxo-logo.png"
              alt="Douxo Logo"
              height={60}
              width={250}
              priority
            />
          </a>
          <a
            href="https://www.elanco.com/en-us/about-us/about-elanco"
            target="_blank"
          >
            <Image
              src="/images/company-logos/shop/elanco-logo.png"
              alt="Elanco Logo"
              height={60}
              width={250}
              priority
            />
          </a>
          <a
            href="https://us.feliway.com/pages/signs-of-unhappy-cats"
            target="_blank"
          >
            <Image
              src="/images/company-logos/shop/feliway-logo.png"
              alt="Feliway Logo"
              height={60}
              width={250}
              priority
            />
          </a>
          <a href="https://franklypet.com/" target="_blank">
            <Image
              src="/images/company-logos/shop/frankly-logo.png"
              alt="Frankly Logo"
              height={60}
              width={250}
              priority
            />
          </a>

          <a href="https://www.goughnuts.com/guarantee" target="_blank">
            <Image
              src="/images/company-logos/shop/goughnuts-logo.png"
              alt="Goughnuts Logo"
              height={60}
              width={250}
              priority
            />
          </a>
          <a href="https://hugglehounds.com/pages/about" target="_blank">
            <Image
              src="/images/company-logos/shop/hugglehounds-logo.png"
              alt="Hugglehounds Logo"
              height={60}
              width={250}
              priority
            />
          </a>
          <a href="https://www.kongcompany.com/company/" target="_blank">
            <Image
              src="/images/company-logos/shop/kong-logo.png"
              alt="Kong Logo"
              height={60}
              width={250}
              priority
            />
          </a>
          <a href="https://www.petsafe.com/about-us/" target="_blank">
            <Image
              src="/images/company-logos/shop/petsafe-logo.png"
              alt="PetSafe Logo"
              height={60}
              width={250}
              priority
            />
          </a>
          <a
            href="https://petsmileusa.com/pages/about-us-best-toothpaste-pets"
            target="_blank"
          >
            <Image
              src="/images/company-logos/shop/petsmile-toothpaste-logo.png"
              alt="Petsmile Logo"
              height={60}
              width={250}
              priority
            />
          </a>
          <a
            href="https://saintroccostreats.shop/pages/about-us"
            target="_blank"
          >
            <Image
              src="/images/company-logos/shop/saint-roccos-treats-logo.png"
              alt="Saint Roccos Treats Logo"
              height={60}
              width={250}
              priority
            />
          </a>
          <a
            href="https://www.standardprocess.com/brands/veterinary-supplements"
            target="_blank"
          >
            <Image
              src="/images/company-logos/shop/standard-process-logo.png"
              alt=" Logo"
              height={60}
              width={250}
              priority
            />
          </a>
          <a href="https://www.vetriscience.com/about-us" target="_blank">
            <Image
              src="/images/company-logos/shop/vetriscience-logo.png"
              alt="Vetriscience Logo"
              height={60}
              width={250}
              priority
            />
          </a>
        </div>
      </section>
    </Layout>
  );
};

export default Shop;
