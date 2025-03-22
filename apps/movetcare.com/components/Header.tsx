import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Transition } from "@headlessui/react";
import { Button } from "ui";
import kebabCase from "lodash.kebabcase";
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
        link: "/hours",
        text: "Hours",
      },
      {
        link: "/shop",
        text: "shop",
      },
      {
        link: "/blog",
        text: "Blog",
      },
      {
        link: "/careers",
        text: "Careers",
      },
      {
        link: "/contact",
        text: "Contact",
      },
    ]);
  }, []);

  const generateNavigationItem = (
    data: NavigationItem,
    size: "desktop" | "mobile",
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
        <Link href={data.link}>
          <span
            className={
              headerClassName + " font-abside ease-in-out duration-500"
            }
            onClick={() => {
              toggleMobileMenu(!mobileMenu);
            }}
          >
            <span className="text-base font-semibold uppercase sm:not-sr-only">
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
      <div className="z-20 w-full">
        <div className="px-4 py-4 mx-auto sm:px-6 lg:px-8">
          <div className="flex justify-center items-center">
            <Link href="/">
              <div
                className="mx-4 duration-500 ease-in-out cursor-pointer hover:opacity-80"
                onClick={() => {
                  toggleMobileMenu(!mobileMenu);
                }}
              >
                <Image
                  src="/images/logos/logo.png"
                  alt="MoVET Logo"
                  width={250}
                  height={70}
                  priority
                />
              </div>
            </Link>
            <div className="hidden justify-center ml-10 space-x-4 lg:flex">
              <div className="flex justify-center items-center">
                {mainNavigationElements &&
                  mainNavigationElements.map(
                    (navigationItem: NavigationItem) => (
                      <div key={`desktop-${kebabCase(navigationItem.text)}`}>
                        {generateNavigationItem(navigationItem, "desktop")}
                      </div>
                    ),
                  )}
                <div className="ml-4">
                  <a
                    className="flex justify-center items-center px-6 py-2 w-full text-sm font-medium text-center uppercase rounded-full border border-transparent shadow-sm duration-500 ease-in-out lg:w-40 text-movet-white font-abside bg-movet-brown group-hover:bg-movet-dark-brown hover:bg-movet-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-movet-dark-brown"
                    target="_blank"
                    href={"sms:+17205077387"}
                    rel="noopener noreferrer"
                    id="text-us-cta"
                  >
                    <FontAwesomeIcon icon={faSms} size="lg" className="mr-2" />
                    Text Us
                  </a>
                </div>
                <div className="ml-4">
                  <a
                    className="flex justify-center items-center py-2 w-full text-sm font-medium text-center uppercase rounded-full border border-transparent shadow-sm duration-500 ease-in-out xl:w-72 text-movet-white font-abside bg-movet-red group-hover:bg-movet-black hover:bg-movet-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-movet-red sm:px-6 xl:px-0"
                    target="_blank"
                    href={`https://petportal.vet/movet/`}
                    rel="noopener noreferrer"
                    id="request-appointment-cta"
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
            <div className="flex mx-4 lg:hidden">
              <Button
                onClick={() => {
                  toggleMobileMenu(!mobileMenu);
                }}
                id="mobile-navigation"
                className="inline-flex justify-center items-center bg-transparent shadow-none hover:bg-transparent"
              >
                <span className="sr-only">Open Navigation Menu - Mobile</span>
                <svg
                  className="block w-8 h-8 text-movet-black"
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
                  className="hidden w-3 h-3 text-movet-black"
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
                  className="flex justify-center items-center px-6 py-2 w-full text-base font-medium uppercase rounded-full border border-transparent shadow-sm duration-500 ease-in-out text-movet-white font-abside bg-movet-brown group-hover:bg-movet-black hover:bg-movet-dark-brown focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-movet-dark-brown"
                  target="_blank"
                  href={"sms:+17205077387"}
                  rel="noopener noreferrer"
                  id="mobile-text-us-cta"
                >
                  <FontAwesomeIcon icon={faSms} size="lg" className="mr-2" />
                  TEXT US
                </a>
              </div>
            </div>
            <div className="pt-2 pb-6">
              <div className="flex items-center px-4">
                <a
                  className="flex justify-center items-center px-6 py-2 w-full text-base font-medium uppercase rounded-full border border-transparent shadow-sm duration-500 ease-in-out text-movet-white font-abside bg-movet-red group-hover:bg-movet-black hover:bg-movet-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-movet-red"
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
        </Transition>
      </div>
      {router.pathname === "/" && (
        <div className="hidden absolute top-0 right-0 z-10 w-2/5 max-w-md sm:block">
          <svg
            className="w-full fill-current text-movet-tan"
            viewBox="0 0 100 150"
          >
            <path d="M 0,0 C 41.36373,35.851041 -37.395737,144.20046 46.655397,141.68437 71.463645,141.23132 90.311646,133.74687 110.1554,124.48646 V 0 Z" />
          </svg>
        </div>
      )}
    </nav>
  );
};
