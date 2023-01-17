import { BookingFooter } from "components/BookingFooter";
import { BookingHeader } from "components/BookingHeader";
import { Loader, Modal } from "ui";
import { useEffect, useRef, useState } from "react";
import {
  faArrowRight,
  faHospital,
  faHouseMedical,
  faInfoCircle,
  faLaptopMedical,
  faStethoscope,
} from "@fortawesome/free-solid-svg-icons";
import { ToggleInput } from "components/inputs/ToggleInput";
import { useForm } from "react-hook-form";
import { Button } from "ui";
import { Transition } from "@headlessui/react";
import { PlacesInput } from "components/inputs/PlacesInput";
import { isValidZipcode } from "utilities";
import ErrorMessage from "components/inputs/ErrorMessage";
import { functions } from "services/firebase";
import { Error } from "components/Error";
import TextInput from "components/inputs/TextInput";
import { GoogleMap } from "@react-google-maps/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AppHeader } from "components/AppHeader";
import { httpsCallable } from "firebase/functions";
import { useRouter } from "next/router";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { useGoogleMaps } from "providers/GoogleMapsProvider";
import { getWinterMode } from "server";
import type { WinterMode as WinterModeType } from "types";
import getUrlQueryStringFromObject from "utilities/src/getUrlQueryStringFromObject";

const containerStyle = {
  width: "100%",
  height: "288px",
};

const center = {
  lat: 39.6251,
  lng: -104.90679,
};

export async function getStaticProps() {
  return {
    props: {
      winterMode: (await getWinterMode()) || null,
    },
  };
}

export default function LocationSelection({
  winterMode,
}: {
  winterMode: WinterModeType;
}) {
  const router = useRouter();
  const { isLoaded } = useGoogleMaps();
  const { mode, housecallRequest } = router.query || {};
  const isAppMode = mode === "app";
  const isHousecallRequest = Boolean(Number(housecallRequest));
  const [loadingMessage, setLoadingMessage] =
    useState<string>("Loading Session...");
  const [session, setSession] = useState<any>();
  const { executeRecaptcha } = useGoogleReCaptcha();
  const cancelButtonRef = useRef(null);
  const [showExplainer, setShowExplainer] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasAddressError, setHasAddressError] = useState<boolean>(false);
  const [zipcode, setZipcode] = useState<string | null>(null);
  const [error, setError] = useState<any>(null);
  const [reasonGroups, setReasonGroups] = useState<any>(false);
  const [options, setOptions] = useState<Array<{
    name: string;
    icon: any;
    id: number;
  }> | null>(null);
  const [addressLatLon, setAddressLetLon] = useState<null | {
    lat: number;
    lng: number;
  }>(null);
  const {
    handleSubmit,
    watch,
    control,
    formState: { errors, isDirty },
  } = useForm({
    mode: "all",
    defaultValues: {
      location: isHousecallRequest ? "Home" : "Clinic",
      address: null,
      info: "",
    },
  });

  const locationSelection = watch("location");
  const addressSelection = watch("address");

  const mapOptions = {
    zoomControl: true,
    mapTypeControl: false,
    scaleControl: false,
    streetViewControl: false,
    rotateControl: false,
    fullscreenControl: false,
    panControl: false,
    scrollwheel: false,
    gestureHandling: "none",
  };

  useEffect(() => {
    const fetchLocations = async () => {
      const { data: result }: any = await httpsCallable(
        functions,
        "getAppointmentLocations"
      )();
      if (result?.error !== true || result?.error === undefined) {
        setReasonGroups(result);
      } else setError(result);
    };
    fetchLocations();
  }, []);

  useEffect(() => {
    if (reasonGroups && session) {
      const items: Array<{
        name: string;
        icon: any;
        id: number;
      }> = [];
      reasonGroups.map(({ label, id }: { label: string; id: number }) => {
        if (label.toLowerCase().includes("clinic")) {
          items.push({ name: "Clinic", icon: faHospital, id });
        } else if (label.toLowerCase().includes("housecall")) {
          if (winterMode?.isActive && winterMode?.isActiveOnWebApp) {
            if (
              winterMode?.enableForNewPatientsOnly &&
              session.establishCareExamRequired
            )
              console.log("WINTER MODE ACTIVE FOR NEW PATIENTS");
            else if (!winterMode?.enableForNewPatientsOnly)
              console.log("WINTER MODE ACTIVE FOR ALL PATIENTS");
            else
              items.push({
                name: "Home",
                icon: faHouseMedical,
                id,
              });
          } else
            items.push({
              name: "Home",
              icon: faHouseMedical,
              id,
            });
        } else if (
          label.toLowerCase().includes("virtual")
          // && !session?.vcprRequired
        ) {
          items.push({ name: "Virtually", icon: faLaptopMedical, id });
        }
      });
      setOptions(
        items.sort((a, b) => {
          return a.name.localeCompare(b.name);
        })
      );
    }
  }, [reasonGroups, session, winterMode]);

  useEffect(() => {
    if (zipcode && !isValidZipcode(zipcode)) setHasAddressError(true);
    else setHasAddressError(false);
  }, [zipcode]);

  useEffect(() => {
    if (window.localStorage.getItem("bookingSession") !== null && router) {
      setSession(
        JSON.parse(window.localStorage.getItem("bookingSession") as string)
      );
      if (isLoaded) setIsLoading(false);
      else if (!isLoaded && !isLoading) setIsLoading(true);
    } else router.push("/schedule-an-appointment");
  }, [router, isLoaded, isLoading]);
  const handleError = (error: any) => {
    console.error(error);
    setError(error);
    setIsLoading(false);
  };
  const onSubmit = async (data: any) => {
    setIsLoading(true);
    setLoadingMessage("Processing, please wait...");
    let locationId = null;
    reasonGroups.forEach(
      ({ label, value }: { label: string; value: number }) => {
        if (
          (data.location.toLowerCase().includes("clinic") &&
            label.toLowerCase().includes("clinic")) ||
          (data.location.toLowerCase().includes("home") &&
            label.toLowerCase().includes("house")) ||
          (data.location.toLowerCase().includes("virtual") &&
            label.toLowerCase().includes("virtual"))
        ) {
          locationId = value;
        }
      }
    );
    if (executeRecaptcha) {
      const token = await executeRecaptcha("booking");
      console.log("data", data);
      if (token) {
        try {
          const { data: result }: any = await httpsCallable(
            functions,
            "scheduleAppointment"
          )(
            data.location === "Clinic" || data.location === "Virtually"
              ? {
                  location: data.location,
                  locationId,
                  id: session?.id,
                  device: navigator.userAgent,
                  token,
                }
              : {
                  location: data.location,
                  locationId,
                  address: {
                    full: data.address?.value?.description,
                    parts: data.address?.value?.terms?.map((term: any) =>
                      term?.value !== undefined ? term?.value : term.long_name
                    ),
                    placeId: data.address?.value?.place_id,
                    info: data.info,
                    zipcode,
                  },
                  id: session?.id,
                  device: navigator.userAgent,
                  token,
                }
          );
          if (result?.error !== true || result?.error === undefined) {
            setLoadingMessage("Almost finished...");
            if (result?.client?.uid && result?.id) {
              window.localStorage.setItem(
                "bookingSession",
                JSON.stringify(result)
              );
              const queryString = getUrlQueryStringFromObject(router.query);
              if (result.establishCareExamRequired)
                router.push(
                  "/schedule-an-appointment/datetime-selection" +
                    (queryString ? queryString : "")
                );
              else
                router.push(
                  "/schedule-an-appointment/reason-selection" +
                    (queryString ? queryString : "")
                );
            } else handleError(result);
          } else handleError(result);
        } catch (error) {
          handleError(error);
        }
      }
    } else handleError({ message: "FAILED CAPTCHA" });
  };
  return (
    <section className="w-full flex-1">
      <AppHeader />
      <div
        className={`flex items-center justify-center bg-white rounded-xl max-w-xl mx-auto${
          !isAppMode ? " p-4 mb-4 sm:p-8" : ""
        }`}
      >
        <div className={isAppMode ? "px-4 mb-8" : ""}>
          <section className="relative mx-auto">
            {isLoading && !isLoaded ? (
              <Loader
                message={isLoaded ? loadingMessage : "Loading Please Wait..."}
                isAppMode={isAppMode}
              />
            ) : error ? (
              <Error error={error} isAppMode={isAppMode} />
            ) : (
              <>
                <BookingHeader
                  isAppMode={isAppMode}
                  title="Choose a Location"
                  description={"Where would you like to have your appointment?"}
                />
                {options && (
                  <form className={isHousecallRequest ? "" : "mt-8"}>
                    {!isHousecallRequest && (
                      <ToggleInput
                        options={options}
                        control={control}
                        errors={errors}
                        name="location"
                      />
                    )}
                    <Transition
                      show={locationSelection === "Home" || isHousecallRequest}
                      enter="transition ease-in duration-500"
                      leave="transition ease-out"
                      leaveTo="opacity-0"
                      enterFrom="opacity-0"
                      enterTo="opacity-100"
                      leaveFrom="opacity-100"
                    >
                      <>
                        <div className="flex rounded-lg border-2 border-movet-brown mt-8 mb-8 p-1">
                          <div className="flex w-full h-72 mx-auto">
                            <GoogleMap
                              mapContainerStyle={containerStyle}
                              options={mapOptions}
                              center={(addressLatLon as any) || center}
                              zoom={addressLatLon ? 17 : 8.5}
                            />
                          </div>
                        </div>
                        <>
                          <PlacesInput
                            label="Home Address"
                            name="address"
                            placeholder="Search for an address"
                            errors={errors}
                            control={control}
                            setValue={null}
                            setLatLon={setAddressLetLon}
                            setExternalZipcodeValidation={setZipcode}
                            required
                            className={
                              hasAddressError
                                ? " border-movet-red border-2"
                                : null
                            }
                            types={["street_address", "street_number"]}
                          />
                          {hasAddressError && (
                            <div className="mb-8">
                              <ErrorMessage errorMessage="MoVET does not currently service this area. Please enter a new address that is in (or near) the Denver Metro area." />
                            </div>
                          )}
                          <TextInput
                            label="Additional Info"
                            name="info"
                            control={control}
                            errors={errors}
                            placeholder="Apartment #, Door Code(s), Parking Options/Locations, etc."
                            multiline
                            numberOfLines={2}
                            className="my-4"
                          />
                        </>
                      </>
                    </Transition>
                    <Transition
                      show={
                        locationSelection === "Clinic" && !isHousecallRequest
                      }
                      enter="transition ease-in duration-500"
                      leave="transition ease-out"
                      leaveTo="opacity-0"
                      enterFrom="opacity-0"
                      enterTo="opacity-100"
                      leaveFrom="opacity-100"
                    >
                      <div className="flex flex-col w-full mx-auto">
                        <div className="flex rounded-lg border-2 border-movet-brown m-4 mt-8 p-1">
                          <div className="w-full h-72 mx-auto">
                            <GoogleMap
                              mapContainerStyle={containerStyle}
                              options={mapOptions}
                              center={center}
                              zoom={19}
                            />
                          </div>
                        </div>
                        <h2 className="mb-0 mt-8 text-center">
                          MoVET @ Belleview Station
                        </h2>
                        {!isAppMode ? (
                          <a
                            href="https://goo.gl/maps/bRjYuF66CtemGSyq8"
                            target="_blank"
                            className="text-center hover:underline text-movet-brown mt-1"
                            rel="noreferrer"
                          >
                            4912 S Newport St, Denver CO 80237
                          </a>
                        ) : (
                          <p className="text-center">
                            4912 S Newport St, Denver CO 80237
                          </p>
                        )}
                      </div>
                    </Transition>
                    <Transition
                      show={
                        locationSelection === "Virtually" && !isHousecallRequest
                      }
                      enter="transition ease-in duration-500"
                      leave="transition ease-out"
                      leaveTo="opacity-0"
                      enterFrom="opacity-0"
                      enterTo="opacity-100"
                      leaveFrom="opacity-100"
                    >
                      <div className="flex flex-col w-full mx-auto sm:px-4">
                        <FontAwesomeIcon
                          icon={faLaptopMedical}
                          size="4x"
                          className="mt-8 text-movet-brown"
                        />
                        <h2 className="mb-0 mt-4 text-center">
                          What can I expect in a Virtual Consultation?
                        </h2>
                        <p className="text-center font-bold">
                          At MoVET, we offer multiple types of Virtual
                          Consultations:
                        </p>
                        <ul className="text-sm px-8 italic">
                          <li className="my-2">
                            <span className="font-extrabold">Triage</span>: We
                            can offer general advice, but a diagnosis is not
                            rendered, nor can we prescribe medications. Great
                            for new clients to get to know us!
                          </li>
                          <li>
                            <span className="font-extrabold">Telemedicine</span>
                            : We can diagnose, treat and prescribe medication
                            for existing patients non-urgent conditions. Virtual
                            Coaching Sessions: Live virtual demos are a simple
                            and stress-free way to learn how to do procedures
                            for your pet in the comfort of your home.
                            <p className="text-xs italic text-center">
                              * Telemedicine is only available to existing
                              clients with an established VCPR
                              (Veterinarian-Client-Patient Relationship).
                            </p>
                          </li>
                        </ul>
                        <p
                          className="text-center text-gray mt-4 mb-2 flex justify-center items-center text-xs cursor-pointer italic hover:text-movet-brown ease-in-out duration-500"
                          onClick={() => setShowExplainer(!showExplainer)}
                        >
                          <FontAwesomeIcon
                            icon={faInfoCircle}
                            size="lg"
                            className="mr-2 text-movet-brown -mt-1"
                          />
                          What is VCPR?
                        </p>
                        <Modal
                          showModal={showExplainer}
                          setShowModal={setShowExplainer}
                          cancelButtonRef={cancelButtonRef}
                          isLoading={isLoading}
                          error={error ? <Error message={error} /> : undefined}
                          content={
                            <>
                              <p>
                                A Veterinarian-Client-Patient Relationship
                                (&quot;VCPR&quot;) is established only when your
                                veterinarian examines your pet in person, and is
                                maintained by regular veterinary visits as
                                needed to monitor your pet&apos;s health.
                              </p>
                              <p>
                                If a VCPR is established but your veterinarian
                                does not regularly see your pet afterward, the
                                VCPR is no longer valid and it would be illegal
                                (and unethical) for your veterinarian to
                                dispense or prescribe medications or recommend
                                treatment without recently examining your pet.
                              </p>
                              <p>
                                A valid VCPR cannot be established online, via
                                email, or over the phone. However, once a VCPR
                                is established, it may be able to be maintained
                                between medically necessary examinations via
                                telephone or other types of consultations; but
                                it&apos;s up to your veterinarian&apos;
                                discretion to determine if this is appropriate
                                and in the best interests of your pets&apos;
                                health.
                              </p>
                            </>
                          }
                          title="What is a Veterinarian-Client-Patient Relationship?"
                          icon={faStethoscope}
                        />
                      </div>
                    </Transition>
                    <div className="flex flex-col justify-center items-center mt-8 mb-4">
                      <Button
                        type="submit"
                        icon={faArrowRight}
                        disabled={
                          (locationSelection === "Clinic" &&
                            isHousecallRequest &&
                            (addressSelection === null || hasAddressError)) ||
                          (locationSelection !== "Clinic" && !isDirty) ||
                          (locationSelection === "Home" &&
                            addressSelection === null) ||
                          (locationSelection === "Home" && hasAddressError)
                        }
                        iconSize={"sm"}
                        color="black"
                        text="Continue"
                        onClick={handleSubmit(onSubmit)}
                      />
                    </div>
                  </form>
                )}
                <BookingFooter />
              </>
            )}
          </section>
        </div>
      </div>
    </section>
  );
}
