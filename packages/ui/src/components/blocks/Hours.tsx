import { faParking } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { WinterMode as WinterModeType } from "types";
import Image from "next/image";

export const Hours = ({
  winterMode,
  embed = false,
}: {
  winterMode: WinterModeType;
  embed?: boolean;
}) =>
  embed ? (
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
          {/* <h3 className="font-abside text-center mb-8 -mt-4 italic text-sm w-full sm:w-2/3 mx-auto">
          * Our clinic will be closed from December 23rd - January 3rd. Our
          Boutique will stay open December 27 - 29.
        </h3> */}
          <div className="grid sm:grid-cols-2 gap-y-12 gap-x-8 mb-12">
            <div className="w-full max-w-lg">
              <h3 className="text-xl text-center font-bold pt-2">
                MoVET @ Belleview Station
              </h3>
              <div className="flex py-4 px-2 sm:px-4 leading-6 font-abside text-lg pb-2 whitespace-nowrap">
                <div className="w-full">
                  <div className="flex w-full">
                    <span className="whitespace-nowrap">MON - FRI</span>
                    <div className="w-full border-b mb-2 mx-4"></div>
                  </div>
                  <div className="flex w-full">
                    <span className="whitespace-nowrap">SAT & SUN</span>
                    <div className="w-full border-b mb-2 mx-4"></div>
                  </div>
                </div>
                <div className="w-max whitespace-nowrap">
                  <div>9 AM TO 5 PM</div>
                  <div>CLOSED</div>
                </div>
              </div>
            </div>
            <div className="sm:row-span-3 sm:px-6">
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
                <span className="-mt-1">View Parking Map</span>
              </a>
            </div>
            <div className="w-full max-w-lg  whitespace-nowrap">
              <h3 className="text-xl text-center font-bold">
                Clinic Walk-In Hours
              </h3>
              <div className="flex py-4 px-2 sm:px-4 leading-6 font-abside text-lg pb-2 whitespace-nowrap">
                <div className="w-full">
                  <div className="flex w-full">
                    <span>TUESDAY</span>
                    <div className="w-full border-b mb-2 mx-4"></div>
                  </div>
                  <div className="flex w-full">
                    <span>THURSDAY</span>
                    <div className="w-full border-b mb-2 mx-4"></div>
                  </div>
                </div>
                <div className="w-max">
                  <div>9AM - NOON & 2 - 4PM</div>
                  <div>9AM - NOON & 2 - 4PM</div>
                </div>
              </div>
            </div>
            <div className="w-full max-w-lg items-center">
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
                    <div className="flex w-full">
                      <span className="whitespace-nowrap">MONDAY</span>
                      <div className="w-full border-b mb-2 mx-4"></div>
                    </div>
                    <div className="flex w-full">
                      <span className="whitespace-nowrap">WEDNESDAY</span>
                      <div className="w-full border-b mb-2 mx-4"></div>
                    </div>
                    <div className="flex w-full">
                      <span className="whitespace-nowrap">FRIDAY</span>
                      <div className="w-full border-b mb-2 mx-4"></div>
                    </div>
                  </div>
                  <div className="w-max">
                    <div className="whitespace-nowrap">MORNINGS</div>
                    <div className="whitespace-nowrap">AFTERNOONS</div>
                    <div className="whitespace-nowrap">MORNINGS</div>
                  </div>
                </div>
              )}
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
      <section className="relative sm:hidden w-full bg-movet-brown text-white py-4 -mt-8">
        <div className="z-20 py-12 px-8 max-w-screen-lg mx-auto">
          <h2 className="text-3xl sm:text-4xl text-center font-extrabold tracking-tight text-movet-white -mt-4 mb-12">
            Hours of Operation
          </h2>
          {/* <h3 className="font-abside text-center mb-4 -mt-4 italic text-sm ">
          * Our clinic will be closed from December 23rd - January 3rd. Our
          Boutique will stay open December 27 - 29.
        </h3> */}
          <div className="flex flex-col justify-center items-center mb-12">
            <div className="w-full max-w-lg">
              <h3 className="text-xl text-center font-bold pt-2">
                MoVET @ Belleview Station
              </h3>
              <div className="flex justify-center py-4 px-2 sm:px-4 leading-6 font-abside pb-2 whitespace-nowrap">
                <div className="w-full">
                  <div className="flex w-full">
                    <span className="whitespace-nowrap">MON - FRI</span>
                    <div className="w-full border-b mb-2 mx-4"></div>
                  </div>
                  <div className="flex w-full">
                    <span className="whitespace-nowrap">SAT & SUN</span>
                    <div className="w-full border-b mb-2 mx-4"></div>
                  </div>
                </div>
                <div className="w-max whitespace-nowrap">
                  <div>9 AM TO 5 PM</div>
                  <div>CLOSED</div>
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
                Clinic Walk-In Hours
              </h3>
              <div className="flex justify-center py-4 px-2 sm:px-4 leading-6 font-abside pb-2 whitespace-nowrap">
                <div className="w-full text-sm sm:text-base">
                  <div className="flex w-full">
                    <span>TUESDAY</span>
                    <div className="w-full border-b mb-2 mx-4"></div>
                  </div>
                  <div className="flex w-full">
                    <span>THURSDAY</span>
                    <div className="w-full border-b mb-2 mx-4"></div>
                  </div>
                </div>
                <div className="w-full text-sm sm:text-base">
                  <div>9AM - NOON & 2 - 4 PM</div>
                  <div>9AM - NOON & 2 - 4 PM</div>
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
                    <div className="flex w-full">
                      <span className="whitespace-nowrap">MONDAY</span>
                      <div className="w-full border-b mb-2 mx-4"></div>
                    </div>
                    <div className="flex w-full">
                      <span className="whitespace-nowrap">WEDNESDAY</span>
                      <div className="w-full border-b mb-2 mx-4"></div>
                    </div>
                    <div className="flex w-full">
                      <span className="whitespace-nowrap">FRIDAY</span>
                      <div className="w-full border-b mb-2 mx-4"></div>
                    </div>
                  </div>
                  <div className="w-max">
                    <div className="whitespace-nowrap">MORNINGS</div>
                    <div className="whitespace-nowrap">AFTERNOONS</div>
                    <div className="whitespace-nowrap">MORNINGS</div>
                  </div>
                </div>
              )}
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
        <div className="relative z-20 px-8 mt-8 max-w-screen-lg mx-auto">
          <h2 className="text-4xl text-center my-8">Hours of Operation</h2>
          {/* <h3 className="font-abside text-center mb-8 -mt-4 italic text-sm w-full sm:w-2/3 mx-auto">
          * Our clinic will be closed from December 23rd - January 3rd. Our
          Boutique will stay open December 27 - 29.
        </h3> */}
          <div className="grid sm:grid-cols-2 gap-y-12 gap-x-8 mb-8 p-8 rounded-xl bg-white">
            <div className="w-full max-w-lg">
              <h3 className="text-xl text-center font-bold pt-2">
                MoVET @ Belleview Station
              </h3>
              <div className="flex py-4 px-2 sm:px-4 leading-6 font-abside text-lg pb-2 whitespace-nowrap">
                <div className="w-full">
                  <div className="flex w-full">
                    <span className="whitespace-nowrap">MON - FRI</span>
                    <div className="w-full border-b mb-2 mx-4"></div>
                  </div>
                  <div className="flex w-full">
                    <span className="whitespace-nowrap">SAT & SUN</span>
                    <div className="w-full border-b mb-2 mx-4"></div>
                  </div>
                </div>
                <div className="w-max whitespace-nowrap">
                  <div>9 AM TO 5 PM</div>
                  <div>CLOSED</div>
                </div>
              </div>
            </div>
            <div className="sm:row-span-3 sm:px-6">
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
                <span className="-mt-1">View Parking Map</span>
              </a>
            </div>
            <div className="w-full max-w-lg  whitespace-nowrap">
              <h3 className="text-xl text-center font-bold">
                Clinic Walk-In Hours
              </h3>
              <div className="flex py-4 px-2 sm:px-4 leading-6 font-abside text-lg pb-2 whitespace-nowrap">
                <div className="w-full">
                  <div className="flex w-full">
                    <span>TUESDAY</span>
                    <div className="w-full border-b mb-2 mx-4"></div>
                  </div>
                  <div className="flex w-full">
                    <span>THURSDAY</span>
                    <div className="w-full border-b mb-2 mx-4"></div>
                  </div>
                </div>
                <div className="w-max">
                  <div>9AM - NOON & 2 - 4PM</div>
                  <div>9AM - NOON & 2 - 4PM</div>
                </div>
              </div>
            </div>
            <div className="w-full max-w-lg items-center">
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
                    <div className="flex w-full">
                      <span className="whitespace-nowrap">MONDAY</span>
                      <div className="w-full border-b mb-2 mx-4"></div>
                    </div>
                    <div className="flex w-full">
                      <span className="whitespace-nowrap">WEDNESDAY</span>
                      <div className="w-full border-b mb-2 mx-4"></div>
                    </div>
                    <div className="flex w-full">
                      <span className="whitespace-nowrap">FRIDAY</span>
                      <div className="w-full border-b mb-2 mx-4"></div>
                    </div>
                  </div>
                  <div className="w-max">
                    <div className="whitespace-nowrap">MORNINGS</div>
                    <div className="whitespace-nowrap">AFTERNOONS</div>
                    <div className="whitespace-nowrap">MORNINGS</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
      <section className="relative md:hidden w-full py-4 mb-8">
        <div className="z-20 px-4 max-w-screen-lg mx-auto">
          <h2 className="text-4xl text-center mb-8">Hours of Operation</h2>
          {/* <h3 className="font-abside text-center mb-4 -mt-4 italic text-sm ">
          * Our clinic will be closed from December 23rd - January 3rd. Our
          Boutique will stay open December 27 - 29.
        </h3> */}
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
              <h3 className="text-xl text-center font-bold pt-2">
                MoVET @ Belleview Station
              </h3>
              <div className="flex justify-center py-4 px-2 sm:px-4 leading-6 font-abside pb-2 whitespace-nowrap">
                <div className="w-full">
                  <div className="flex w-full">
                    <span className="whitespace-nowrap">MON - FRI</span>
                    <div className="w-full border-b mb-2 mx-4"></div>
                  </div>
                  <div className="flex w-full">
                    <span className="whitespace-nowrap">SAT & SUN</span>
                    <div className="w-full border-b mb-2 mx-4"></div>
                  </div>
                </div>
                <div className="w-max whitespace-nowrap">
                  <div>9 AM TO 5 PM</div>
                  <div>CLOSED</div>
                </div>
              </div>
            </div>
            <div className="w-full max-w-lg whitespace-nowrap mt-8">
              <h3 className="text-xl text-center font-bold">
                Clinic Walk-In Hours
              </h3>
              <div className="flex justify-center py-4 px-2 sm:px-4 leading-6 font-abside pb-2 whitespace-nowrap">
                <div className="w-full text-sm sm:text-base">
                  <div className="flex w-full">
                    <span>TUESDAY</span>
                    <div className="w-full border-b mb-2 mx-4"></div>
                  </div>
                  <div className="flex w-full">
                    <span>THURSDAY</span>
                    <div className="w-full border-b mb-2 mx-4"></div>
                  </div>
                </div>
                <div className="w-full text-sm sm:text-base">
                  <div>9AM - NOON & 2 - 4 PM</div>
                  <div>9AM - NOON & 2 - 4 PM</div>
                </div>
              </div>
            </div>
            <div className="w-full max-w-lg items-center my-8">
              <h3 className="text-xl text-center">Housecalls</h3>
              {winterMode &&
              winterMode?.isActive &&
              winterMode?.isActiveOnWebsite ? (
                <p className="text-center italic">* {winterMode?.message}</p>
              ) : (
                <div className="flex py-4 px-2 sm:px-4 leading-6 font-abside text-lg pb-2 whitespace-nowrap">
                  <div className="w-full">
                    <div className="flex w-full">
                      <span className="whitespace-nowrap">MONDAY</span>
                      <div className="w-full border-b mb-2 mx-4"></div>
                    </div>
                    <div className="flex w-full">
                      <span className="whitespace-nowrap">WEDNESDAY</span>
                      <div className="w-full border-b mb-2 mx-4"></div>
                    </div>
                    <div className="flex w-full">
                      <span className="whitespace-nowrap">FRIDAY</span>
                      <div className="w-full border-b mb-2 mx-4"></div>
                    </div>
                  </div>
                  <div className="w-max">
                    <div className="whitespace-nowrap">MORNINGS</div>
                    <div className="whitespace-nowrap">AFTERNOONS</div>
                    <div className="whitespace-nowrap">MORNINGS</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
