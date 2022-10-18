import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Transition } from "@headlessui/react";
import {
  faArrowRight,
  faBell,
  faBullhorn,
  faExclamationCircle,
  faIcons,
  faInfoCircle,
  faStar,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const AnnouncementBanner: React.FC = () => {
  const { announcement }: any = {};
  const router = useRouter();
  const { displayAnnouncement } = router.query;
  const [showBanner, setShowBanner] = useState<boolean>(true);
  const [fadeIn, setShowFadeIn] = useState<boolean>(false);

  const announcementBannerBackgroundColor =
    announcement?.color === "#DAAA00"
      ? "bg-movet-yellow"
      : announcement?.color === "#2C3C72"
      ? "bg-movet-dark-blue"
      : announcement?.color === "#E76159"
      ? "bg-movet-red"
      : announcement?.color === "#232127"
      ? "bg-movet-black"
      : announcement?.color === "#00A36C"
      ? "bg-movet-green"
      : announcement?.color === "#A15643"
      ? "bg-movet-brown"
      : "bg-movet-dark-blue";

  const announcementBannerTextColor =
    announcement?.color === "#DAAA00"
      ? "text-movet-yellow"
      : announcement?.color === "#2C3C72"
      ? "text-movet-dark-blue"
      : announcement?.color === "#E76159"
      ? "text-movet-red"
      : announcement?.color === "#232127"
      ? "text-movet-black"
      : announcement?.color === "#00A36C"
      ? "text-movet-green"
      : announcement?.color === "#A15643"
      ? "text-movet-brown"
      : "text-movet-dark-blue";

  const announcementBannerIcon =
    announcement?.icon === "bullhorn"
      ? faBullhorn
      : announcement?.icon === "exclamation-circle"
      ? faExclamationCircle
      : announcement?.icon === "bell"
      ? faBell
      : announcement?.icon === "star"
      ? faStar
      : announcement?.icon === "info-circle"
      ? faInfoCircle
      : faIcons;

  useEffect(() => {
    if (displayAnnouncement === "false") {
      setShowBanner(false);
    }
    setTimeout(() => {
      setShowFadeIn(true);
    }, 1500);
  }, [displayAnnouncement, router]);

  return (
    <>
      <Transition
        show={
          showBanner &&
          fadeIn &&
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
      </Transition>
    </>
  );
};
