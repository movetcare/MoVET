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
} from "@fortawesome/free-solid-svg-icons";
import { ToggleInput } from "components/inputs/ToggleInput";
import { useForm } from "react-hook-form";
import { Button } from "ui";
import { Transition } from "@headlessui/react";
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
  isAppMode,
}: {
  session: Booking;
  isAppMode: boolean;
}) => {
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
          items.push({ name: "Home", icon: faHome, id });
        } else if (
          label.toLowerCase().includes("virtual")
          // && !session?.vcprRequired
        ) {
          items.push({ name: "Virtually", icon: faHeadset, id });
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
    ).catch((error: any) => {
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
