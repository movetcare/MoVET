import {
  faArrowRight,
  faArrowRightFromBracket,
  faBell,
  faBookMedical,
  faBug,
  faBullhorn,
  faCogs,
  faExclamationCircle,
  faFaceSmile,
  faIcons,
  faInfoCircle,
  faPlug,
  faStar,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Transition } from "@headlessui/react";
import { AnnouncementBannerContext } from "contexts/AnnouncementBannerContext";
import { onAuthStateChanged } from "firebase/auth";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import { auth } from "services/firebase";

const Footer: React.FC = () => {
  const {
    announcementPreview,
    showAnnouncementPreview,
    setShowAnnouncementPreview,
  }: any = useContext(AnnouncementBannerContext);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

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
      if (user) {
        const claimsString = (user as any)?.reloadUserInfo?.customAttributes;
        if (claimsString) {
          const claims = JSON.parse(claimsString);
          if (claims?.isSuperAdmin || claims?.isAdmin) setIsAdmin(true);
        }
      }
    });
    return () => unsubscribe();
  }, []);

  const AlertBannerContent = () => (
    <>
      {announcementPreview?.link ? (
        <>
          <div className="w-0 flex-1 flex items-center hover:cursor-pointer pt-4 pb-6">
            <a
              href={`https://movetcare.com${announcementPreview?.link}`}
              target="_blank"
              rel="noreferrer"
            >
              <span
                className={`flex p-2 rounded-xl justify-center items-center bg-movet-white text-lg h-9 w-9 hover:bg-opacity-80 ease-in-out duration-500 ${announcementBannerTextColor}`}
              >
                <FontAwesomeIcon icon={announcementBannerIcon} size="sm" />
              </span>
            </a>
            <div className="flex flex-col">
              <a
                href={`https://movetcare.com${announcementPreview?.link}`}
                target="_blank"
                rel="noreferrer"
              >
                <p className="ml-8 font-medium text-white my-0 italic text-base hover:text-opacity-80">
                  {announcementPreview?.title}
                </p>
              </a>
              <a
                href={`https://movetcare.com${announcementPreview?.link}`}
                target="_blank"
                rel="noreferrer"
              >
                <p className="ml-8 font-medium text-white my-0 italic text-sm hover:text-opacity-80">
                  {announcementPreview?.message}
                </p>
              </a>
            </div>
          </div>
          <div className="order-3 -mt-2 flex-shrink-0 w-full sm:order-2 sm:mt-0 sm:w-auto mb-4">
            <a
              href={`https://movetcare.com${announcementPreview?.link}`}
              target="_blank"
              rel="noreferrer"
            >
              <p
                className={`w-full flex justify-center border border-transparent shadow-sm text-xs font-abside font-medium uppercase bg-movet-white group-hover:bg-opacity-80 hover:bg-opacity-80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-movet-dark-blue py-2 px-6 rounded-full ease-in-out duration-500 cursor-pointer ${announcementBannerTextColor}`}
              >
                Learn more
                <span
                  className={`ml-2 h-3.5 w-3.5 ${announcementBannerTextColor}`}
                >
                  <FontAwesomeIcon icon={faArrowRight} />
                </span>
              </p>
            </a>
          </div>
        </>
      ) : (
        <div
          className="w-0 flex-1 flex items-center hover:cursor-pointer py-4"
          onClick={() => setShowAnnouncementPreview(false)}
        >
          <span
            className={`flex p-2 rounded-xl justify-center items-center bg-movet-white text-lg h-9 w-9 hover:bg-opacity-80 ease-in-out duration-500 ${announcementBannerTextColor}`}
          >
            <FontAwesomeIcon icon={announcementBannerIcon} size="sm" />
          </span>
          <div className="flex flex-col">
            <p className="ml-8 font-medium text-white my-0 italic text-base hover:text-opacity-80">
              {announcementPreview?.title}
            </p>
            <p className="ml-8 font-medium text-white my-0 italic text-sm hover:text-opacity-80">
              {announcementPreview?.message}
            </p>
          </div>
        </div>
      )}
    </>
  );

  return (
    <>
      <footer
        className={`flex flex-row justify-between items-center py-3 bg-movet-black px-8${
          announcementPreview &&
          announcementPreview?.isActive &&
          announcementPreview?.link &&
          showAnnouncementPreview
            ? announcementPreview?.message && announcementPreview?.title
              ? " mb-32 sm:mb-0"
              : announcementPreview?.message || announcementPreview?.title
              ? " mb-28 sm:mb-0"
              : ""
            : announcementPreview?.message && announcementPreview?.title
            ? " mb-20 sm:mb-0"
            : announcementPreview?.message || announcementPreview?.title
            ? " mb-14 sm:mb-0"
            : ""
        }`}
      >
        <p className="text-movet-white font-abside-smooth uppercase text-sm">
          © MoVET {new Date().getFullYear()}
        </p>
        <div className={"flex flex-row items-center justify-center"}>
          {isAdmin && (
            <>
              <Link href="/settings">
                <div className="text-movet-white font-abside-smooth uppercase hover:text-movet-red hover:cursor-pointer italic flex w-full items-center justify-center">
                  <FontAwesomeIcon icon={faCogs} size="lg" />
                </div>
              </Link>
              <p className="text-movet-white text-xl mx-3">|</p>
            </>
          )}
          <a
            href="https://stats.uptimerobot.com/zyPLmUGZJJ/"
            target="_blank"
            rel="noreferrer"
          >
            <div className="text-movet-white font-abside-smooth uppercase hover:text-movet-red hover:cursor-pointer italic flex w-full items-center justify-center">
              <FontAwesomeIcon icon={faPlug} size="lg" />
            </div>
          </a>
          <p className="text-movet-white text-xl mx-3">|</p>
          <Link href="/request-a-feature">
            <div className="text-movet-white font-abside-smooth uppercase hover:text-movet-green hover:cursor-pointer italic flex w-full items-center justify-center">
              <FontAwesomeIcon icon={faFaceSmile} size="lg" />
            </div>
          </Link>
          <p className="text-movet-white text-xl mx-3">|</p>
          <Link href="/report-a-bug">
            <div className="text-movet-white font-abside-smooth uppercase hover:text-movet-red hover:cursor-pointer italic flex w-full items-center justify-center">
              <FontAwesomeIcon icon={faBug} size="lg" />
            </div>
          </Link>
          <p className="text-movet-white text-xl mx-3">|</p>
          <Link href="/docs">
            <div className="text-movet-white font-abside-smooth uppercase hover:text-movet-red hover:cursor-pointer italic flex w-full items-center justify-center">
              <FontAwesomeIcon icon={faBookMedical} size="lg" />
            </div>
          </Link>
          <p className="text-movet-white text-xl mx-3">|</p>
          <Link href="/signout">
            <div className="text-movet-white font-abside-smooth uppercase hover:text-movet-red hover:cursor-pointer italic flex w-full items-center justify-center">
              <FontAwesomeIcon icon={faArrowRightFromBracket} size="lg" />
            </div>
          </Link>
        </div>
      </footer>
      <Transition
        show={showAnnouncementPreview && announcementPreview?.isActive}
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
                  onClick={() => setShowAnnouncementPreview(false)}
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
      </Transition>
    </>
  );
};

export default Footer;
