import { CallToAction, ClientReviews } from "ui";
import Image from "next/image";
import { faPencil } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Layout from "components/Layout";
import Head from "next/head";

const Reviews = () => {
  return (
    <Layout>
      <Head>
        <title>Client Reviews</title>
      </Head>
      <section className="relative px-4 md:px-0">
        <div className="relative z-40">
          <div className="flex flex-col justify-center items-center max-w-screen-lg mx-auto">
            <h2 className="text-4xl mb-4 tracking-wide mt-8 text-center">
              Our Happy Clients
            </h2>
            <ClientReviews mode="full" />
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
    </Layout>
  );
};

export default Reviews;
