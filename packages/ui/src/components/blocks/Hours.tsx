import {
  faPersonWalking,
  faParking,
  faArrowRight,
  faHospital,
  faHouseMedical,
  faShop,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type {
  Hours as HoursType,
  WinterMode as WinterModeType,
  HoursStatus as HoursStatusType,
} from "types";
import Image from "next/image";
import Link from "next/link";

export const Hours = ({
  winterMode,
  hours,
  embed = false,
  hoursStatus,
}: {
  winterMode: WinterModeType;
  hours: Array<HoursType>;
  hoursStatus: HoursStatusType;
  embed?: boolean;
}) => {
  const clinicHours: Array<{ days: string; times: string }> = [];
  if (hours && hours.length)
    hours.map((hours: { type: string; days: string; times: string }) => {
      if (hours.type === "Clinic @ Belleview Station")
        clinicHours.push({ days: hours.days, times: hours.times });
    });
  const boutiqueHours: Array<{ days: string; times: string }> = [];
  if (hours && hours.length)
    hours.map((hours: { type: string; days: string; times: string }) => {
      if (hours.type === "Boutique @ Belleview Station")
        boutiqueHours.push({ days: hours.days, times: hours.times });
    });
  const clinicWalkInHours: Array<{ days: string; times: string }> = [];
  if (hours && hours.length)
    hours.map((hours: { type: string; days: string; times: string }) => {
      if (hours.type === "Clinic Walk-In Hours")
        clinicWalkInHours.push({ days: hours.days, times: hours.times });
    });
  const housecallHours: Array<{ days: string; times: string }> = [];
  if (hours && hours.length)
    hours.map((hours: { type: string; days: string; times: string }) => {
      if (hours.type === "Housecalls")
        housecallHours.push({ days: hours.days, times: hours.times });
    });
  return embed ? (
    <>
      <section className="hidden sm:block sm:relative w-full bg-movet-brown text-white pb-6">
        <div className="h-20 -top-20 sm:h-28 sm:-top-28 overflow-hidden absolute w-full">
          <svg
            viewBox="0 0 500 150"
            preserveAspectRatio="none"
            className="w-full h-full flip mirror"
          >
            <path
              d="M0,52 C130,119 385,-105 501.41,83 L500.00,0.00 L0.00,0.00 Z"
              className="fill-movet-brown"
            ></path>
          </svg>
        </div>
        <div className="relative z-20 pt-12 px-8 max-w-screen-lg mx-auto mb-20 lg:mb-12">
          <h2 className="text-3xl sm:text-4xl text-center font-extrabold tracking-tight text-movet-white -mt-4 mb-12">
            Hours of Operation
          </h2>
          <div className="grid sm:grid-cols-2 gap-y-12 gap-x-8 mb-12">
            <div className="col-span-2 -mb-4">
              <iframe
                title="Google Map of MoVET @ Belleview Station"
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
                src="https://www.google.com/maps/embed/v1/place?q=place_id:ChIJ9aCJc9mHbIcRu0B0dJWB4x8&key=AIzaSyD-8-Mxe05Y1ySHD7XoDcumWt3vjA-URF0"
                className="w-full h-96 rounded-xl"
              />
              <p className="w-full text-center text-sm italic mt-6 md:mt-4 max-w-lg mx-auto">
                * Parking may be a bit challenging due to construction going on
                in this area. Please leave ample time before your appointment.
                You are welcome to pull up to the clinic, drop your pet with us
                and go find parking.
              </p>
              <a
                href="https://movetcare.com/parking.png"
                target="_blank"
                className="flex flex-row items-center justify-center w-full text-center text-sm text-movet-white mt-8 md:mt-4 font-extrabold hover:text-movet-black"
                rel="noreferrer"
              >
                <span className="w-6 h-6 mr-2">
                  <FontAwesomeIcon icon={faParking} />
                </span>
                <span>View Parking Map</span>
              </a>
            </div>
            <div className="w-full max-w-lg">
              <FontAwesomeIcon
                icon={faHospital}
                size="3x"
                className="w-full mb-4 text-movet-white"
              />
              <h3 className="text-xl text-center font-bold pt-2">
                Clinic @ Belleview Station
              </h3>
              <div className="flex py-4 px-2 sm:px-4 leading-6 font-abside text-lg pb-2 whitespace-nowrap uppercase">
                <div className="w-full">
                  {clinicHours?.map(
                    (hours: { days: string }, index: number) => {
                      return (
                        <div key={hours.days + index} className="flex w-full">
                          <span>{hours.days}</span>
                          <div className="w-full border-b mb-2 mx-4"></div>
                        </div>
                      );
                    }
                  )}
                </div>
                <div className="w-max">
                  {clinicHours?.map(
                    (hours: { times: string }, index: number) => {
                      return (
                        <div key={hours.times + index} className="flex w-full">
                          <span>{hours.times}</span>
                        </div>
                      );
                    }
                  )}
                </div>
              </div>
            </div>
            <div className="w-full max-w-lg">
              <FontAwesomeIcon
                icon={faPersonWalking}
                size="3x"
                className="w-full mb-4 text-movet-white"
              />
              <h3 className="text-xl text-center font-bold pt-2">
                Walk Ins @ Belleview Station
              </h3>
              <div className="flex py-4 px-2 sm:px-4 leading-6 font-abside text-lg pb-2 whitespace-nowrap uppercase">
                <div className="w-full">
                  {clinicWalkInHours?.map(
                    (hours: { days: string }, index: number) => {
                      return (
                        <div key={hours.days + index} className="flex w-full">
                          <span>{hours.days}</span>
                          <div className="w-full border-b mb-2 mx-4"></div>
                        </div>
                      );
                    }
                  )}
                </div>
                <div className="w-max">
                  {clinicWalkInHours?.map(
                    (hours: { times: string }, index: number) => {
                      return (
                        <div key={hours.times + index} className="flex w-full">
                          <span>{hours.times}</span>
                        </div>
                      );
                    }
                  )}
                </div>
              </div>
            </div>
            <div className="w-full max-w-lg whitespace-nowrap">
              <FontAwesomeIcon
                icon={faShop}
                size="3x"
                className="w-full mb-4 text-movet-white"
              />
              <h3 className="text-xl text-center font-bold">
                Boutique @ Belleview Station
              </h3>
              <div className="flex py-4 px-2 sm:px-4 leading-6 font-abside text-lg pb-2 whitespace-nowrap">
                <div className="w-full">
                  {boutiqueHours?.map(
                    (hours: { days: string }, index: number) => {
                      return (
                        <div key={hours.days + index} className="flex w-full">
                          <span>{hours.days}</span>
                          <div className="w-full border-b mb-2 mx-4"></div>
                        </div>
                      );
                    }
                  )}
                </div>
                <div className="w-max">
                  {boutiqueHours?.map(
                    (hours: { times: string }, index: number) => {
                      return (
                        <div key={hours.times + index} className="flex w-full">
                          <span>{hours.times}</span>
                        </div>
                      );
                    }
                  )}
                </div>
              </div>
            </div>
            <div className="w-full max-w-lg items-center">
              <FontAwesomeIcon
                icon={faHouseMedical}
                size="3x"
                className="w-full mb-4 text-movet-white"
              />
              <h3 className="text-xl text-center">Housecalls</h3>
              {winterMode &&
              winterMode?.isActive &&
              winterMode?.isActiveOnWebsite ? (
                <p className="text-lg text-center italic mb-2">
                  * {winterMode?.message}
                </p>
              ) : (
                <div className="flex py-4 px-2 sm:px-4 leading-6 font-abside text-lg pb-2 whitespace-nowrap">
                  <div className="w-full">
                    {housecallHours?.map(
                      (hours: { days: string }, index: number) => {
                        return (
                          <div key={hours.days + index} className="flex w-full">
                            <span>{hours.days}</span>
                            <div className="w-full border-b mb-2 mx-4"></div>
                          </div>
                        );
                      }
                    )}
                  </div>
                  <div className="w-max">
                    {housecallHours?.map(
                      (hours: { times: string }, index: number) => {
                        return (
                          <div
                            key={hours.times + index}
                            className="flex w-full"
                          >
                            <span>{hours.times}</span>
                          </div>
                        );
                      }
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
          <Link href="/hours" className="text-movet-white -mt-8">
            <h3 className="font-abside text-center text-sm w-full smx-auto mt-4">
              View Seasonal Closures <FontAwesomeIcon icon={faArrowRight} />
            </h3>
          </Link>
        </div>
        <div className="curve h-24 before:ellipse-1 before:w-[70%] before:bg-movet-brown before:h-40 before:translate-x-[64%] before:translate-y-[-31%] before:rounded-[100%_100%_100%_100%_/_100%_100%_100%_76%] after:ellipse-1 after:w-[84%] after:bg-movet-black after:translate-x-[-20%] after:translate-y-[54%] after:rounded-tr-[125%] after:h-32 ">
          <div className="absolute -mt-6 w-full flex justify-center top-[3.825rem] gap-x-2 md:hidden z-10">
            <Image
              src="/images/pets/client-w-dog.jpg"
              alt="dog"
              className="rounded-full"
              width={100}
              height={100}
            />
            <Image
              src="/images/pets/holding-dog-home.png"
              alt="dog"
              className="rounded-full"
              width={100}
              height={100}
            />
            <Image
              src="/images/pets/puppy-2.jpg"
              alt="dog"
              className="rounded-full"
              width={100}
              height={100}
            />
          </div>
        </div>
      </section>
      <section className="relative sm:hidden w-full bg-movet-brown text-white py-4 -mt-8">
        <div className="z-20 py-12 px-8 max-w-screen-lg mx-auto">
          <h2 className="text-3xl sm:text-4xl text-center font-extrabold tracking-tight text-movet-white -mt-4 mb-12">
            Hours of Operation
          </h2>
          <div className="flex flex-col justify-center items-center mb-12">
            <div className="w-full max-w-lg">
              <h3 className="text-xl text-center font-bold pt-2">
                Clinic @ Belleview Station
              </h3>
              <div className="flex justify-center py-4 px-2 sm:px-4 leading-6 font-abside pb-2 whitespace-nowrap">
                <div className="w-full">
                  {clinicHours?.map(
                    (hours: { days: string }, index: number) => (
                      <div
                        className="flex w-full uppercase"
                        key={hours.days + index}
                      >
                        <span className="whitespace-nowrap">{hours.days}</span>
                        <div className="w-full border-b mb-2 mx-4"></div>
                      </div>
                    )
                  )}
                </div>
                <div className="w-max whitespace-nowrap uppercase">
                  {clinicHours?.map(
                    (hours: { times: string }, index: number) => (
                      <div key={hours.times + index}>{hours.times}</div>
                    )
                  )}
                </div>
              </div>
            </div>
            <div className="w-full max-w-lg  whitespace-nowrap mt-8">
              <h3 className="text-xl text-center font-bold">
                Walk-Ins @ Belleview Station
              </h3>
              <div className="flex justify-center py-4 px-2 sm:px-4 leading-6 font-abside pb-2 whitespace-nowrap uppercase">
                <div className="w-full">
                  {clinicWalkInHours?.map(
                    (hours: { days: string }, index: number) => (
                      <div
                        className="flex w-full uppercase"
                        key={hours.days + index}
                      >
                        <span className="whitespace-nowrap">{hours.days}</span>
                        <div className="w-full border-b mb-2 mx-4"></div>
                      </div>
                    )
                  )}
                </div>
                <div className="w-max whitespace-nowrap uppercase">
                  {clinicWalkInHours?.map(
                    (hours: { times: string }, index: number) => (
                      <div key={hours.times + index}>{hours.times}</div>
                    )
                  )}
                </div>
              </div>
            </div>
            <div className="sm:px-6 mt-8">
              <iframe
                title="Google Map of MoVET @ Belleview Station"
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
                src="https://www.google.com/maps/embed/v1/place?q=place_id:ChIJ9aCJc9mHbIcRu0B0dJWB4x8&key=AIzaSyD-8-Mxe05Y1ySHD7XoDcumWt3vjA-URF0"
                className="w-full h-96 rounded-xl"
              />
              <p className="w-full text-center text-sm italic mt-6 md:mt-4">
                * Parking may be a bit challenging due to construction going on
                in this area. Please leave ample time before your appointment.
                You are welcome to pull up to the clinic, drop your pet with us
                and go find parking.
              </p>
              <a
                href="https://movetcare.com/parking.png"
                target="_blank"
                className="flex flex-row items-center justify-center w-full text-center text-sm text-movet-white mt-8 md:mt-4 font-extrabold hover:text-movet-black"
                rel="noreferrer"
              >
                <span className="w-6 h-6 mr-2">
                  <FontAwesomeIcon icon={faParking} />
                </span>
                <span>View Parking Map</span>
              </a>
            </div>
            <div className="w-full max-w-lg  whitespace-nowrap mt-8">
              <h3 className="text-xl text-center font-bold">
                Boutique @ Belleview Station
              </h3>
              <div className="flex justify-center py-4 px-2 sm:px-4 leading-6 font-abside pb-2 whitespace-nowrap">
                <div className="w-full">
                  {boutiqueHours?.map(
                    (hours: { days: string }, index: number) => (
                      <div
                        className="flex w-full uppercase"
                        key={hours.days + index}
                      >
                        <span className="whitespace-nowrap">{hours.days}</span>
                        <div className="w-full border-b mb-2 mx-4"></div>
                      </div>
                    )
                  )}
                </div>
                <div className="w-max whitespace-nowrap uppercase">
                  {boutiqueHours?.map(
                    (hours: { times: string }, index: number) => (
                      <div key={hours.times + index}>{hours.times}</div>
                    )
                  )}
                </div>
              </div>
            </div>
            <div className="w-full max-w-lg items-center mt-8 mb-12">
              <h3 className="text-xl text-center">Housecalls</h3>
              {winterMode &&
              winterMode?.isActive &&
              winterMode?.isActiveOnWebsite ? (
                <p className="text-center italic">* {winterMode?.message}</p>
              ) : (
                <div className="flex py-4 px-2 sm:px-4 leading-6 font-abside text-lg pb-2 whitespace-nowrap">
                  <div className="w-full">
                    {housecallHours?.map(
                      (hours: { days: string }, index: number) => (
                        <div
                          className="flex w-full uppercase"
                          key={hours.days + index}
                        >
                          <span className="whitespace-nowrap">
                            {hours.days}
                          </span>
                          <div className="w-full border-b mb-2 mx-4"></div>
                        </div>
                      )
                    )}
                  </div>
                  <div className="w-max whitespace-nowrap uppercase">
                    {housecallHours?.map(
                      (hours: { times: string }, index: number) => (
                        <div key={hours.times + index}>{hours.times}</div>
                      )
                    )}
                  </div>
                </div>
              )}
              <Link href="/hours" className="text-movet-white">
                <h3 className="font-abside text-center text-sm w-full sm:w-2/3 mx-auto mt-4 -mb-4">
                  View Seasonal Closures <FontAwesomeIcon icon={faArrowRight} />
                </h3>
              </Link>
            </div>
          </div>
        </div>
        <div className="curve h-24 before:ellipse-1 before:w-[70%] before:bg-movet-brown before:h-40 before:translate-x-[64%] before:translate-y-[-31%] before:rounded-[100%_100%_100%_100%_/_100%_100%_100%_76%] after:ellipse-1 after:w-[84%] after:bg-movet-black after:translate-x-[-20%] after:translate-y-[54%] after:rounded-tr-[125%] after:h-32 ">
          <div className="absolute -mt-6 w-full flex justify-center top-[3.825rem] gap-x-2 md:hidden z-10">
            <Image
              src="/images/pets/client-w-dog.jpg"
              alt="dog"
              className="rounded-full"
              width={100}
              height={100}
            />
            <Image
              src="/images/pets/holding-dog-home.png"
              alt="dog"
              className="rounded-full"
              width={100}
              height={100}
            />
            <Image
              src="/images/pets/puppy-2.jpg"
              alt="dog"
              className="rounded-full"
              width={100}
              height={100}
            />
          </div>
        </div>
      </section>
    </>
  ) : (
    <>
      <section className="hidden md:block sm:relative w-full pb-6">
        {hours && hours?.length > 0 && (
          <div className="relative z-20 px-8 mt-8 max-w-screen-lg mx-auto">
            <h2 className="text-4xl text-center my-8">Hours of Operation</h2>
            <div className="grid sm:grid-cols-2 gap-y-12 gap-x-8 mb-8 p-8 rounded-xl bg-white">
              <div className="row-span-3 col-span-2 -mb-4">
                <iframe
                  title="Google Map of MoVET @ Belleview Station"
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                  src="https://www.google.com/maps/embed/v1/place?q=place_id:ChIJ9aCJc9mHbIcRu0B0dJWB4x8&key=AIzaSyD-8-Mxe05Y1ySHD7XoDcumWt3vjA-URF0"
                  className="w-full h-80 rounded-xl"
                />
                <p className="max-w-lg mx-auto text-center text-sm italic mt-6 md:mt-4">
                  * Parking may be a bit challenging due to construction going
                  on in this area. Please leave ample time before your
                  appointment. You are welcome to pull up to the clinic, drop
                  your pet with us and go find parking.
                </p>
                <a
                  href="https://movetcare.com/parking.png"
                  target="_blank"
                  className="flex flex-row items-center justify-center w-full text-center text-sm text-movet-black mt-8 md:mt-4 font-extrabold hover:text-movet-red duration-300 ease-in-out"
                  rel="noreferrer"
                >
                  <span className="w-6 h-6 mr-2">
                    <FontAwesomeIcon icon={faParking} />
                  </span>
                  <span className="-mt-1">View Parking Map</span>
                </a>
              </div>
              <div>
                <FontAwesomeIcon
                  icon={faHospital}
                  size="3x"
                  className="w-full mb-4 text-movet-red"
                />
                <h3 className="text-xl text-center font-bold pt-2">
                  Clinic @ Belleview Station
                </h3>
                <p className="text-center -mb-1 italic">
                  CURRENTLY{" "}
                  {hoursStatus && hoursStatus.clinicStatus ? (
                    <span className="text-movet-green">OPEN</span>
                  ) : (
                    <span className="text-movet-red">CLOSED</span>
                  )}
                </p>
                <div className="flex py-4 px-2 sm:px-4 leading-6 font-abside text-lg pb-2 whitespace-nowrap uppercase">
                  <div className="w-full">
                    {clinicHours?.map(
                      (hours: { days: string }, index: number) => {
                        return (
                          <div key={hours.days + index} className="flex w-full">
                            <span>{hours.days}</span>
                            <div className="w-full border-b mb-2 mx-4"></div>
                          </div>
                        );
                      }
                    )}
                  </div>
                  <div className="w-max">
                    {clinicHours?.map(
                      (hours: { times: string }, index: number) => {
                        return (
                          <div
                            key={hours.times + index}
                            className="flex w-full"
                          >
                            <span>{hours.times}</span>
                          </div>
                        );
                      }
                    )}
                  </div>
                </div>
              </div>
              <div className="whitespace-nowrap">
                <FontAwesomeIcon
                  icon={faPersonWalking}
                  size="3x"
                  className="w-full mb-4 text-movet-red"
                />
                <h3 className="text-xl text-center font-bold">
                  Walk-Ins @ Belleview Station
                </h3>
                <p className="text-center -mb-1 italic">
                  CURRENTLY{" "}
                  {hoursStatus && hoursStatus.walkinsStatus ? (
                    <span className="text-movet-green">OPEN</span>
                  ) : (
                    <span className="text-movet-red">CLOSED</span>
                  )}
                </p>
                <div className="flex py-4 px-2 sm:px-4 leading-6 font-abside text-lg pb-2 whitespace-nowrap uppercase">
                  <div className="w-full">
                    {clinicWalkInHours?.map(
                      (hours: { days: string }, index: number) => {
                        return (
                          <div key={hours.days + index} className="flex w-full">
                            <span>{hours.days}</span>
                            <div className="w-full border-b mb-2 mx-4"></div>
                          </div>
                        );
                      }
                    )}
                  </div>
                  <div className="w-max">
                    {clinicWalkInHours?.map(
                      (hours: { times: string }, index: number) => {
                        return (
                          <div
                            key={hours.times + index}
                            className="flex w-full"
                          >
                            <span>{hours.times}</span>
                          </div>
                        );
                      }
                    )}
                  </div>
                </div>
              </div>
              <div className="whitespace-nowrap mb-4">
                <FontAwesomeIcon
                  icon={faShop}
                  size="3x"
                  className="w-full mb-4 text-movet-red"
                />
                <h3 className="text-xl text-center font-bold">
                  Boutique @ Belleview Station
                </h3>
                <p className="text-center -mb-1 italic">
                  CURRENTLY{" "}
                  {hoursStatus && hoursStatus.boutiqueStatus ? (
                    <span className="text-movet-green">OPEN</span>
                  ) : (
                    <span className="text-movet-red">CLOSED</span>
                  )}
                </p>
                <div className="flex py-4 px-2 sm:px-4 leading-6 font-abside text-lg pb-2 whitespace-nowrap uppercase">
                  <div className="w-full">
                    {boutiqueHours?.map(
                      (hours: { days: string }, index: number) => {
                        return (
                          <div key={hours.days + index} className="flex w-full">
                            <span>{hours.days}</span>
                            <div className="w-full border-b mb-2 mx-4"></div>
                          </div>
                        );
                      }
                    )}
                  </div>
                  <div className="w-max">
                    {boutiqueHours?.map(
                      (hours: { times: string }, index: number) => {
                        return (
                          <div
                            key={hours.times + index}
                            className="flex w-full"
                          >
                            <span>{hours.times}</span>
                          </div>
                        );
                      }
                    )}
                  </div>
                </div>
              </div>
              <div className="mb-4">
                <FontAwesomeIcon
                  icon={faHouseMedical}
                  size="3x"
                  className="w-full mb-4 text-movet-red"
                />
                <h3 className="text-xl text-center">Housecalls</h3>
                <p className="text-center -mb-1 italic">
                  CURRENTLY{" "}
                  {hoursStatus && hoursStatus.housecallStatus ? (
                    <span className="text-movet-green">OPEN</span>
                  ) : (
                    <span className="text-movet-red">CLOSED</span>
                  )}
                </p>
                {winterMode &&
                winterMode?.isActive &&
                winterMode?.isActiveOnWebsite ? (
                  <p className="text-lg text-center italic mb-2">
                    * {winterMode?.message}
                  </p>
                ) : (
                  <div className="flex py-4 px-2 sm:px-4 leading-6 font-abside text-lg pb-2 whitespace-nowrap uppercase">
                    <div className="w-full">
                      {housecallHours?.map(
                        (hours: { days: string }, index: number) => {
                          return (
                            <div
                              key={hours.days + index}
                              className="flex w-full"
                            >
                              <span>{hours.days}</span>
                              <div className="w-full border-b mb-2 mx-4"></div>
                            </div>
                          );
                        }
                      )}
                    </div>
                    <div className="w-max">
                      {housecallHours?.map(
                        (hours: { times: string }, index: number) => {
                          return (
                            <div
                              key={hours.times + index}
                              className="flex w-full"
                            >
                              <span>{hours.times}</span>
                            </div>
                          );
                        }
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </section>
      <section className="relative md:hidden w-full py-4 mb-8">
        <div className="z-20 px-4 max-w-screen-lg mx-auto">
          <h2 className="text-4xl text-center mb-8">Hours of Operation</h2>
          <div className="flex flex-col justify-center items-center rounded-xl bg-white p-8">
            <div className="sm:px-6">
              <iframe
                title="Google Map of MoVET @ Belleview Station"
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
                src="https://www.google.com/maps/embed/v1/place?q=place_id:ChIJ9aCJc9mHbIcRu0B0dJWB4x8&key=AIzaSyD-8-Mxe05Y1ySHD7XoDcumWt3vjA-URF0"
                className="w-full h-80 rounded-xl"
              />
              <p className="w-full text-center text-sm italic mt-6 md:mt-4">
                * Parking may be a bit challenging due to construction going on
                in this area. Please leave ample time before your appointment.
                You are welcome to pull up to the clinic, drop your pet with us
                and go find parking.
              </p>
              <a
                href="https://movetcare.com/parking.png"
                target="_blank"
                className="flex flex-row items-center justify-center w-full text-center text-sm text-movet-black mt-8 md:mt-4 font-extrabold hover:text-movet-red duration-300 ease-in-out"
                rel="noreferrer"
              >
                <span className="w-6 h-6 mr-2">
                  <FontAwesomeIcon icon={faParking} />
                </span>
                <span>View Parking Map</span>
              </a>
            </div>
            <div className="mt-8 w-full max-w-lg whitespace-nowrap">
              <FontAwesomeIcon
                icon={faHospital}
                size="3x"
                className="w-full mb-4 text-movet-red"
              />
              <h3 className="text-xl text-center font-bold pt-2">
                Clinic @ Belleview Station
              </h3>
              <div className="flex justify-center py-4 px-2 sm:px-4 leading-6 font-abside pb-2 whitespace-nowrap">
                <div className="w-full">
                  {clinicHours?.map(
                    (hours: { days: string }, index: number) => (
                      <div
                        className="flex w-full uppercase"
                        key={hours.days + index}
                      >
                        <span className="whitespace-nowrap">{hours.days}</span>
                        <div className="w-full border-b mb-2 mx-4"></div>
                      </div>
                    )
                  )}
                </div>
                <div className="w-max whitespace-nowrap uppercase">
                  {clinicHours?.map(
                    (hours: { times: string }, index: number) => (
                      <div key={hours.times + index}>{hours.times}</div>
                    )
                  )}
                </div>
              </div>
            </div>
            <div className="w-full max-w-lg whitespace-nowrap mt-8">
              <FontAwesomeIcon
                icon={faPersonWalking}
                size="3x"
                className="w-full mb-4 text-movet-red"
              />
              <h3 className="text-xl text-center font-bold">
                Walk-Ins @ Belleview Station
              </h3>
              <div className="flex justify-center py-4 px-2 sm:px-4 leading-6 font-abside pb-2 whitespace-nowrap uppercase">
                <div className="w-full">
                  {clinicWalkInHours?.map(
                    (hours: { days: string }, index: number) => (
                      <div
                        className="flex w-full uppercase"
                        key={hours.days + index}
                      >
                        <span className="whitespace-nowrap">{hours.days}</span>
                        <div className="w-full border-b mb-2 mx-4"></div>
                      </div>
                    )
                  )}
                </div>
                <div className="w-max whitespace-nowrap uppercase">
                  {clinicWalkInHours?.map(
                    (hours: { times: string }, index: number) => (
                      <div key={hours.times + index}>{hours.times}</div>
                    )
                  )}
                </div>
              </div>
            </div>
            <div className="w-full max-w-lg whitespace-nowrap mt-8">
              <FontAwesomeIcon
                icon={faShop}
                size="3x"
                className="w-full mb-4 text-movet-red"
              />
              <h3 className="text-xl text-center font-bold">
                Boutique @ Belleview Station
              </h3>
              <div className="flex justify-center py-4 px-2 sm:px-4 leading-6 font-abside pb-2 whitespace-nowrap">
                <div className="w-full">
                  {boutiqueHours?.map(
                    (hours: { days: string }, index: number) => (
                      <div
                        className="flex w-full uppercase"
                        key={hours.days + index}
                      >
                        <span className="whitespace-nowrap">{hours.days}</span>
                        <div className="w-full border-b mb-2 mx-4"></div>
                      </div>
                    )
                  )}
                </div>
                <div className="w-max whitespace-nowrap uppercase">
                  {boutiqueHours?.map(
                    (hours: { times: string }, index: number) => (
                      <div key={hours.times + index}>{hours.times}</div>
                    )
                  )}
                </div>
              </div>
            </div>
            <div className="w-full max-w-lg items-center my-8">
              <FontAwesomeIcon
                icon={faHouseMedical}
                size="3x"
                className="w-full mb-4 text-movet-red"
              />
              <h3 className="text-xl text-center">Housecalls</h3>
              {winterMode &&
              winterMode?.isActive &&
              winterMode?.isActiveOnWebsite ? (
                <p className="text-center italic">* {winterMode?.message}</p>
              ) : (
                <div className="flex py-4 px-2 sm:px-4 leading-6 font-abside text-lg pb-2 whitespace-nowrap">
                  <div className="w-full">
                    {housecallHours?.map(
                      (hours: { days: string }, index: number) => (
                        <div
                          className="flex w-full uppercase"
                          key={hours.days + index}
                        >
                          <span className="whitespace-nowrap">
                            {hours.days}
                          </span>
                          <div className="w-full border-b mb-2 mx-4"></div>
                        </div>
                      )
                    )}
                  </div>
                  <div className="w-max whitespace-nowrap uppercase">
                    {housecallHours?.map(
                      (hours: { times: string }, index: number) => (
                        <div key={hours.times + index}>{hours.times}</div>
                      )
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
