import { BookingFooter } from "components/booking/BookingFooter";
import { BookingHeader } from "components/booking/BookingHeader";
import { Loader } from "ui";
import { useContext, useEffect, useState } from "react";
import { Booking } from "types/Booking";
import {
  faArrowRight,
  faHospital,
  faHome,
  faHeadset,
  faMapPin,
  //faExclamationTriangle,
} from "@fortawesome/free-solid-svg-icons";
import { ToggleInput } from "components/inputs/ToggleInput";
import { useForm } from "react-hook-form";
import { Button } from "ui";
import GoogleMapReact from "google-map-react";
import { Transition } from "@headlessui/react";
import { PlacesInput } from "components/inputs/PlacesInput";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { isValidZipcode } from "utilities";
import ErrorMessage from "components/inputs/ErrorMessage";
import { setDoc, doc, serverTimestamp } from "firebase/firestore";
import { firestore } from "services/firebase";
import { Error } from "components/Error";
// import toast from 'react-hot-toast';
import TextInput from "components/inputs/TextInput";
import { ClientDataContext } from "contexts/ClientDataContext";

export const ChooseLocation = ({
  session,
  isAppMode,
}: {
  session: Booking;
  isAppMode: boolean;
}) => {
  const googleMapConfig = {
    key: "AIzaSyD-8-Mxe05Y1ySHD7XoDcumWt3vjA-URF0",
    language: "en",
    region: "en",
    libraries: ["places"],
  };
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
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [mapIsLoaded, setMapIsLoaded] = useState<boolean>(false);
  const [hasAddressError, setHasAddressError] = useState<boolean>(false);
  const [zipcode, setZipcode] = useState<string | null>(null);
  const [errorMessage, setError] = useState<any>(null);
  const [defaultHomeAddress, setDefaultHomeAddress] = useState<string | null>(
    null
  );
  const [addressLatLon, setAddressLetLon] = useState<null | {
    lat: number;
    lng: number;
  }>({
    lat: 39.6252378,
    lng: -104.9067691,
  });
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
    await setDoc(
      doc(firestore, "bookings", `${session.id}`),
      data.location === "Clinic" || data.location === "Virtually"
        ? {
            location: data.location,
          }
        : {
            location: data.location,
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
      // .then(() =>
      //   toast('END OF DEMO', {
      //     icon: (
      //       <FontAwesomeIcon
      //         icon={faExclamationTriangle}
      //         size="2x"
      //         className="text-movet-red"
      //       />
      //     ),
      //     position: 'top-center',
      //     duration: 10000,
      //   })
      // )
      .catch((error: any) => {
        setIsLoading(false);
        setError(error);
      });
  };
  return (
    <>
      {isLoading || loading ? (
        <Loader />
      ) : errorMessage || error ? (
        <Error
          errorMessage={
            errorMessage?.message || error?.message || "Unknown Error"
          }
        />
      ) : (
        <>
          <BookingHeader
            isAppMode={isAppMode}
            title="Choose a Location"
            description={"Where would you like to have your appointment?"}
          />
          <form className="mt-8">
            {session?.vcprRequired ? (
              <ToggleInput
                options={[
                  { name: "Clinic", icon: faHospital },
                  { name: "Home", icon: faHome },
                ]}
                control={control}
                errors={errors}
                name="location"
              />
            ) : (
              <ToggleInput
                options={[
                  { name: "Clinic", icon: faHospital },
                  { name: "Home", icon: faHome },
                  { name: "Virtually", icon: faHeadset },
                ]}
                control={control}
                errors={errors}
                name="location"
              />
            )}
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
                    <GoogleMapReact
                      options={mapOptions}
                      bootstrapURLKeys={googleMapConfig}
                      center={addressLatLon as any}
                      zoom={
                        addressLatLon?.lat === 39.6252378 &&
                        addressLatLon?.lng === -104.9067691
                          ? 8.5
                          : 13
                      }
                      onGoogleApiLoaded={() => setMapIsLoaded(true)}
                      yesIWantToUseGoogleMapApiInternals
                    >
                      {addressLatLon?.lat !== 39.6252378 &&
                        addressLatLon?.lng !== -104.9067691 && (
                          <div
                            style={{
                              position: "absolute",
                              width: 200,
                              height: 30,
                              left: -200 / 2,
                              top: -72 / 2,
                              textAlign: "center",
                            }}
                          >
                            <FontAwesomeIcon
                              icon={faMapPin}
                              size="3x"
                              className="text-movet-red"
                            />
                          </div>
                        )}
                    </GoogleMapReact>
                  </div>
                </div>
                {mapIsLoaded && (
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
                      <ErrorMessage errorMessage="MoVET does not currently service this area. Please enter a new address that is in (or near) the Denver Metro area." />
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
                )}
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
                    <GoogleMapReact
                      bootstrapURLKeys={googleMapConfig}
                      options={mapOptions}
                      center={{
                        lat: 39.6252378,
                        lng: -104.9067691,
                      }}
                      zoom={10}
                    >
                      <div
                        style={{
                          position: "absolute",
                          width: 200,
                          height: 30,
                          left: -200 / 2,
                          top: -72 / 2,
                          textAlign: "center",
                        }}
                      >
                        <FontAwesomeIcon
                          icon={faMapPin}
                          size="3x"
                          className="text-movet-red"
                        />
                      </div>
                    </GoogleMapReact>
                  </div>
                </div>
                <h2 className="mb-0 mt-2 text-center">
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
            <div className="flex flex-col justify-center items-center mt-8 mb-4">
              <Button
                type="submit"
                icon={faArrowRight}
                disabled={
                  (locationSelection !== "Clinic" && !isDirty) ||
                  (locationSelection === "Home" && addressSelection === null) ||
                  (locationSelection === "Home" && hasAddressError)
                }
                iconSize={"sm"}
                color="black"
                text="Continue"
                onClick={handleSubmit(onSubmit)}
              />
            </div>
          </form>
          <BookingFooter session={session} />
        </>
      )}
    </>
  );
};
