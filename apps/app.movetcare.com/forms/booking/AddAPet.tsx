import { bool, object, string, lazy, addMethod } from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { setDoc, doc, serverTimestamp, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { firestore } from "services/firebase";
import { Booking } from "types/Booking";
import { Loader } from "ui";
import { Error } from "components/Error";
import {
  faArrowRight,
  faCat,
  faDog,
  faMars,
  faTimes,
  faVenus,
} from "@fortawesome/free-solid-svg-icons";
import { Button } from "ui";
import TextInput from "components/inputs/TextInput";
import SwitchInput from "components/inputs/SwitchInput";
import { ToggleInput } from "components/inputs/ToggleInput";
import { DateInput } from "components/inputs/DateInput";
import { SearchInput } from "components/inputs/SearchInput";
import { PlacesInput } from "components/inputs/PlacesInput";
import { NumberInput } from "components/inputs/NumberInput";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { BookingHeader } from "components/booking/BookingHeader";

addMethod(string, "isBeforeToday", function (errorMessage: string) {
  return (this as any).test(
    "test-before-today",
    errorMessage,
    function (this: any, value: any) {
      const { path, createError } = this as any;
      const today = new Date();
      const date = value?.split("-");
      const month = date[0];
      const day = date[1];
      const year = date[2];
      const valueAsDate = new Date(year, month - 1, day);
      return (
        today > valueAsDate || createError({ path, message: errorMessage })
      );
    }
  );
});

addMethod(string, "isValidDay", function (errorMessage: string) {
  return (this as any).test(
    "test-valid-day",
    errorMessage,
    function (this: any, value: any) {
      const { path, createError } = this as any;
      const date = value?.split("-");
      const day = date[1];
      return (
        (day <= 31 && day >= 1) || createError({ path, message: errorMessage })
      );
    }
  );
});

addMethod(string, "isValidMonth", function (errorMessage: string) {
  return (this as any).test(
    "test-valid-month",
    errorMessage,
    function (this: any, value: any) {
      const { path, createError } = this as any;
      const date = value?.split("-");
      const month = date[0];
      return (
        (month <= 12 && month >= 1) ||
        createError({ path, message: errorMessage })
      );
    }
  );
});

addMethod(string, "isValidWeight", function (errorMessage: string) {
  return (this as any).test(
    "test-valid-weight",
    errorMessage,
    function (this: any, value: any) {
      const { path, createError } = this as any;
      return (
        (parseInt(value) >= 1 && parseInt(value) <= 300) ||
        createError({ path, message: errorMessage })
      );
    }
  );
});

interface Breed {
  value: string;
  label: string;
}

export const AddAPet = ({
  session,
  isAppMode,
  setShowAddAPet,
  disableClose = false,
}: {
  session: Booking;
  isAppMode: boolean;
  setShowAddAPet: any;
  disableClose?: boolean;
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<any>(null);
  const [breedsList, setBreedsList] = useState<Array<Breed>>();
  const {
    control,
    handleSubmit,
    watch,
    reset,
    getValues,
    formState: { errors, isSubmitted },
  } = useForm({
    mode: "all",
    resolver: yupResolver(
      object().shape({
        name: string()
          .min(2, "Name must contain at least 2 characters")
          .max(80, "Name can not be more than 80 characters")
          .required("A name is required"),
        type: string().required("A type is required"),
        gender: string().required("A gender is required"),
        spayedOrNeutered: bool().nullable(true).default(false),
        breed: lazy((value: any) =>
          typeof value === "object" && !Array.isArray(value) && value !== null
            ? object().shape({
                label: string().trim().min(1, "A breed is required"),
                value: string().trim().min(1, "A breed is required"),
              })
            : string()
                .matches(/.*\d/, "A breed selection is required")
                .required("A breed selection is required")
        ),
        weight: (string() as any)
          .isValidWeight("Weight must be between 1 and 300 pounds")
          .required("A weight is required"),
        birthday: (string() as any)
          .isBeforeToday("Birthday must be before today")
          .isValidDay("Please enter valid day")
          .isValidMonth("Please enter a valid month")
          .required("A birthday is required"),
      })
    ),
    defaultValues: {
      name: "",
      type: "",
      gender: "",
      spayedOrNeutered: false,
      breed: "",
      birthday: "",
      weight: "",
      vet: "",
      notes: "",
    },
  });
  const specie = watch("type");
  const isNonReproductive = watch("spayedOrNeutered");
  const gender = watch("gender");
  const vet = watch("vet");
  useEffect(() => {
    if (specie !== undefined && specie !== null && specie !== "") {
      reset({ ...getValues(), breed: "" });
      const unsubscribe = onSnapshot(
        doc(firestore, "breeds", specie === "dog" ? "canine" : "feline"),
        (doc: any) => {
          const breedList: Array<Breed> = [];
          doc
            .data()
            .options.map((breed: { value: string; label: string }) =>
              breedList.push({ label: breed.label, value: breed.value })
            );
          setBreedsList(breedList);
        },
        (error: any) => setError(error)
      );
      return () => unsubscribe();
    } else return;
  }, [specie, getValues, reset]);
  const onSubmit = async (data: any) => {
    setIsLoading(true);
    await setDoc(
      doc(firestore, "bookings", `${session.id}`),
      {
        step: "add-pet",
        newPatient: data,
        updatedOn: serverTimestamp(),
      },
      { merge: true }
    ).catch((error: any) => {
      setIsLoading(false);
      setError(error);
    });
  };
  return isLoading ? (
    <Loader />
  ) : error ? (
    <Error error={error} isAppMode={isAppMode} />
  ) : (
    <div>
      <div className="text-center">
        {!disableClose && (
          <div
            className="text-right cursor-pointer hover:text-movet-red -mb-12 z-50 relative ease-in-out duration-500"
            onClick={() => setShowAddAPet(false)}
          >
            <FontAwesomeIcon icon={faTimes} size="2x" />
          </div>
        )}
        <BookingHeader
          isAppMode={isAppMode}
          title={"Add a Pet"}
          description={"Please tell us about your pet."}
        />
      </div>
      <form className="grid grid-cols-1 gap-y-8 text-left mt-8">
        <ToggleInput
          options={[
            { name: "dog", icon: faDog },
            { name: "cat", icon: faCat },
          ]}
          label="Type of Pet"
          control={control}
          errors={errors}
          name="type"
          required
        />
        <ToggleInput
          options={[
            { name: "male", icon: faMars },
            { name: "female", icon: faVenus },
          ]}
          label="Gender"
          control={control}
          errors={errors}
          name="gender"
          required
        />
        <SwitchInput
          centered
          title={"Reproductive Status"}
          disabled={isLoading}
          name="spayedOrNeutered"
          control={control}
          errors={errors}
          label={
            <p className="mt-4 -mb-4">
              My pet{" "}
              <b className="text-movet-brown italic underline">
                {isNonReproductive ? "IS" : "IS NOT"}
              </b>{" "}
              {gender === "male"
                ? "neutered"
                : gender === "female"
                ? "spayed"
                : "spayed / neutered"}
            </p>
          }
        />
        <TextInput
          label="Name"
          name="name"
          control={control}
          errors={errors}
          placeholder="What is your pets name?"
          autoComplete="given-name"
          required
        />
        {specie !== undefined &&
          specie !== null &&
          specie !== "" &&
          breedsList && (
            <SearchInput
              label="Breed"
              options={breedsList || []}
              control={control}
              errors={errors}
              name="breed"
              placeholder="Select a Breed"
              required
            />
          )}
        <NumberInput
          label="Weight"
          name="weight"
          errors={errors}
          control={control}
          suffix={" lbs"}
          required
        />
        <DateInput
          label="Birthday"
          name="birthday"
          errors={errors}
          control={control}
          required
        />
        <PlacesInput
          label="Previous Vet"
          name="vet"
          placeholder="Search for a Vet"
          errors={errors}
          control={control}
          required={false}
          types={["veterinary_care", "street_address", "street_number"]}
        />
        {vet !== "" && (
          <p className="text-xs text-center italic -mt-4 mb-0">
            * We&apos;ll send them a request for your pet&apos;s medical
            records!
          </p>
        )}
        <TextInput
          multiline
          numberOfLines={2}
          label="Notes"
          name="notes"
          control={control}
          errors={errors}
          placeholder="What else should we know about your pet?"
        />
        <p className="text-sm text-center italic -mt-4">
          * Please let us know in advance of any favorite treat, scratching
          spot, or any behavioral issues you may have encountered with your pet
          previously. Are they food motivated, territorial, or aggressive
          towards humans or other pets?
        </p>
        <div className="flex flex-col sm:flex-row">
          <Button
            type="submit"
            icon={faArrowRight}
            iconSize={"sm"}
            color="red"
            text="Continue"
            className={"w-full mx-auto mt-4 sm:mt-0"}
            onClick={handleSubmit(onSubmit)}
          />
        </div>
        {vet === "" && (
          <p className="text-center -mt-4 italic text-sm">
            * Please email (or have your previous vet email) your pet&apos;s
            medical records to{" "}
            {!isAppMode ? (
              <a
                href="mailto://info@movetcare.com"
                target="_blank"
                rel="noreferrer"
              >
                info@movetcare.com
              </a>
            ) : (
              "info@movetcare.com"
            )}
          </p>
        )}
        {isSubmitted && errors && (
          <p className="text-movet-red text-center m-0 -mt-4 italic text-sm">
            Please fix the errors highlighted above...
          </p>
        )}
      </form>
      {!disableClose && (
        <div
          className="flex flex-row justify-center items-center text-center cursor-pointer mt-4 text-sm ease-in-out duration-500 hover:text-movet-red"
          onClick={() => setShowAddAPet(false)}
        >
          <FontAwesomeIcon icon={faTimes} size="lg" className="mr-2" />
          <p>Close</p>
        </div>
      )}
    </div>
  );
};
