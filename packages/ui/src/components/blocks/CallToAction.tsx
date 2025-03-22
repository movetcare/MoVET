import Image from "next/image";
import { useRouter } from "next/router";
import { faCalendarPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const CallToAction = () => {
  const router = useRouter();
  return router?.query?.mode !== "app" ? (
    <section className="relative bg-center bg-cover w-full bg-movet-black py-16 bg-[url('/images/backgrounds/pets-background.png')]">
      <div className="overflow-hidden absolute -top-1 w-full h-28">
        <svg
          viewBox="0 0 500 150"
          preserveAspectRatio="none"
          className="w-full h-full"
        >
          <path
            d="M0,52 C130,119 385,-105 501.41,83 L500.00,0.00 L0.00,0.00 Z"
            className="fill-movet-white"
          ></path>
        </svg>
      </div>
      <div className="flex flex-col items-center">
        <div className="flex relative flex-col justify-center items-center mt-4 mb-8 w-full sm:flex-row sm:max-w-screen-lg lg:px-6">
          <div className="h-full md:w-1/2">
            <div className="px-4 mx-auto max-w-xs sm:max-w-sm">
              <Image
                src="/images/pets/home-appointment-1.png"
                alt="dog"
                className="rounded-full"
                width={360}
                height={360}
              />
            </div>
          </div>
          <div className="relative z-10 mt-8 -mb-16 w-80 text-center md:w-1/2 sm:mt-0 md:mb-0">
            <h3 className="first-letter:tracking-wide text-2xl sm:text-3xl whitespace-nowrap mb-1.5 text-movet-white">
              Your neighborhood vet,
            </h3>
            <h3 className="text-4xl sm:text-5xl text-movet-red">Delivered</h3>
            <p className="my-4 text-base leading-6 sm:text-lg font-abside text-movet-white">
              A stress-free way to take care
              <br /> of your vet appointments.
            </p>
            <div className="flex flex-col justify-center items-center">
              <a
                className="flex justify-center items-center px-6 py-2 text-base font-medium uppercase rounded-full border border-transparent shadow-sm duration-500 ease-in-out text-movet-white font-abside bg-movet-red group-hover:bg-movet-black hover:bg-movet-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-movet-red hover:text-decoration-none"
                target="_blank"
                href={`https://petportal.vet/movet/`}
                rel="noopener noreferrer"
                id="mobile-request-appointment-cta"
              >
                <FontAwesomeIcon
                  icon={faCalendarPlus}
                  size="lg"
                  className="mr-2"
                />
                SCHEDULE AN APPOINTMENT
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  ) : (
    <></>
  );
};
