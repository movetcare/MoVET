// import Image from "next/image";
// import { classNames } from "../../utils";

export const AppLinks = ({ size = "sm" }: { size?: "sm" | "lg" }) => (
  <>
    {/* <a
      href="https://apps.apple.com/us/app/movet-on-demand-vet-services/id1478031556"
      target="_blank"
      rel="noreferrer"
      className="shrink-0 sm:mr-1 ios-app-link"
    >
      <Image
        src="/images/icons/app-store-download.svg"
        alt="Get it on Apple App Store"
        height={40}
        width={120}
        className={classNames(
          size === "sm" ? "py-2.5" : "py-[.8rem]",
          "-mt-2 opacity-80 hover:opacity-100 ease-in-out duration-500",
        )}
      />
    </a> */}
    {/* <a
      href="https://play.google.com/store/apps/details?id=com.movet&hl=en_US&gl=US&pcampaignid=pcampaignidMKT-Other-global-all-co-prtnr-py-PartBadge-Mar2515-1"
      target="_blank"
      rel="noreferrer"
      className="shrink-0 sm:ml-1 -mt-2.5 android-app-link"
    >
      <Image
        height={60}
        width={158}
        alt="Get it on Google Play"
        src="/images/icons/google-play-badge.png" //"https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png"
        className={"opacity-80 hover:opacity-100 ease-in-out duration-500"}
      />
    </a> */}
  </>
);
