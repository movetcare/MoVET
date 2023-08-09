import { ClientReviews } from "../elements/ClientReviews";
import Image from "next/image";

export const Reviews = () => (
  <section className="relative bg-movet-black py-12 px-4 sm:px-8 md:px-0 w-full">
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
          <h2 className="text-3xl sm:text-4xl text-center font-extrabold tracking-tight text-movet-white sm:mb-10">
            Our Happy Clients
          </h2>
          <a
            className="z-10"
            href="https://nextdoor.com/pages/movet-centennial-co/"
            target="_blank"
          >
            <div className="flex flex-col sm:flex-row mx-auto justify-center mt-4 mb-12 sm:mb-16 max-w-screen-lg">
              <div className="w-full py-4 sm:py-0 sm:mx-8 text-center flex flex-col">
                <div className="mx-auto hover:animate-bounce duration-500">
                  <Image
                    src={"/images/icons/neighborhood_fave_2023.svg"}
                    alt={`Neighborhood Fave 2023 icon`}
                    width={90}
                    height={90}
                  />
                </div>
              </div>
              <div className="w-full py-4 sm:py-0 sm:mx-8 text-center flex flex-col">
                <div className="mx-auto hover:animate-bounce duration-500">
                  <Image
                    src={"/images/icons/neighborhood_fave_2022.svg"}
                    alt={`Neighborhood Fave 2022 icon`}
                    width={90}
                    height={90}
                  />
                </div>
              </div>
              <div className="w-full py-4 sm:py-0 sm:mx-8 text-center flex flex-col">
                <div className="mx-auto hover:animate-bounce duration-500">
                  <Image
                    src={"/images/icons/neighborhood_fave_2021.svg"}
                    alt={`Neighborhood Fave 2021 icon`}
                    width={90}
                    height={90}
                  />
                </div>
              </div>
            </div>
            <p className="text-lg sm:text-xl text-center font-extrabold tracking-tight text-movet-white max-w-lg -mt-10 italic mb-16">
              Voted a Neighborhood Fave for Best Pet services in the Nextdoor
              App for the past three years!
            </p>
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
      <div className="flex flex-col justify-center items-center max-w-7xl mx-auto sm:p-4 -mt-16">
        <ClientReviews />
      </div>
    </div>
    <div className="curve z-10 h-12 before:w-[75%] before:h-28 before:bg-movet-black before:translate-x-[65%] before:translate-y-[-47%] before:rounded-[100%_100%_100%_100%_/_100%_0%_110%_62%] after:w-[78%] after:bg-movet-white after:translate-x-[-16%] after:translate-y-[54%]"></div>
  </section>
);
