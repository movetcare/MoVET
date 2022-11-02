import {
  faCalendar,
  faCogs,
  faUser,
  faWrench,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { classNames } from "utils/classNames";

export const SettingsNavigation = () => {
  const navigation = [
    {
      title: "Manage Users",
      description:
        "View Admin app users and re-sync ProVet user data w/ the platform",
      href: "/settings/users/",
      icon: faUser,
      iconForeground: "text-movet-yellow",
      iconBackground: "bg-movet-yellow bg-opacity-50",
    },
    {
      title: "Manage Booking",
      description:
        "Customize how shifts in ProVet integrate with the MoVET platform's appointment scheduling system",
      href: "/settings/booking/",
      icon: faCalendar,
      iconForeground: "text-movet-brown",
      iconBackground: "bg-movet-brown bg-opacity-50",
    },
    {
      title: "Platform Tools",
      description:
        "Tools for troubleshooting and debugging various platform issues",
      href: "/settings/tools/",
      icon: faWrench,
      iconForeground: "text-movet-green",
      iconBackground: "bg-movet-green bg-opacity-50",
    },
  ];
  return (
    <div className="rounded-lg bg-movet-white overflow-hidden shadow divide-y divide-movet-gray sm:divide-y-0 sm:grid sm:grid-cols-2 sm:gap-px">
      <div className="flex flex-row items-center justify-center col-span-2 bg-white">
        <FontAwesomeIcon icon={faCogs} className="text-movet-red" size="lg" />
        <h1 className="ml-2 my-4 text-lg">Settings</h1>
      </div>
      {navigation.map((item) => (
        <div
          key={item.title}
          className={
            "relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-movet-red flex flex-row items-center"
          }
        >
          <div>
            <span
              className={classNames(
                item.iconBackground,
                item.iconForeground,
                "rounded-lg inline-flex p-3 ring-4 ring-white"
              )}
            >
              <FontAwesomeIcon
                icon={item.icon}
                className="h-8 w-8"
                size="lg"
                aria-hidden="true"
              />
            </span>
          </div>
          <div className="mx-8">
            <h3 className="text-lg font-medium">
              <Link href={item.href}>
                <div className="focus:outline-none hover:underline ease-in-out duration-500">
                  <span className="absolute inset-0" aria-hidden="true" />
                  {item.title}
                </div>
              </Link>
            </h3>
            <p className="text-movet-black">{item.description}</p>
          </div>
          <span
            className="pointer-events-none absolute top-6 right-6 text-movet-gray group-hover:text-movet-black"
            aria-hidden="true"
          >
            <svg
              className="h-6 w-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M20 4h1a1 1 0 00-1-1v1zm-1 12a1 1 0 102 0h-2zM8 3a1 1 0 000 2V3zM3.293 19.293a1 1 0 101.414 1.414l-1.414-1.414zM19 4v12h2V4h-2zm1-1H8v2h12V3zm-.707.293l-16 16 1.414 1.414 16-16-1.414-1.414z" />
            </svg>
          </span>
        </div>
      ))}
    </div>
  );
};
