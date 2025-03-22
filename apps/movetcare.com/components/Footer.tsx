import Link from "next/link";
import Image from "next/image";
import { AppLinks } from "ui";

export const Footer = () => {
  return (
    <footer className="flex-col w-full">
      <div className="hidden flex-row sm:flex bg-movet-white">
        <div
          className="relative bottom-0 w-1/2 cursor-pointer font-abside"
          onClick={() =>
            window.open(
              "https://www.instagram.com/nessie_themovetpup/",
              "_blank",
            )
          }
        >
          <div className="absolute bottom-0 w-full h-fit">
            <div className="flex items-center relative z-10 min-h-[10.25rem]">
              <div className="px-4 py-6 w-1/2 text-right duration-500 ease-in-out text-movet-white hover:opacity-80">
                <div className="mb-4">
                  Don&apos;t miss out on free givaways!
                </div>
                <div className="mb-4 leading-5">
                  FOLLOW NESSIE <br />
                  ON INSTAGRAM
                </div>
                <span className="duration-500 ease-in-out hover:underline">
                  @nessie_themovetpup
                </span>
              </div>
              <div className="grid grid-cols-3 gap-1 pb-2 mx-auto w-64">
                <Image
                  height={256}
                  width={256}
                  className="duration-500 ease-in-out hover:opacity-70"
                  src="/images/pets/nessie-1.png"
                  alt="nessie"
                />
                <Image
                  height={256}
                  width={256}
                  className="duration-500 ease-in-out hover:opacity-70"
                  src="/images/pets/nessie-2.png"
                  alt="nessie"
                />
                <Image
                  height={256}
                  width={256}
                  className="duration-500 ease-in-out hover:opacity-70"
                  src="/images/pets/nessie-3.png"
                  alt="nessie"
                />
                <Image
                  height={256}
                  width={256}
                  className="duration-500 ease-in-out hover:opacity-70"
                  src="/images/pets/nessie-4.png"
                  alt="nessie"
                />
                <Image
                  height={256}
                  width={256}
                  className="duration-500 ease-in-out hover:opacity-70"
                  src="/images/pets/nessie-5.png"
                  alt="nessie"
                />
                <Image
                  height={256}
                  width={256}
                  className="duration-500 ease-in-out hover:opacity-70"
                  src="/images/pets/nessie-6.png"
                  alt="nessie"
                />
              </div>
              <div className="absolute bottom-0 h-[120%] w-[115%] -z-10">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 157 50"
                  preserveAspectRatio="none"
                  className="w-full h-full fill-movet-brown"
                >
                  <path d="M0 8c38.5-8.2 104-8 126.2-6 19 0 25.6 20 31 48.3L0 50.41z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-evenly py-4 ml-auto w-5/12">
          <div className="flex flex-col justify-center items-center mb-2">
            <p className="mb-4 text-xl text-center font-abside text-movet-white sm:text-movet-black">
              Ready to Schedule an Appointment?
            </p>
            <div className="flex">
              <AppLinks />
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col justify-center items-center px-8 sm:hidden bg-movet-brown">
        <div className="flex flex-col justify-center items-center my-8">
          <p className="mb-4 text-xl text-center font-abside text-movet-white sm:text-movet-black">
            Ready to Schedule an Appointment?
          </p>
          <div className="flex">
            <AppLinks />
          </div>
        </div>
        <div className="cursor-pointer font-abside">
          <div
            onClick={() =>
              window.open(
                "https://www.instagram.com/nessie_themovetpup/",
                "_blank",
              )
            }
          >
            <div className="px-4 pb-6 text-center text-movet-dark-brown">
              <div className="mb-4 text-xl text-movet-white">
                Don&apos;t miss out on free givaways!
              </div>
              <div className="mb-4 leading-5 text-movet-white">
                FOLLOW NESSIE <br />
                ON INSTAGRAM
              </div>
              <span className="duration-500 ease-in-out hover:underline text-movet-white">
                @nessie_themovetpup
              </span>
            </div>
            <div className="grid grid-cols-3 gap-1 mx-auto mb-8 w-full">
              <Image
                height={82}
                width={82}
                className="duration-500 ease-in-out hover:opacity-70"
                src="/images/pets/nessie-1.png"
                alt="nessie"
              />
              <Image
                height={82}
                width={82}
                className="duration-500 ease-in-out hover:opacity-70"
                src="/images/pets/nessie-2.png"
                alt="nessie"
              />
              <Image
                height={82}
                width={82}
                className="duration-500 ease-in-out hover:opacity-70"
                src="/images/pets/nessie-3.png"
                alt="nessie"
              />
              <Image
                height={82}
                width={82}
                className="duration-500 ease-in-out hover:opacity-70"
                src="/images/pets/nessie-4.png"
                alt="nessie"
              />
              <Image
                height={82}
                width={82}
                className="duration-500 ease-in-out hover:opacity-70"
                src="/images/pets/nessie-5.png"
                alt="nessie"
              />
              <Image
                height={82}
                width={82}
                className="duration-500 ease-in-out hover:opacity-70"
                src="/images/pets/nessie-6.png"
                alt="nessie"
              />
            </div>
          </div>
        </div>
      </div>
      <div
        className={`flex justify-center items-center py-1 text-xs tracking-widest text-center text-white bg-movet-black`}
      >
        <p className="mx-1">© MoVET {new Date().getFullYear()}</p>
        <p className="mx-1">|</p>
        <Link href="/privacy-policy" prefetch={false}>
          <p className="mx-1 duration-500 ease-in-out cursor-pointer hover:underline">
            Privacy Policy
          </p>
        </Link>
        <p className="mx-1">|</p>
        <Link href="/terms-and-conditions" prefetch={false}>
          <p className="mx-1 duration-500 ease-in-out cursor-pointer hover:underline">
            Terms of Service
          </p>
        </Link>
        <p className="mx-1">|</p>
        <Link href="/appointment-prep" prefetch={false}>
          <p className="mx-1 duration-500 ease-in-out cursor-pointer hover:underline">
            FAQs
          </p>
        </Link>
        <p className="mx-1">|</p>
        <Link href="/emergency" prefetch={false}>
          <p className="mx-1 duration-500 ease-in-out cursor-pointer hover:underline">
            Emergency Care
          </p>
        </Link>
      </div>
    </footer>
  );
};
