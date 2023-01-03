import Link from "next/link";
import Image from "next/image";
import { BookAnAppointmentForm } from "ui";

export const Footer = () => {
  return (
    <footer className="flex-col w-full">
      <div className="hidden sm:flex flex-row bg-movet-white">
        <div
          className="relative bottom-0 w-1/2 font-abside cursor-pointer"
          onClick={() =>
            window.open(
              "https://www.instagram.com/nessie_themovetpup/",
              "_blank"
            )
          }
        >
          <div className="absolute w-full bottom-0 h-fit ">
            <div className="flex items-center relative z-10 min-h-[10.25rem]">
              <div className="w-1/2 text-right px-4 py-6 text-movet-white hover:opacity-80 ease-in-out duration-500">
                <div className="mb-4">
                  Don&apos;t miss out on free givaways!
                </div>
                <div className="leading-5 mb-4">
                  FOLLOW NESSIE <br />
                  ON INSTAGRAM
                </div>
                <span className="ease-in-out duration-500 hover:underline">
                  @nessie_themovetpup
                </span>
              </div>
              <div className="w-64 grid grid-cols-3 gap-1 pb-2 mx-auto">
                <Image
                  height={256}
                  width={256}
                  className="hover:opacity-70 ease-in-out duration-500"
                  src="/images/pets/nessie-1.png"
                  alt="nessie"
                />
                <Image
                  height={256}
                  width={256}
                  className="hover:opacity-70 ease-in-out duration-500"
                  src="/images/pets/nessie-2.png"
                  alt="nessie"
                />
                <Image
                  height={256}
                  width={256}
                  className="hover:opacity-70 ease-in-out duration-500"
                  src="/images/pets/nessie-3.png"
                  alt="nessie"
                />
                <Image
                  height={256}
                  width={256}
                  className="hover:opacity-70 ease-in-out duration-500"
                  src="/images/pets/nessie-4.png"
                  alt="nessie"
                />
                <Image
                  height={256}
                  width={256}
                  className="hover:opacity-70 ease-in-out duration-500"
                  src="/images/pets/nessie-5.png"
                  alt="nessie"
                />
                <Image
                  height={256}
                  width={256}
                  className="hover:opacity-70 ease-in-out duration-500"
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
        <div className="w-5/12 ml-auto flex justify-evenly py-4">
          <div className="flex flex-col justify-center items-center mb-2">
            <p className="font-abside text-2xl text-movet-white sm:text-movet-black mb-2">
              Join MoVET Today
            </p>
            <BookAnAppointmentForm />
          </div>
        </div>
      </div>
      <div className="flex flex-col justify-center items-center sm:hidden bg-movet-brown px-8">
        <div className="flex flex-col justify-center items-center my-8">
          <p className="font-abside text-2xl text-movet-white sm:text-movet-black mb-2">
            Join MoVET Today
          </p>
          <BookAnAppointmentForm />
        </div>
        <div className="font-abside cursor-pointer">
          <div
            onClick={() =>
              window.open(
                "https://www.instagram.com/nessie_themovetpup/",
                "_blank"
              )
            }
          >
            <div className="text-center px-4 pb-6 text-movet-dark-brown">
              <div className="mb-4 text-xl text-movet-white">
                Don&apos;t miss out on free givaways!
              </div>
              <div className="leading-5 mb-4 text-movet-white">
                FOLLOW NESSIE <br />
                ON INSTAGRAM
              </div>
              <span className="ease-in-out duration-500 hover:underline text-movet-white">
                @nessie_themovetpup
              </span>
            </div>
            <div className="w-full grid grid-cols-3 gap-1 mx-auto mb-8">
              <Image
                height={82}
                width={82}
                className="hover:opacity-70 ease-in-out duration-500"
                src="/images/pets/nessie-1.png"
                alt="nessie"
              />
              <Image
                height={82}
                width={82}
                className="hover:opacity-70 ease-in-out duration-500"
                src="/images/pets/nessie-2.png"
                alt="nessie"
              />
              <Image
                height={82}
                width={82}
                className="hover:opacity-70 ease-in-out duration-500"
                src="/images/pets/nessie-3.png"
                alt="nessie"
              />
              <Image
                height={82}
                width={82}
                className="hover:opacity-70 ease-in-out duration-500"
                src="/images/pets/nessie-4.png"
                alt="nessie"
              />
              <Image
                height={82}
                width={82}
                className="hover:opacity-70 ease-in-out duration-500"
                src="/images/pets/nessie-5.png"
                alt="nessie"
              />
              <Image
                height={82}
                width={82}
                className="hover:opacity-70 ease-in-out duration-500"
                src="/images/pets/nessie-6.png"
                alt="nessie"
              />
            </div>
          </div>
        </div>
      </div>
      <div
        className={`flex justify-center items-center py-1 bg-movet-black text-white text-xs text-center tracking-widest`}
      >
        <p className=" mx-1">© MoVET {new Date().getFullYear()}</p>
        <p className="mx-1">|</p>
        <Link href="/privacy-policy" prefetch={false}>
          <p className="ease-in-out duration-500 hover:underline cursor-pointer mx-1">
            Privacy Policy
          </p>
        </Link>
        <p className="mx-1">|</p>
        <Link href="/terms-and-conditions" prefetch={false}>
          <p className="ease-in-out duration-500 hover:underline cursor-pointer mx-1">
            Terms of Service
          </p>
        </Link>
        <p className="mx-1">|</p>
        <Link href="/appointment-prep" prefetch={false}>
          <p className="ease-in-out duration-500 hover:underline cursor-pointer mx-1">
            FAQs
          </p>
        </Link>
        <p className="mx-1">|</p>
        <Link href="/emergency" prefetch={false}>
          <p className="ease-in-out duration-500 hover:underline cursor-pointer mx-1">
            Emergency Care
          </p>
        </Link>
      </div>
    </footer>
  );
};
