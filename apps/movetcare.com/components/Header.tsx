import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Transition } from "@headlessui/react";
import { Button } from "ui";
import kebabCase from "lodash.kebabcase";
import { isAndroid } from "react-device-detect";
import {
  faArrowRight,
  faBell,
  faBullhorn,
  faCalendarPlus,
  faExclamationCircle,
  faIcons,
  faInfoCircle,
  faSms,
  faStar,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
// import { AnnouncementBannerContext } from "contexts/AnnouncementBannerContext";

interface NavigationItem {
  text: string;
  link: string;
}

export const Header: React.FC = () => {
  // const { announcement, loading }: any = useContext(AnnouncementBannerContext);
  const router = useRouter();
  const { displayAnnouncement } = router.query;
  const [showBanner, setShowBanner] = useState<boolean>(true);
  const [fadeIn, setShowFadeIn] = useState<boolean>(false);
  const [mobileMenu, toggleMobileMenu] = useState(true);
  const pathName = useRouter().pathname.split("/")[1];

  // const announcementBannerBackgroundColor =
  //   announcement?.color === "#DAAA00"
  //     ? "bg-movet-yellow"
  //     : announcement?.color === "#2C3C72"
  //     ? "bg-movet-dark-blue"
  //     : announcement?.color === "#E76159"
  //     ? "bg-movet-red"
  //     : announcement?.color === "#232127"
  //     ? "bg-movet-black"
  //     : announcement?.color === "#00A36C"
  //     ? "bg-movet-green"
  //     : announcement?.color === "#A15643"
  //     ? "bg-movet-brown"
  //     : "bg-movet-dark-blue";

  // const announcementBannerTextColor =
  //   announcement?.color === "#DAAA00"
  //     ? "text-movet-yellow"
  //     : announcement?.color === "#2C3C72"
  //     ? "text-movet-dark-blue"
  //     : announcement?.color === "#E76159"
  //     ? "text-movet-red"
  //     : announcement?.color === "#232127"
  //     ? "text-movet-black"
  //     : announcement?.color === "#00A36C"
  //     ? "text-movet-green"
  //     : announcement?.color === "#A15643"
  //     ? "text-movet-brown"
  //     : "text-movet-dark-blue";

  // const announcementBannerIcon =
  //   announcement?.icon === "bullhorn"
  //     ? faBullhorn
  //     : announcement?.icon === "exclamation-circle"
  //     ? faExclamationCircle
  //     : announcement?.icon === "bell"
  //     ? faBell
  //     : announcement?.icon === "star"
  //     ? faStar
  //     : announcement?.icon === "info-circle"
  //     ? faInfoCircle
  //     : faIcons;

  const [mainNavigationElements, setMainNavigationElements] = useState<
    NavigationItem[] | null
  >(null);

  useEffect(() => {
    setMainNavigationElements([
      // {
      //   link: '/about',
      //   text: 'About',
      // },
      {
        link: "/services",
        text: "Services",
      },
      {
        link: "/reviews",
        text: "Reviews",
      },
      {
        link: "/careers",
        text: "Careers",
      },
      {
        link: "/blog",
        text: "Blog",
      },
      {
        link: "/contact",
        text: "Contact",
      },
    ]);
  }, []);

  useEffect(() => {
    if (displayAnnouncement === "false") {
      setShowBanner(false);
    }
    setTimeout(() => {
      setShowFadeIn(true);
    }, 1500);
  }, [displayAnnouncement, router]);

  const generateNavigationItem = (
    data: NavigationItem,
    size: "desktop" | "mobile"
  ) => {
    let headerClassName = "";
    if (size === "desktop") {
      headerClassName =
        pathName.toLowerCase() === data.text.toLowerCase()
          ? "font-bold text-movet-red px-3 py-2 rounded-md text-sm cursor-pointer"
          : "text-movet-black hover:text-movet-red hover:bg-opacity-75 px-3 py-2 rounded-md text-sm font-medium cursor-pointer";
    } else {
      headerClassName =
        pathName.toLowerCase() === data.text.toLowerCase()
          ? "font-bold text-movet-red block px-3 py-2 rounded-md text-base cursor-pointer"
          : "text-movet-black hover:bg-movet-brown hover:text-movet-white block px-3 py-2 rounded-md text-base font-medium cursor-pointer";
    }
    return (
      <div
        id={`${size}-${kebabCase(data.text)}`}
        className={"self-center mx-4 md:mx-0 lg:mx-2"}
      >
        <Link href={data.link} passHref>
          <span
            className={
              headerClassName + " font-abside ease-in-out duration-500"
            }
            onClick={() => {
              toggleMobileMenu(!mobileMenu);
            }}
          >
            <span className="sm:not-sr-only uppercase text-base font-semibold">
              {data.text}
            </span>
          </span>
        </Link>
      </div>
    );
  };

  return (
    <>
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
        leave="transition ease-out duration-300"
        leaveTo="opacity-10"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leaveFrom="opacity-100"
      >
        <div className="hidden sm:block fixed inset-x-0 top-0 z-50">
          <div className={`py-4 px-4 ${announcementBannerBackgroundColor}`}>
            <div className="max-w-7xl mx-auto px-3">
              <div className="flex items-center justify-between flex-wrap">
                <div
                  className={`w-0 flex-1 flex items-center${
                    announcement?.link ? " hover:cursor-pointer" : ""
                  }`}
                >
                  {announcement?.link ? (
                    <span
                      className={`flex p-2 rounded-xl bg-movet-white text-lg h-9 w-9 hover:bg-opacity-80 ${announcementBannerTextColor}`}
                    >
                      <a
                        href={`https://movetcare.com${announcement?.link}`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-center ml-0.5"
                      >
                        <FontAwesomeIcon
                          icon={announcementBannerIcon}
                          size="sm"
                        />
                      </a>
                    </span>
                  ) : (
                    <span
                      className={`flex justify-center items-center p-2 rounded-xl bg-movet-white text-lg h-9 w-9 ${announcementBannerTextColor}`}
                    >
                      <FontAwesomeIcon
                        icon={announcementBannerIcon}
                        size="sm"
                      />
                    </span>
                  )}
                  <div className="flex flex-col">
                    {announcement?.link ? (
                      <a
                        href={`https://movetcare.com${announcement?.link}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <>
                          <p className="ml-8 font-medium text-white my-0 italic text-lg hover:text-opacity-80">
                            {announcement?.title}
                          </p>
                          <p className="ml-8 font-medium text-white my-0 italic text-sm hover:text-opacity-80">
                            {announcement?.message}
                          </p>
                        </>
                      </a>
                    ) : (
                      <>
                        <p className="ml-8 font-medium text-white my-0 italic text-lg">
                          {announcement?.title}
                        </p>
                        <p className="ml-8 font-medium text-white my-0 italic text-sm">
                          {announcement?.message}
                        </p>
                      </>
                    )}
                  </div>
                </div>
                {announcement?.link && (
                  <div className="order-3 mt-2 flex-shrink-0 w-full sm:order-2 sm:mt-0 sm:w-auto">
                    <a
                      href={`https://movetcare.com${announcement?.link}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <p
                        className={`w-full flex justify-center border border-transparent shadow-sm text-sm font-abside font-medium uppercase bg-movet-white group-hover:bg-opacity-80 hover:bg-opacity-80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-movet-red py-2 px-6 rounded-full ease-in-out duration-500 cursor-pointer ${announcementBannerTextColor}`}
                      >
                        Learn more
                        <span
                          className={`ml-2 h-3.5 w-3.5 mt-0 ${announcementBannerTextColor}`}
                        >
                          <FontAwesomeIcon icon={faArrowRight} />
                        </span>
                      </p>
                    </a>
                  </div>
                )}
                <div
                  className="order-2 flex-shrink-0 sm:order-3 sm:ml-4 hover:cursor-pointer sm:pl-4"
                  onClick={() =>
                    router.replace(
                      router.pathname + "?displayAnnouncement=false",
                      undefined,
                      { scroll: false, shallow: true }
                    )
                  }
                >
                  <span className="p-2 rounded-xl text-lg text-movet-white justify-center items-center hover:text-opacity-80">
                    <FontAwesomeIcon icon={faTimes} />
                  </span>
                  <span className="sr-only">Dismiss</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Transition> */}
      {/* <nav
        className={`flex flex-row
        ${
          showBanner && fadeIn && announcement && announcement?.isActive
            ? announcement?.message && announcement?.title
              ? " sm:mt-20"
              : announcement?.message || announcement?.title
              ? " sm:mt-16"
              : ""
            : ""
        }
        ${router.pathname === "/" ? " bg-movet-white" : " bg-white"}`}
      > */}
      <nav
        className={`flex flex-row ${
          router.pathname === "/" ? " bg-movet-white" : " bg-white"
        }`}
      >
        <div className="w-full z-20">
          <div className="mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-center">
              <Link href="/" passHref>
                <div
                  className="cursor-pointer mx-4 hover:opacity-80 ease-in-out duration-500"
                  onClick={() => {
                    toggleMobileMenu(!mobileMenu);
                  }}
                >
                  <Image
                    src="/images/logos/logo.png"
                    alt="MoVET Logo"
                    width={250}
                    height={70}
                  />
                </div>
              </Link>
              <div className="hidden lg:flex ml-10 justify-center space-x-4">
                <div className="flex items-center justify-center">
                  {mainNavigationElements &&
                    mainNavigationElements.map(
                      (navigationItem: NavigationItem) => (
                        <div key={`desktop-${kebabCase(navigationItem.text)}`}>
                          {generateNavigationItem(navigationItem, "desktop")}
                        </div>
                      )
                    )}
                  <div className="ml-4">
                    <a
                      className="text-center ease-in-out duration-500 w-full lg:w-40 flex justify-center items-center border border-transparent shadow-sm text-movet-white text-sm font-medium font-abside uppercase bg-movet-brown group-hover:bg-movet-dark-brown hover:bg-movet-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-movet-dark-brown py-2 px-6 rounded-full"
                      target="_blank"
                      href={"sms://+17205077387"}
                      rel="noopener noreferrer"
                    >
                      <FontAwesomeIcon
                        icon={faSms}
                        size="lg"
                        className="mr-2"
                      />
                      Text Us
                    </a>
                  </div>
                  <div className="ml-4">
                    <a
                      className="text-center ease-in-out duration-500 w-full xl:w-72 flex justify-center items-center border border-transparent shadow-sm text-movet-white text-sm font-medium font-abside uppercase bg-movet-red group-hover:bg-movet-black hover:bg-movet-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-movet-red py-2 sm:px-6 xl:px-0 rounded-full"
                      target="_blank"
                      href={
                        isAndroid
                          ? "https://play.google.com/store/apps/details?id=com.movet&hl=en_US&gl=US"
                          : "https://apps.apple.com/us/app/movet-on-demand-vet-services/id1478031556"
                      }
                      rel="noopener noreferrer"
                    >
                      <FontAwesomeIcon
                        icon={faCalendarPlus}
                        size="lg"
                        className="mr-2"
                      />
                      BOOK AN APPOINTMENT
                    </a>
                  </div>
                </div>
              </div>
              <div className="mx-4 flex lg:hidden">
                <Button
                  onClick={() => {
                    toggleMobileMenu(!mobileMenu);
                  }}
                  className="bg-transparent inline-flex items-center justify-center hover:bg-transparent shadow-none"
                >
                  <span className="sr-only">Open Navigation Menu - Mobile</span>
                  <svg
                    className="block h-8 w-8 text-movet-black"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 20 20"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                  <svg
                    className="hidden h-3 w-3 text-movet-black"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 20 20"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </Button>
              </div>
            </div>
          </div>
          <Transition
            show={!mobileMenu}
            enter="transition ease-in duration-500"
            leave="transition ease-out duration-300"
            leaveTo="opacity-10"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leaveFrom="opacity-100"
          >
            <div className="lg:hidden">
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                {mainNavigationElements &&
                  mainNavigationElements.map(
                    (navigationItem: NavigationItem) => {
                      return (
                        <div key={`mobile-${kebabCase(navigationItem.text)}`}>
                          {generateNavigationItem(navigationItem, "mobile")}
                        </div>
                      );
                    }
                  )}
              </div>
              <div className="pt-2 pb-2">
                <div className="flex items-center px-4">
                  <a
                    className="w-full flex justify-center items-center border border-transparent shadow-sm text-movet-white text-base font-abside font-medium uppercase bg-movet-brown group-hover:bg-movet-black hover:bg-movet-dark-brown focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-movet-dark-brown py-2 px-6 rounded-full ease-in-out duration-500"
                    target="_blank"
                    href={"sms://+17205077387"}
                    rel="noopener noreferrer"
                  >
                    <FontAwesomeIcon icon={faSms} size="lg" className="mr-2" />
                    TEXT US
                  </a>
                </div>
              </div>
              <div className="pt-2 pb-6">
                <div className="flex items-center px-4">
                  <a
                    className="w-full flex justify-center items-center border border-transparent shadow-sm text-movet-white text-base font-abside font-medium uppercase bg-movet-red group-hover:bg-movet-black hover:bg-movet-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-movet-red py-2 px-6 rounded-full ease-in-out duration-500"
                    target="_blank"
                    href={
                      isAndroid
                        ? "https://play.google.com/store/apps/details?id=com.movet&hl=en_US&gl=US"
                        : "https://apps.apple.com/us/app/movet-on-demand-vet-services/id1478031556"
                    }
                    rel="noopener noreferrer"
                  >
                    <FontAwesomeIcon
                      icon={faCalendarPlus}
                      size="lg"
                      className="mr-2"
                    />
                    BOOK AN APPOINTMENT
                  </a>
                </div>
              </div>
            </div>
          </Transition>
        </div>
        {router.pathname === "/" && (
          <div className="hidden sm:block absolute top-0 right-0 w-2/5 max-w-md z-10">
            <svg
              className="fill-current text-movet-tan w-full"
              viewBox="0 0 100 150"
            >
              <path d="M 0,0 C 41.36373,35.851041 -37.395737,144.20046 46.655397,141.68437 71.463645,141.23132 90.311646,133.74687 110.1554,124.48646 V 0 Z" />
            </svg>
          </div>
        )}
      </nav>
    </>
  );
};
