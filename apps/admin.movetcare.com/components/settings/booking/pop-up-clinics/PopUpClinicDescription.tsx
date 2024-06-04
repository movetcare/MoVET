import {
  faCheck,
  faCircleExclamation,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { firestore } from "services/firebase";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { Switch, Transition } from "@headlessui/react";
import Error from "../../../Error";
import TextInput from "components/inputs/TextInput";
import { PlacesInput } from "components/inputs/PlacesInput";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { object, string, lazy } from "yup";
import kebabCase from "lodash.kebabcase";
import { Button, ErrorMessage, Loader } from "ui";
import { classNames, environment, isValidZipcode } from "utilities";
import type { ClinicConfig } from "types";
import { GoogleMap } from "@react-google-maps/api";
import { useGoogleMaps } from "providers/GoogleMapsProvider";

const containerStyle = {
  width: "100%",
  height: "288px",
};

const center = {
  lat: 39.6251,
  lng: -104.90679,
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

export const PopUpClinicDescription = ({
  configuration,
  popUpClinics,
}: {
  configuration: ClinicConfig;
  popUpClinics: any;
}) => {
  const [error, setError] = useState<any>(null);
  const [addressLatLon, setAddressLetLon] = useState<null | {
    lat: number;
    lng: number;
  }>(null);
  const { isLoaded, loadError } = useGoogleMaps();
  const [hasAddressError, setHasAddressError] = useState<boolean>(false);
  const [zipcode, setZipcode] = useState<string | null>(
    `${configuration?.zipcode}` || null,
  );
  const [remoteLocation, setRemoteLocation] = useState<boolean>(
    configuration?.remoteLocation || false,
  );
  const [didTouchRemoteLocation, setDidTouchRemoteLocation] =
    useState<boolean>(false);
  useEffect(() => {
    if (zipcode && !isValidZipcode(zipcode)) setHasAddressError(true);
    else setHasAddressError(false);
  }, [zipcode]);

  const {
    handleSubmit,
    control,
    reset,
    watch,
    formState: { errors, isDirty },
  } = useForm({
    mode: "onSubmit",
    resolver: yupResolver(
      object().shape({
        name: string().required("A clinic name is required"),
        description: string().required(
          "A description for the pop up clinic is required",
        ),
        address: lazy((value: any) =>
          typeof value === "object" && !Array.isArray(value) && value !== null
            ? object()
            : string(),
        ),
        addressInfo: string(),
      }),
    ),
    defaultValues: {
      name: configuration?.name || "",
      description: configuration?.description || "",
      address: configuration?.address || "",
      addressInfo: configuration?.addressInfo || "",
    },
  });

  const name = watch("name");
  const address = watch("address");

  const onSubmit = async (data: any) => {
    const newPopUpClinics = popUpClinics.map((clinic: any) => {
      if (clinic.id === configuration?.id)
        return {
          ...clinic,
          id: kebabCase(data?.name),
          name: data.name,
          description: data.description,
          address: data.address.label || configuration?.address || null,
          addressInfo: data.addressInfo || null,
          addressLatLon,
          remoteLocation,
          placeId:
            data?.address?.value?.place_id || "ChIJ9aCJc9mHbIcRu0B0dJWB4x8",
          zipcode: Number(zipcode) || "80237",
        };
      else return clinic;
    });
    console.log("newPopUpClinics", newPopUpClinics);
    await setDoc(
      doc(firestore, "configuration/pop_up_clinics"),
      {
        popUpClinics: newPopUpClinics,
        updatedOn: serverTimestamp(),
      },
      { merge: true },
    )
      .then(() => {
        toast(
          `"${configuration?.name}" Pop-Up Clinic has been updated. Please allow ~5 minutes for changes to be reflected.`,
          {
            position: "top-center",
            duration: 5000,
            icon: (
              <FontAwesomeIcon
                icon={faTrash}
                size="lg"
                className="text-movet-green"
              />
            ),
          },
        );
        reset();
      })
      .catch((error: any) => {
        toast(error?.message || JSON.stringify(error), {
          position: "top-center",
          duration: 5000,
          icon: (
            <FontAwesomeIcon
              icon={faCircleExclamation}
              className="text-movet-red"
            />
          ),
        });
        setError(error);
      })
      .finally(() => {
        setDidTouchRemoteLocation(false);
        reset(data);
      });
  };

  return error ? (
    <Error error={error} />
  ) : (
    <>
      <section className="px-10 py-4 flex-col sm:flex-row items-center justify-center">
        <div className="flex flex-col mr-4">
          <span className="sm:mr-2 mt-4">
            General Information{" "}
            <span className="text-sm text-movet-red">*</span>
          </span>
          <p className="text-sm">
            This displays in the scheduling flow as the name, description, and
            location of the clinic.
          </p>
        </div>
        <div className="flex-col justify-center items-center mx-4 w-full mt-4">
          <span className="sm:mr-2">Name of Clinic</span>
          <TextInput
            required
            name="name"
            label=""
            placeholder=""
            type="text"
            errors={errors}
            control={control}
          />
          <p className="text-xs text-movet-black/70 italic mt-2">
            Clinic Booking URL:{" "}
            <b>
              <a
                href={`${
                  environment === "development"
                    ? "http://localhost:3001"
                    : "https://app.movetcare.com"
                }/booking/${kebabCase(name)}`}
                target="_blank"
                className="hover:text-movet-red hover:underline"
              >
                {environment === "development"
                  ? "http://localhost:3001"
                  : "https://app.movetcare.com"}
                /booking/{kebabCase(name)}
              </a>
            </b>
          </p>
        </div>
        <div className="flex-col justify-center items-center mx-4 w-full mt-4 mb-6">
          <span className="sm:mr-2">Description</span>
          <TextInput
            required
            name="description"
            label=""
            placeholder=""
            type="text"
            errors={errors}
            control={control}
            multiline
            numberOfLines={3}
          />
          <p className="text-xs text-movet-black/70 italic mt-2">
            <b>
              <a
                href={`https://www.w3schools.com/html/html_intro.asp`}
                target="_blank"
                className="hover:text-movet-red hover:underline"
              >
                *Supports HTML Tags
              </a>
            </b>
          </p>
        </div>
        <div className="flex-col justify-center items-center mx-4 w-full mt-4 mb-6">
          <span className="sm:mr-2">Location</span>
          <div className="flex flex-col md:flex-row items-center justify-center">
            <div className="flex justify-center items-center">
              <div className="flex flex-col justify-center items-center mx-4">
                <p className="text-center my-2">Remote Location?</p>
                <Switch
                  checked={remoteLocation}
                  onChange={() => {
                    setRemoteLocation(!remoteLocation);
                    setDidTouchRemoteLocation(true);
                  }}
                  className={classNames(
                    remoteLocation ? "bg-movet-green" : "bg-movet-red",
                    "relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200",
                  )}
                >
                  <span
                    aria-hidden="true"
                    className={classNames(
                      remoteLocation ? "translate-x-5" : "translate-x-0",
                      "inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200",
                    )}
                  />
                </Switch>
                {!remoteLocation && (
                  <div className="text-center mt-4">
                    <p className="italic">
                      * Default Location will be MoVET @ Belleview Station
                    </p>
                    <a
                      className="font-extrabold italic w-full text-movet-black hover:text-movet-red duration-300 ease-in-out text-sm"
                      target="_blank"
                      href="https://goo.gl/maps/h8eUvU7nsZTDEwHW9"
                      rel="noopener noreferrer"
                    >
                      4912 S Newport St, Denver, CO 80237
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <Transition
          show={remoteLocation}
          enter="transition ease-in duration-500"
          leave="transition ease-out duration-64"
          leaveTo="opacity-10"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leaveFrom="opacity-100"
        >
          <div className="flex-col justify-center items-center mx-4 w-full mt-4 mb-6">
            <div className="flex rounded-lg border-2 border-movet-brown mt-8 mb-8 p-1">
              <div className="flex w-full h-72 mx-auto">
                {!isLoaded ? (
                  <Loader message={"Loading Map..."} />
                ) : error || loadError ? (
                  <Error error={error || loadError} />
                ) : (
                  <GoogleMap
                    mapContainerStyle={containerStyle}
                    options={mapOptions}
                    center={
                      (addressLatLon as any) ||
                      configuration?.addressLatLon ||
                      center
                    }
                    zoom={
                      addressLatLon || configuration?.addressLatLon ? 17 : 8.5
                    }
                  />
                )}
              </div>
            </div>
            <>
              <PlacesInput
                label="Clinic Address"
                name="address"
                placeholder={(address as string) || "Search for a location..."}
                errors={errors}
                control={control}
                setValue={null}
                setLatLon={setAddressLetLon}
                setExternalZipcodeValidation={setZipcode}
                required
                className={
                  hasAddressError ? " border-movet-red border-2" : null
                }
              />
              {hasAddressError && (
                <div className="mb-8">
                  <ErrorMessage errorMessage="MoVET does not currently service this area. Please enter a new address that is in (or near) the Denver Metro area." />
                </div>
              )}
              <div className="mt-8" />
              <TextInput
                label="Additional Location Info"
                name="addressInfo"
                control={control}
                errors={errors}
                placeholder="Parking Options/Locations, Gate/Door codes, etc."
                multiline
                numberOfLines={3}
                type="text"
              />
            </>
          </div>
        </Transition>
        <div className="flex flex-col justify-center items-center mx-4 w-full mb-2">
          <Transition
            show={isDirty || didTouchRemoteLocation}
            enter="transition ease-in duration-500"
            leave="transition ease-out duration-64"
            leaveTo="opacity-10"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leaveFrom="opacity-100"
          >
            <Button
              text="SAVE"
              color="red"
              icon={faCheck}
              onClick={handleSubmit(onSubmit as any)}
            />
          </Transition>
        </div>
      </section>
      <hr className="mb-4 text-movet-gray" />
    </>
  );
};
