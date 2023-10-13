import { CallToAction, ClientReviews } from "ui";
import { faArrowRight, faPencil } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Layout from "components/Layout";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { getPopUpAd } from "server";
import { PopUpAd } from "ui";
import type { PopUpAd as PopUpAdType } from "types";

export async function getStaticProps() {
  return {
    props: {
      popUpAd: (await getPopUpAd()) || null,
    } as any,
  };
}

const Reviews = ({ popUpAd }: { popUpAd: PopUpAdType }) => {
  return (
    <Layout>
      <Head>
        <title>Client Reviews - MoVET</title>
      </Head>
      <section className="relative px-4 md:px-0">
        <div className="relative z-40">
          <div className="flex flex-col justify-center items-center max-w-screen-lg mx-auto">
            <h2 className="text-4xl mb-4 tracking-wide mt-8 text-center">
              Reviews
            </h2>
            <a
              className="relative z-10 mt-2"
              href="https://nextdoor.com/pages/movet-centennial-co/"
              target="_blank"
            >
              <div className="flex flex-col sm:flex-row mx-auto justify-center mt-4 mb-12 sm:mb-16 max-w-screen-lg">
                <div className="w-full py-4 sm:py-0 sm:mx-8 text-center flex flex-col">
                  <div className="mx-auto hover:animate-bounce duration-500">
                    <Image
                      src={"/images/icons/neighborhood_fave_2023.svg"}
                      alt={`Neighborhood Fave 2023 icon`}
                      width={100}
                      height={100}
                    />
                  </div>
                </div>
                <div className="w-full py-4 sm:py-0 sm:mx-8 text-center flex flex-col">
                  <div className="mx-auto hover:animate-bounce duration-500">
                    <Image
                      src={"/images/icons/neighborhood_fave_2022.svg"}
                      alt={`Neighborhood Fave 2022 icon`}
                      width={100}
                      height={100}
                    />
                  </div>
                </div>
                <div className="w-full py-4 sm:py-0 sm:mx-8 text-center flex flex-col">
                  <div className="mx-auto hover:animate-bounce duration-500">
                    <Image
                      src={"/images/icons/neighborhood_fave_2021.svg"}
                      alt={`Neighborhood Fave 2021 icon`}
                      width={100}
                      height={100}
                    />
                  </div>
                </div>
              </div>

              <h3 className="text-lg text-center font-extrabold tracking-tight text-movet-black max-w-lg -mt-8">
                Voted a Neighborhood Fave for Best Pet services in the Nextdoor
                App for the past three years!
              </h3>
            </a>
            <ClientReviews mode="full" />
            <a
              className="no-underline text-center ease-in-out duration-500 max-w-md sm:w-2/3 mx-auto mt-8 flex justify-center items-center border border-transparent shadow-sm text-movet-white text-sm font-medium font-abside uppercase bg-movet-black group-hover:bg-movet-white hover:bg-movet-red focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-movet-dark-brown py-2 px-6 rounded-full mb-16 sm:mb-0"
              target="_blank"
              href="https://www.google.com/maps/place/MoVET+@+Belleview+Station/@39.6250879,-104.9093559,17z/data=!4m8!3m7!1s0x876c87d97389a0f5:0x1fe38195747440bb!8m2!3d39.6250879!4d-104.906781!9m1!1b1!16s%2Fg%2F11rv8st06f?entry=ttu"
              rel="noopener noreferrer"
            >
              <FontAwesomeIcon icon={faArrowRight} size="lg" className="mr-2" />
              View All Reviews
            </a>
            <div className="flex justify-center items-stretch w-full pt-2 max-w-screen-2xl mx-auto mt-0 sm:mt-8">
              <div className="hidden md:flex grow">
                <div className="w-full max-w-[16rem] relative mt-24 mx-auto">
                  <div className="paw paw-l">
                    <div className="claw">
                      <div className="rotate-[54deg]">
                        <Image
                          src="/images/pets/puppy-2.jpg"
                          alt="dog"
                          height={100}
                          width={100}
                          className="rounded-full"
                        />
                      </div>
                    </div>
                    <div className="claw">
                      <div className="rotate-[15deg]">
                        <Image
                          src="/images/pets/puppy-1.jpg"
                          alt="dog"
                          height={100}
                          width={100}
                          className="rounded-full"
                        />
                      </div>
                    </div>
                    <div className="claw">
                      <div className="rotate-[-24deg]">
                        <Image
                          src="/images/pets/puppy-3.jpg"
                          alt="dog"
                          height={100}
                          width={100}
                          className="rounded-full"
                        />
                      </div>
                    </div>
                    <Image
                      src="/images/pets/holding-dog-home.png"
                      alt="dog"
                      height={200}
                      width={200}
                      className="rounded-full"
                    />
                  </div>
                </div>
              </div>
              <div className="text-center max-w-lg relative z-20 sm:mb-28 mt-0 sm:mt-6">
                <h5 className="text-3xl mb-4 tracking-wide font-bold whitespace-nowrap">
                  Leave Us a Review!
                </h5>
                <p className="text-lg">
                  Online reviews from great clients like you help others to feel
                  confident about choosing MoVET and will help our business
                  grow.
                </p>
                <a
                  className="text-center ease-in-out duration-500 w-full sm:w-2/3 mx-auto mt-8 flex justify-center items-center border border-transparent shadow-sm text-movet-white text-sm font-medium font-abside uppercase bg-movet-brown group-hover:bg-movet-dark-brown hover:bg-movet-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-movet-dark-brown py-2 px-6 rounded-full mb-16 sm:mb-0"
                  target="_blank"
                  href="https://g.page/r/CbtAdHSVgeMfEB0/review"
                  rel="noopener noreferrer"
                >
                  <FontAwesomeIcon icon={faPencil} size="lg" className="mr-2" />
                  Add a Review
                </a>
              </div>
              <div className="hidden md:block grow">
                <div className="w-full max-w-[16rem] relative mt-24 mx-auto">
                  <div className="paw paw-r">
                    <div className="claw">
                      <div className="rotate-[24deg]">
                        <Image
                          src="/images/pets/cat-1.jpg"
                          alt="dog"
                          height={100}
                          width={100}
                          className="rounded-full"
                        />
                      </div>
                    </div>
                    <div className="claw">
                      <div className="rotate-[-15deg]">
                        <Image
                          src="/images/pets/cat-2.png"
                          alt="dog"
                          height={100}
                          width={100}
                          className="rounded-full"
                        />
                      </div>
                    </div>
                    <div className="rotate-45 claw">
                      <div className="rotate-[-54deg]">
                        <Image
                          src="/images/pets/cat-3.png"
                          alt="dog"
                          height={100}
                          width={100}
                          className="rounded-full"
                        />
                      </div>
                    </div>
                    <Image
                      src="/images/pets/client-w-dog.jpg"
                      alt="dog"
                      height={200}
                      width={200}
                      className="rounded-full"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <CallToAction />
      {popUpAd?.isActive && (
        <PopUpAd
          autoOpen={popUpAd?.autoOpen}
          icon={popUpAd?.icon}
          title={popUpAd?.title}
          description={popUpAd?.description}
          adComponent={
            <Link href={popUpAd?.urlRedirect as string}>
              <Image
                className="rounded-xl"
                src={popUpAd?.imagePath as string}
                alt={popUpAd?.title}
                height={popUpAd?.height || 200}
                width={popUpAd?.width || 200}
              />
            </Link>
          }
          ignoreUrlPath={popUpAd?.ignoreUrlPath}
        />
      )}
    </Layout>
  );
};

export default Reviews;
