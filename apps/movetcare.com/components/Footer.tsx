import {
  faArrowRight,
  faBell,
  faBullhorn,
  faExclamationCircle,
  faIcons,
  faInfoCircle,
  faStar,
  faTimes,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Transition } from '@headlessui/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';
// import { SignUp } from './signup';
import Image from 'next/image';

export const Footer = () => {
  const router = useRouter();
  const { displayAnnouncement } = router.query;
  const [showBanner, setShowBanner] = useState<boolean>(true);
  const [fadeIn, setShowFadeIn] = useState<boolean>(false);

  // const announcementBannerBackgroundColor =
  //   announcement?.color === '#DAAA00'
  //     ? 'bg-movet-yellow'
  //     : announcement?.color === '#2C3C72'
  //     ? 'bg-movet-dark-blue'
  //     : announcement?.color === '#E76159'
  //     ? 'bg-movet-red'
  //     : announcement?.color === '#232127'
  //     ? 'bg-movet-black'
  //     : announcement?.color === '#00A36C'
  //     ? 'bg-movet-green'
  //     : announcement?.color === '#A15643'
  //     ? 'bg-movet-brown'
  //     : 'bg-movet-dark-blue';

  // const announcementBannerTextColor =
  //   announcement?.color === '#DAAA00'
  //     ? 'text-movet-yellow'
  //     : announcement?.color === '#2C3C72'
  //     ? 'text-movet-dark-blue'
  //     : announcement?.color === '#E76159'
  //     ? 'text-movet-red'
  //     : announcement?.color === '#232127'
  //     ? 'text-movet-black'
  //     : announcement?.color === '#00A36C'
  //     ? 'text-movet-green'
  //     : announcement?.color === '#A15643'
  //     ? 'text-movet-brown'
  //     : 'text-movet-dark-blue';

  // const announcementBannerIcon =
  //   announcement?.icon === 'bullhorn'
  //     ? faBullhorn
  //     : announcement?.icon === 'exclamation-circle'
  //     ? faExclamationCircle
  //     : announcement?.icon === 'bell'
  //     ? faBell
  //     : announcement?.icon === 'star'
  //     ? faStar
  //     : announcement?.icon === 'info-circle'
  //     ? faInfoCircle
  //     : faIcons;
  useEffect(() => {
    if (displayAnnouncement === "false" || router.pathname === "/careers")
      setShowBanner(false);
    setTimeout(() => {
      setShowFadeIn(true);
    }, 1500);
  }, [displayAnnouncement, router]);

  // const AlertBannerContent = () => (
  //   <>
  //     {announcement?.link ? (
  //       <>
  //         <div className="w-0 flex-1 flex items-center hover:cursor-pointer pt-4 pb-6">
  //           <a
  //             href={`https://movetcare.com${announcement?.link}`}
  //             target="_blank"
  //             rel="noreferrer"
  //           >
  //             <span
  //               className={`flex p-2 rounded-xl justify-center items-center bg-movet-white text-lg h-9 w-9 hover:bg-opacity-80 ease-in-out duration-500 ${announcementBannerTextColor}`}
  //             >
  //               <FontAwesomeIcon icon={announcementBannerIcon} size="sm" />
  //             </span>
  //           </a>
  //           <div className="flex flex-col">
  //             <a
  //               href={`https://movetcare.com${announcement?.link}`}
  //               target="_blank"
  //               rel="noreferrer"
  //             >
  //               <p className="ml-8 font-medium text-white my-0 italic text-base hover:text-opacity-80">
  //                 {announcement?.title}
  //               </p>
  //             </a>
  //             <a
  //               href={`https://movetcare.com${announcement?.link}`}
  //               target="_blank"
  //               rel="noreferrer"
  //             >
  //               <p className="ml-8 font-medium text-white my-0 italic text-sm hover:text-opacity-80">
  //                 {announcement?.message}
  //               </p>
  //             </a>
  //           </div>
  //         </div>
  //         <div className="order-3 -mt-2 flex-shrink-0 w-full sm:order-2 sm:mt-0 sm:w-auto mb-4">
  //           <a
  //             href={`https://movetcare.com${announcement?.link}`}
  //             target="_blank"
  //             rel="noreferrer"
  //           >
  //             <p
  //               className={`w-full flex justify-center border border-transparent shadow-sm text-xs font-abside font-medium uppercase bg-movet-white group-hover:bg-opacity-80 hover:bg-opacity-80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-movet-dark-blue py-2 px-6 rounded-full ease-in-out duration-500 cursor-pointer ${announcementBannerTextColor}`}
  //             >
  //               Learn more
  //               <span
  //                 className={`ml-2 h-3.5 w-3.5 ${announcementBannerTextColor}`}
  //               >
  //                 <FontAwesomeIcon icon={faArrowRight} />
  //               </span>
  //             </p>
  //           </a>
  //         </div>
  //       </>
  //     ) : (
  //       <div
  //         className="w-0 flex-1 flex items-center hover:cursor-pointer py-4"
  //         onClick={() => setShowBanner(false)}
  //       >
  //         <span
  //           className={`flex p-2 rounded-xl justify-center items-center bg-movet-white text-lg h-9 w-9 hover:bg-opacity-80 ease-in-out duration-500 ${announcementBannerTextColor}`}
  //         >
  //           <FontAwesomeIcon icon={announcementBannerIcon} size="sm" />
  //         </span>
  //         <div className="flex flex-col">
  //           <p className="ml-8 font-medium text-white my-0 italic text-base hover:text-opacity-80">
  //             {announcement?.title}
  //           </p>
  //           <p className="ml-8 font-medium text-white my-0 italic text-sm hover:text-opacity-80">
  //             {announcement?.message}
  //           </p>
  //         </div>
  //       </div>
  //     )}
  //   </>
  // );

  return (
    <footer className="flex-col">
      <div className="hidden sm:flex flex-row bg-white">
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
              {/* <div className="w-"></div> */}
              <div className="w-64 grid grid-cols-3 gap-1 pb-2 mx-auto">
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
          {/* <menu className="text-center font-abside-smooth">
            <span className="uppercase text-lg">Quick Links</span>
            <li className="my-2 list-none">
              <a
                className="font-abside-smooth hover:text-movet-red"
                target="_blank"
                href={
                  isAndroid
                    ? 'https://play.google.com/store/apps/details?id=com.movet&hl=en_US&gl=US'
                    : 'https://apps.apple.com/us/app/movet-on-demand-vet-services/id1478031556'
                }
                rel="noopener noreferrer"
              >
                Get the App
              </a>
            </li>
            <li className="my-2 list-none hover:text-movet-red">
              <Link href="/services">Services</Link>
            </li>
          </menu>
          <menu className="text-center pt-4 md:pt-0 md:ml-8 font-abside-smooth">
            <span className="uppercase text-lg">Other</span>
            <li className="my-2 list-none hover:text-movet-red">
              <Link href="/relief-services">Relief Services</Link>
            </li>
            <li className="my-2 list-none hover:text-movet-red">
              <Link href="/join-the-team">Join the Team</Link>
            </li>
          </menu> */}
          {/* <SignUp /> */}
        </div>
      </div>
      <div className="flex flex-col justify-center items-center sm:hidden bg-movet-brown px-8">
        <div className="my-8 text-movet-white">{/* <SignUp /> */}</div>
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
        className={`flex justify-center items-center py-1 bg-movet-black text-white text-xs text-center tracking-widest${
          showBanner && fadeIn ? " mb-36 sm:mb-0" : " mb-16 sm:mb-0"
        }`}
      >
        <p className=" mx-1">© MoVET {new Date().getFullYear()}</p>
        <p className="mx-1">|</p>
        <Link href="/privacy-policy" passHref>
          <p className="ease-in-out duration-500 hover:underline cursor-pointer mx-1">
            Privacy Policy
          </p>
        </Link>
        <p className="mx-1">|</p>
        <Link href="/terms-and-conditions" passHref>
          <p className="ease-in-out duration-500 hover:underline cursor-pointer mx-1">
            Terms of Service
          </p>
        </Link>
        <p className="mx-1">|</p>
        <Link href="/appointment-prep" passHref>
          <p className="ease-in-out duration-500 hover:underline cursor-pointer mx-1">
            FAQs
          </p>
        </Link>
        <p className="mx-1">|</p>
        <Link href="/emergency" passHref>
          <p className="ease-in-out duration-500 hover:underline cursor-pointer mx-1">
            Emergency Care
          </p>
        </Link>
      </div>
      {/* <Transition
        show={
          showBanner &&
          fadeIn &&
          !loading &&
          announcement !== null &&
          announcement !== undefined &&
          announcement?.isActive
        }
        enter="transition ease-in duration-500"
        leave="transition ease-out duration-64"
        leaveTo="opacity-10"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leaveFrom="opacity-100"
      >
        <div className="sm:hidden fixed inset-x-0 bottom-0 z-50">
          <div className={`px-4 ${announcementBannerBackgroundColor}`}>
            <div className="max-w-7xl mx-auto">
              <div className="flex items-center justify-right flex-wrap">
                <AlertBannerContent /> 
                <div
                  className="order-2 flex-shrink-0 sm:order-3 sm:ml-4 hover:cursor-pointer sm:pl-4"
                  onClick={() =>
                    router.replace(
                      router.pathname + '?displayAnnouncement=false',
                      undefined,
                      { scroll: false, shallow: true }
                    )
                  }
                >
                  <span className="p-2 rounded-xl text-lg text-movet-white justify-center items-center hover:text-opacity-50 ease-in-out duration-500">
                    <FontAwesomeIcon icon={faTimes} />
                  </span>
                  <span className="sr-only">Dismiss</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Transition> */}
    </footer>
  );
};
