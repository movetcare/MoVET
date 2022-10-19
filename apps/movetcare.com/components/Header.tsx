import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Transition } from "@headlessui/react";
import { Button } from "ui";
import kebabCase from "lodash.kebabcase";
import { isAndroid } from "react-device-detect";
import { faCalendarPlus, faSms } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";

interface NavigationItem {
  text: string;
  link: string;
}

export const Header = () => {
  const router = useRouter();
  const [mobileMenu, toggleMobileMenu] = useState(true);
  const pathName = router.pathname.split("/")[1];

  const [mainNavigationElements, setMainNavigationElements] = useState<
    NavigationItem[] | null
  >(null);

  useEffect(() => {
    setMainNavigationElements([
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
    <nav
      className={`w-full flex flex-row ${
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
                    <FontAwesomeIcon icon={faSms} size="lg" className="mr-2" />
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
                mainNavigationElements.map((navigationItem: NavigationItem) => {
                  return (
                    <div key={`mobile-${kebabCase(navigationItem.text)}`}>
                      {generateNavigationItem(navigationItem, "mobile")}
                    </div>
                  );
                })}
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
  );
};
