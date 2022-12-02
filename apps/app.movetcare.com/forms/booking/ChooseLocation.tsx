import { BookingFooter } from "components/booking/BookingFooter";
import { BookingHeader } from "components/booking/BookingHeader";
import { Loader } from "ui";
import { Fragment, useContext, useEffect, useRef, useState } from "react";
import { Booking } from "types/Booking";
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
import { Dialog, Transition } from "@headlessui/react";
import { PlacesInput } from "components/inputs/PlacesInput";
import { isValidZipcode } from "utilities";
import ErrorMessage from "components/inputs/ErrorMessage";
import { setDoc, doc, serverTimestamp, collection } from "firebase/firestore";
import { firestore } from "services/firebase";
import { Error } from "components/Error";
import TextInput from "components/inputs/TextInput";
import { ClientDataContext } from "contexts/ClientDataContext";
import { GoogleMap } from "@react-google-maps/api";
import { useCollection } from "react-firebase-hooks/firestore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const containerStyle = {
  width: "100%",
  height: "400px",
};

const center = {
  lat: 39.6251,
  lng: -104.90679,
};

export const ChooseLocation = ({
  session,
  setStep,
  isAppMode,
}: {
  session: Booking;
  setStep: any;
  isAppMode: boolean;
}) => {
  const cancelButtonRef = useRef(null);
  const [showExplainer, setShowExplainer] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasAddressError, setHasAddressError] = useState<boolean>(false);
  const [zipcode, setZipcode] = useState<string | null>(null);
  const [errorMessage, setError] = useState<any>(null);
  const [reasonGroups, setReasonGroups] = useState<any>(false);
  const [options, setOptions] = useState<Array<{
    name: string;
    icon: any;
    id: number;
  }> | null>(null);
  const [reasonGroupsData, loadingReasonGroups, errorReasonGroups] =
    useCollection(collection(firestore, "reason_groups"));
  const [defaultHomeAddress, setDefaultHomeAddress] = useState<string | null>(
    null
  );
  const [addressLatLon, setAddressLetLon] = useState<null | {
    lat: number;
    lng: number;
  }>(null);
  const { client, loading, error }: any = useContext(ClientDataContext);
  const {
    handleSubmit,
    watch,
    control,
    setValue,
    formState: { errors, isDirty },
  } = useForm({
    mode: "all",
    defaultValues: {
      location: "Clinic",
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
    if (reasonGroupsData) {
      const reasonGroups: any = [];
      reasonGroupsData.docs.map((doc: any) =>
        doc.data()?.isVisible
          ? reasonGroups.push({
              label: doc.data()?.name,
              value: doc.data()?.id,
            })
          : null
      );
      setReasonGroups(reasonGroups);
    }
  }, [reasonGroupsData]);

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
      setOptions(items.sort((a, b) => a.name.localeCompare(b.name)));
    }
  }, [reasonGroups, session]);

  useEffect(() => {
    if (locationSelection === "Clinic") {
      setValue("address", null);
      setHasAddressError(false);
      setZipcode(null);
    } else if (locationSelection === "Home") {
      if (client?.street)
        setDefaultHomeAddress(
          `${client?.street !== undefined ? client?.street : ""}, ${
            client?.city !== undefined ? client?.city : ""
          }, ${client?.state !== undefined ? client?.state : ""}, ${
            client?.zipCode !== undefined ? client?.zipCode : ""
          }`
        );
    }
  }, [locationSelection, client, error, loading, setValue]);

  useEffect(() => {
    if (zipcode && !isValidZipcode(zipcode)) setHasAddressError(true);
    else setHasAddressError(false);
  }, [zipcode]);

  const onSubmit = async (data: any) => {
    setIsLoading(true);
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
    await setDoc(
      doc(firestore, "bookings", `${session.id}`),
      data.location === "Clinic" || data.location === "Virtually"
        ? {
            location: data.location,
            locationId,
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
            updatedOn: serverTimestamp(),
          },
      { merge: true }
    )
      .then(() =>
        setStep(session.vcprRequired ? "choose-datetime" : "choose-reason")
      )
      .catch((error: any) => {
        setIsLoading(false);
        setError(error);
      });
  };
  return (
    <>
      {isLoading || loadingReasonGroups ? (
        <Loader
          message={
            isLoading ? "Saving Location Selection..." : "Loading Locations..."
          }
        />
      ) : error || errorReasonGroups || errorMessage ? (
        <Error
          error={error || errorReasonGroups || errorMessage}
          isAppMode={isAppMode}
        />
      ) : (
        <>
          <BookingHeader
            isAppMode={isAppMode}
            title="Choose a Location"
            description={"Where would you like to have your appointment?"}
          />
          {options && (
            <form className="mt-8">
              <ToggleInput
                options={options}
                control={control}
                errors={errors}
                name="location"
              />
              <Transition
                show={locationSelection === "Home"}
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
                      defaultValue={defaultHomeAddress}
                      setValue={defaultHomeAddress ? setValue : null}
                      setLatLon={setAddressLetLon}
                      setExternalZipcodeValidation={setZipcode}
                      required
                      className={
                        hasAddressError ? " border-movet-red border-2" : null
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
                show={locationSelection === "Clinic"}
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
                        zoom={13}
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
                show={locationSelection === "Virtually"}
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
                    At MoVET, we offer multiple types of Virtual Consultations:
                  </p>
                  <ul className="text-sm px-8 italic">
                    <li className="my-2">
                      <span className="font-extrabold">Triage</span>: We can
                      offer general advice, but a diagnosis is not rendered, nor
                      can we prescribe medications. Great for new clients to get
                      to know us!
                    </li>
                    <li>
                      <span className="font-extrabold">Telemedicine</span>: We
                      can diagnose, treat and prescribe medication for existing
                      patients non-urgent conditions. Virtual Coaching Sessions:
                      Live virtual demos are a simple and stress-free way to
                      learn how to do procedures for your pet in the comfort of
                      your home.
                      <p className="text-xs italic text-center">
                        * Telemedicine is only available to existing clients
                        with an established VCPR (Veterinarian-Client-Patient
                        Relationship).
                      </p>
                    </li>
                  </ul>
                  <span
                    className="text-center text-gray mt-4 mb-2 flex justify-center items-center text-xs cursor-pointer italic hover:text-movet-brown ease-in-out duration-500"
                    onClick={() => setShowExplainer(!showExplainer)}
                  >
                    <FontAwesomeIcon
                      icon={faInfoCircle}
                      size="lg"
                      className="mr-2 text-movet-brown -mt-1"
                    />
                    What is VCPR?
                  </span>
                  <Transition.Root show={showExplainer} as={Fragment}>
                    <Dialog
                      as="div"
                      className="fixed z-10 inset-0 overflow-y-auto"
                      initialFocus={cancelButtonRef}
                      onClose={() => setShowExplainer(false)}
                    >
                      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <Transition.Child
                          as={Fragment}
                          enter="ease-out duration-500"
                          enterFrom="opacity-0"
                          enterTo="opacity-100"
                          leave="ease-in duration-500"
                          leaveFrom="opacity-100"
                          leaveTo="opacity-0"
                        >
                          <Dialog.Overlay className="fixed inset-0 bg-movet-white bg-opacity-50 transition-opacity" />
                        </Transition.Child>
                        <span
                          className="hidden sm:inline-block sm:align-middle sm:h-screen"
                          aria-hidden="true"
                        >
                          &#8203;
                        </span>
                        <Transition.Child
                          as={Fragment}
                          enter="ease-out duration-300"
                          enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                          enterTo="opacity-100 translate-y-0 sm:scale-100"
                          leave="ease-in duration-200"
                          leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                          leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        >
                          <div className="relative inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
                            {isLoading ? (
                              <Loader />
                            ) : error ? (
                              <Error error={error} />
                            ) : (
                              <>
                                <div className="sm:flex sm:items-start">
                                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10 text-movet-red">
                                    <FontAwesomeIcon
                                      icon={faStethoscope}
                                      size="2x"
                                    />
                                  </div>
                                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                    <Dialog.Title
                                      as="h2"
                                      className="text-xl uppercase leading-6 font-medium mt-0"
                                    >
                                      What is a Veterinarian-Client-Patient
                                      Relationship?
                                    </Dialog.Title>
                                    <div className="mt-6 text-left">
                                      <p>
                                        A Veterinarian-Client-Patient
                                        Relationship (&quot;VCPR&quot;) is
                                        established only when your veterinarian
                                        examines your pet in person, and is
                                        maintained by regular veterinary visits
                                        as needed to monitor your pet&apos;s
                                        health.
                                      </p>
                                      <p>
                                        If a VCPR is established but your
                                        veterinarian does not regularly see your
                                        pet afterward, the VCPR is no longer
                                        valid and it would be illegal (and
                                        unethical) for your veterinarian to
                                        dispense or prescribe medications or
                                        recommend treatment without recently
                                        examining your pet.
                                      </p>
                                      <p>
                                        A valid VCPR cannot be established
                                        online, via email, or over the phone.
                                        However, once a VCPR is established, it
                                        may be able to be maintained between
                                        medically necessary examinations via
                                        telephone or other types of
                                        consultations; but it&apos;s up to your
                                        veterinarian&apos; discretion to
                                        determine if this is appropriate and in
                                        the best interests of your pets&apos;
                                        health.
                                      </p>
                                    </div>
                                  </div>
                                </div>
                                <div className="mt-5 flex flex-col mx-auto justify-center items-center">
                                  <button
                                    type="button"
                                    className="w-full inline-flex justify-center rounded-lg border border-transparent shadow-sm px-4 py-2 bg-movet-black hover:bg-movet-red text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-movet-red sm:ml-3 sm:w-auto sm:text-sm ease-in-out duration-500"
                                    onClick={() => setShowExplainer(false)}
                                  >
                                    CLOSE
                                  </button>
                                </div>
                              </>
                            )}
                          </div>
                        </Transition.Child>
                      </div>
                    </Dialog>
                  </Transition.Root>
                </div>
              </Transition>
              <div className="flex flex-col justify-center items-center mt-8 mb-4">
                <Button
                  type="submit"
                  icon={faArrowRight}
                  disabled={
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
          <BookingFooter session={session} />
        </>
      )}
    </>
  );
};
