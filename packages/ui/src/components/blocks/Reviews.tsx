import { faPencil } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ClientReviews } from "../elements/ClientReviews";
import Image from "next/image";

export const Reviews = () => (
  <section className="relative bg-movet-black py-12 px-8 md:px-0 w-full">
    <div className="relative z-40">
      <div className="flex justify-center items-stretch w-full pt-2 max-w-screen-2xl mx-auto">
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
        <div className="text-center text-white max-w-lg relative z-20">
          <h5 className="text-4xl mb-4 tracking-wide mt-10 font-bold whitespace-nowrap">
            Our Happy Clients
          </h5>
          <p className="text-lg">
            Online reviews from great clients like you help others to feel
            confident about choosing MoVET and will help our business grow.
          </p>
          {/* <a
            href="https://g.page/r/CbtAdHSVgeMfEB0/review"
            target="_blank"
            rel="noreferrer"
            className="text-movet-white"
          >
            <h6 className="text-xl tracking-wide mt-8 font-bold whitespace-nowrap">
              Leave Us a Review!
            </h6>
            <QRCodeSVG
              size={100}
              value={"https://g.page/r/CbtAdHSVgeMfEB0/review"}
              className="mx-auto mt-4 mb-8 sm:mb-0"
            />
          </a> */}
          <a
            className="text-center ease-in-out duration-500 w-full sm:w-2/3 mx-auto mt-8 flex justify-center items-center border border-transparent shadow-sm text-movet-white text-sm font-medium font-abside uppercase bg-movet-brown group-hover:bg-movet-dark-brown hover:bg-movet-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-movet-dark-brown py-2 px-6 rounded-full"
            target="_blank"
            href="https://g.page/r/CbtAdHSVgeMfEB0/review"
            rel="noopener noreferrer"
          >
            <FontAwesomeIcon icon={faPencil} size="lg" className="mr-2" />
            Add a Review
          </a>
          {/* <div className="flex flex-col md:flex-row justify-around items-center m-0 gap-x-2 md:gap-x-4">
            <a
              href="https://g.page/r/CbtAdHSVgeMfEAg/review"
              target="_blank"
              className="opacity-80 hover:opacity-100"
              rel="noreferrer"
            >
              <Image
                src="/images/company-logos/google-logo-white.png"
                alt="Google"
                height={56}
                width={100}
              />
            </a>
            <a
              href="https://www.facebook.com/MOVETCARE"
              target="_blank"
              className="opacity-80 hover:opacity-100"
              rel="noreferrer"
            >
              <Image
                src="/images/company-logos/FindUs-FB-RGB-Wht.svg"
                alt="Facebook"
                height={90}
                width={180}
              />
            </a>
            <a
              href="https://nextdoor.com/pages/movet-centennial-co/recommend/"
              target="_blank"
              className="opacity-80 hover:opacity-100"
              rel="noreferrer"
            >
              <Image
                src="/images/company-logos/NextdoorLogo_White.png"
                alt="Nextdoor"
                height={70}
                width={160}
              />
            </a>
            <a
              href="https://www.yelp.com/biz/movet-denver"
              target="_blank"
              className="opacity-80 hover:opacity-100"
              rel="noreferrer"
            >
              <Image
                src="/images/company-logos/yelp_logo_dark_bg.svg"
                alt="Yelp"
                className="h-12 md:h-10 md:-ml-4"
                height={40}
                width={120}
              />
            </a>
          </div> */}
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
      <div className="flex flex-col justify-center items-center max-w-7xl mx-auto sm:p-4">
        <h5 className="text-3xl tracking-wide font-bold whitespace-nowrap text-movet-white italic md:mb-4 mt-10 sm:mt-8">
          Testimonials
        </h5>
        <ClientReviews />
      </div>
    </div>
    <div className="curve z-10 h-12 before:w-[75%] before:h-28 before:bg-movet-black before:translate-x-[65%] before:translate-y-[-47%] before:rounded-[100%_100%_100%_100%_/_100%_0%_110%_62%] after:w-[78%] after:bg-movet-white after:translate-x-[-16%] after:translate-y-[54%]"></div>
  </section>
);
