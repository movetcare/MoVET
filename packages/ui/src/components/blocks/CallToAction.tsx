import Image from "next/image";
import { useRouter } from "next/router";
import { AppLinks } from "../elements";
import { BookAnAppointmentForm } from "../forms";

export const CallToAction = () => {
  const router = useRouter();
  return router?.query?.mode !== "app" ? (
    <section className="relative bg-center bg-cover w-full bg-movet-black py-16 bg-[url('/images/backgrounds/pets-background.png')]">
      <div className="h-28 -top-1 overflow-hidden absolute w-full">
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
        <div className="flex flex-col sm:flex-row justify-center items-center relative mt-4 mb-8  w-full sm:max-w-screen-lg lg:px-6">
          <div className="md:w-1/2 h-full">
            <div className="px-4 max-w-xs sm:max-w-sm mx-auto">
              <Image
                src="/images/pets/home-appointment-1.png"
                alt="dog"
                className="rounded-full"
                width={360}
                height={360}
              />
            </div>
          </div>
          <div className="w-80 relative z-10 md:w-1/2 text-center mt-8 sm:mt-0 -mb-16 md:mb-0">
            <h3 className="first-letter:tracking-wide text-2xl sm:text-3xl whitespace-nowrap mb-1.5 text-movet-white">
              Your neighborhood vet,
            </h3>
            <h3 className="text-4xl sm:text-5xl text-movet-red">Delivered</h3>
            <p className="text-base sm:text-lg font-abside leading-6 my-4 text-movet-white">
              A stress-free way to take care
              <br /> of your vet appointments.
            </p>

            <div className="flex flex-col justify-center items-center">
              <p className="mb-3 font-abside text-sm text-movet-white">
                SCHEDULE AN APPOINTMENT
              </p>
              <BookAnAppointmentForm />
              {/* <div className="flex justify-center">
                  <p className="text-sm font-abside my-3 text-movet-white">
                    OR
                  </p>
                </div> */}
              <div className="flex justify-center">
                <AppLinks />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  ) : (
    <></>
  );
};
