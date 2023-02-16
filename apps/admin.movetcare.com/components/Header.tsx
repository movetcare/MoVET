import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import router, { useRouter } from "next/router";
import { Transition } from "@headlessui/react";
import kebabCase from "lodash.kebabcase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRight,
  faBell,
  faBullhorn,
  faExclamationCircle,
  faFileInvoiceDollar,
  faHeadset,
  faIcons,
  faInfoCircle,
  faLaptopMedical,
  faPaw,
  faPhone,
  faStar,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "services/firebase";
import { AnnouncementBannerContext } from "contexts/AnnouncementBannerContext";
import Image from "next/image";

interface NavigationItem {
  text: string;
  link: string;
  icon: IconDefinition;
  newTab?: true;
}

const Header: React.FC = () => {
  const {
    announcementPreview,
    showAnnouncementPreview,
    setShowAnnouncementPreview,
  }: any = useContext(AnnouncementBannerContext);
  const [mobileMenu, toggleMobileMenu] = useState(true);
  const [navigationElements, setNavigationElements] =
    useState<Array<NavigationItem>>();
  const pathName = useRouter().pathname.split("/")[1];

  const announcementBannerBackgroundColor =
    announcementPreview?.color?.id === "#DAAA00"
      ? "bg-movet-yellow"
      : announcementPreview?.color?.id === "#2C3C72"
      ? "bg-movet-dark-blue"
      : announcementPreview?.color?.id === "#E76159"
      ? "bg-movet-red"
      : announcementPreview?.color?.id === "#232127"
      ? "bg-movet-black"
      : announcementPreview?.color?.id === "#00A36C"
      ? "bg-movet-green"
      : announcementPreview?.color?.id === "#A15643"
      ? "bg-movet-brown"
      : "bg-movet-dark-blue";

  const announcementBannerTextColor =
    announcementPreview?.color?.id === "#DAAA00"
      ? "text-movet-yellow"
      : announcementPreview?.color?.id === "#2C3C72"
      ? "text-movet-dark-blue"
      : announcementPreview?.color?.id === "#E76159"
      ? "text-movet-red"
      : announcementPreview?.color?.id === "#232127"
      ? "text-movet-black"
      : announcementPreview?.color?.id === "#00A36C"
      ? "text-movet-green"
      : announcementPreview?.color?.id === "#A15643"
      ? "text-movet-brown"
      : "text-movet-dark-blue";

  const announcementBannerIcon =
    announcementPreview?.icon?.id === "bullhorn"
      ? faBullhorn
      : announcementPreview?.icon?.id === "exclamation-circle"
      ? faExclamationCircle
      : announcementPreview?.icon?.id === "bell"
      ? faBell
      : announcementPreview?.icon?.id === "star"
      ? faStar
      : announcementPreview?.icon?.id === "info-circle"
      ? faInfoCircle
      : faIcons;

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && router) {
        const claimsString = (user as any)?.reloadUserInfo?.customAttributes;
        if (claimsString) {
          const claims = JSON.parse(claimsString);
          if (claims?.isSuperAdmin || claims?.isAdmin)
            setNavigationElements([
              {
                link: "/dashboard",
                text: "Dashboard",
                icon: faLaptopMedical,
              },
              {
                link: "/billing",
                text: "Billing",
                icon: faFileInvoiceDollar,
              },
              {
                link: "/telehealth/chat",
                text: "Telehealth",
                icon: faHeadset,
              },
              // {
              //   link: "/blog",
              //   text: "Blog",
              //   icon: faNewspaper,
              // },
              {
                link: "https://us.provetcloud.com/4285/dashboard/",
                text: "ProVet",
                icon: faPaw,
                newTab: true,
              },
              {
                link: "https://app.goto.com/domain/ed586a2b-6975-4613-8df0-c3de59fefc65/",
                text: "GoTo",
                icon: faPhone,
                newTab: true,
              },
            ]);
          else if (claims?.isStaff)
            setNavigationElements([
              {
                link: "/dashboard",
                text: "Dashboard",
                icon: faLaptopMedical,
              },
              {
                link: "/billing",
                text: "Billing",
                icon: faFileInvoiceDollar,
              },
              {
                link: "/telehealth/chat",
                text: "Telehealth",
                icon: faHeadset,
              },
              {
                link: "https://us.provetcloud.com/4285/dashboard/",
                text: "ProVet",
                icon: faPaw,
                newTab: true,
              },
              {
                link: "https://app.goto.com/domain/ed586a2b-6975-4613-8df0-c3de59fefc65/",
                text: "GoTo",
                icon: faPhone,
                newTab: true,
              },
            ]);
        }
      }
    });
    return () => unsubscribe();
  }, []);

  const generateNavigationItem = (
    data: NavigationItem,
    size: "desktop" | "mobile"
  ) => {
    let headerClassName = "";
    if (size === "desktop") {
      headerClassName =
        pathName.toLowerCase() === data.text.toLowerCase()
          ? "text-movet-red px-3 py-2 rounded-md text-sm font-medium cursor-pointer"
          : "text-movet-black group-hover:text-movet-red group-hover:bg-opacity-75 px-3 py-2 rounded-md text-sm font-medium cursor-pointer";
    } else {
      headerClassName =
        pathName.toLowerCase() === data.text.toLowerCase()
          ? "text-left text-movet-red block px-3 py-2 rounded-md text-base font-medium cursor-pointer"
          : "text-left text-movet-black group-hover:text-movet-red group-hover:bg-opacity-75 block px-3 py-2 rounded-md text-base font-medium cursor-pointer";
    }
    return (
      <div
        id={`${size}-${kebabCase(data.text)}`}
        className={"self-center mx-4 md:mx-0 lg:mx-2"}
      >
        {data?.newTab ? (
          <a
            className="flex flex-row justify-start items-center mr-8 group transition ease-out duration-300"
            href={data.link}
            target="_blank"
            rel="noreferrer"
          >
            <div className="cursor-pointer">
              <FontAwesomeIcon
                icon={data.icon}
                size="lg"
                className={
                  pathName.toLowerCase() === data.text.toLowerCase()
                    ? "text-movet-red group-hover:text-movet-black"
                    : "text-movet-black group-hover:text-movet-red"
                }
              />
            </div>
            <span className={headerClassName + " font-abside"}>
              <span className="sm:not-sr-only uppercase text-sm">
                {data.text}
              </span>
            </span>
          </a>
        ) : (
          <Link href={data.link}>
            <div className="flex flex-row justify-start items-center mr-8 group transition ease-out duration-300">
              <div className="cursor-pointer">
                <FontAwesomeIcon
                  icon={data.icon}
                  size="lg"
                  className={
                    pathName.toLowerCase() === data.text.toLowerCase()
                      ? "text-movet-red group-hover:text-movet-black"
                      : "text-movet-black group-hover:text-movet-red"
                  }
                />
              </div>
              <span className={headerClassName + " font-abside"}>
                <span className="sm:not-sr-only uppercase text-sm">
                  {data.text}
                </span>
              </span>
            </div>
          </Link>
        )}
      </div>
    );
  };

  return (
    <>
      <Transition
        show={showAnnouncementPreview && announcementPreview?.isActive}
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
                    announcementPreview?.link ? " hover:cursor-pointer" : ""
                  }`}
                >
                  {announcementPreview?.link ? (
                    <span
                      className={`flex p-2 rounded-xl bg-movet-white text-lg h-9 w-9 hover:bg-opacity-80 ${announcementBannerTextColor}`}
                    >
                      <a
                        href={`https://movetcare.com${announcementPreview?.link}`}
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
                    {announcementPreview?.link ? (
                      <a
                        href={`https://movetcare.com${announcementPreview?.link}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <>
                          <p className="ml-8 font-medium text-white my-0 italic text-lg hover:text-opacity-80">
                            {announcementPreview?.title}
                          </p>
                          <p className="ml-8 font-medium text-white my-0 italic text-sm hover:text-opacity-80">
                            {announcementPreview?.message}
                          </p>
                        </>
                      </a>
                    ) : (
                      <>
                        <p className="ml-8 font-medium text-white my-0 italic text-lg">
                          {announcementPreview?.title}
                        </p>
                        <p className="ml-8 font-medium text-white my-0 italic text-sm">
                          {announcementPreview?.message}
                        </p>
                      </>
                    )}
                  </div>
                </div>
                {announcementPreview?.link && (
                  <div className="order-3 mt-2 flex-shrink-0 w-full sm:order-2 sm:mt-0 sm:w-auto">
                    <a
                      href={`https://movetcare.com${announcementPreview?.link}`}
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
                  onClick={() => setShowAnnouncementPreview(false)}
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
      </Transition>
      <nav
        className={`bg-white shadow overflow-hidden${
          announcementPreview &&
          announcementPreview?.isActive &&
          showAnnouncementPreview
            ? announcementPreview?.message && announcementPreview?.title
              ? " sm:mt-20"
              : announcementPreview?.message || announcementPreview?.title
              ? " sm:mt-14"
              : ""
            : ""
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-center h-16">
            <Link href="/">
              <div className="cursor-pointer mx-4">
                <Image
                  src="/images/logo/logo.png"
                  alt="MoVET Logo"
                  height={40}
                  width={175}
                  priority
                />
              </div>
            </Link>
            <div className="hidden md:flex ml-10 justify-center space-x-4">
              <div className="flex items-center justify-center">
                {navigationElements &&
                  navigationElements.map((navigationItem: NavigationItem) => (
                    <div key={`desktop-${kebabCase(navigationItem.text)}`}>
                      {generateNavigationItem(navigationItem, "desktop")}
                    </div>
                  ))}
              </div>
            </div>
            <div className="mx-4 flex md:hidden">
              <button
                onClick={() => {
                  toggleMobileMenu(!mobileMenu);
                }}
                className="mobile-nav-toggle bg-transparent inline-flex items-center justify-center p-2 rounded-md text-movet-black hover:bg-transparent shadow-none"
              >
                <span className="sr-only">Open Navigation Menu - Mobile</span>
                <svg
                  className="block h-10 w-10 text-movet-black"
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
                  className="hidden h-6 w-6 text-movet-black"
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
              </button>
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
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navigationElements &&
                navigationElements.map((navigationItem: NavigationItem) => {
                  return (
                    <div key={`mobile-${kebabCase(navigationItem.text)}`}>
                      {generateNavigationItem(navigationItem, "mobile")}
                    </div>
                  );
                })}
            </div>
          </div>
        </Transition>
      </nav>
    </>
  );
};

export default Header;
