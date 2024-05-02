import {
  faCircleExclamation,
  faCheck,
  faCircleCheck,
  faPlus,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { doc, setDoc, serverTimestamp, arrayUnion } from "firebase/firestore";

import kebabCase from "lodash.kebabcase";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { firestore } from "services/firebase";
import { Button, Loader } from "ui";
import { SelectInput, TextInput } from "ui/src/components/forms/inputs";
import { classNames } from "utilities";
import Error from "../../../Error";
import { yupResolver } from "@hookform/resolvers/yup";
import { object, string } from "yup";
export const NewPopUpClinic = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<any>(null);
  const [showNewPopUpClinic, setShowNewPopUpClinic] = useState<boolean>(false);
  const {
    handleSubmit,
    control,
    reset,
    formState: { errors, isDirty, isSubmitting },
  } = useForm({
    mode: "onSubmit",
    resolver: yupResolver(
      object().shape({
        name: string().required("A clinic name is required"),
        description: string().required(
          "A description for the pop up clinic is required",
        ),
        scheduleType: object().required("A schedule type is required"),
      }),
    ),
    defaultValues: {
      name: "",
      description: "",
      scheduleType: "",
    },
  });

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    await setDoc(
      doc(firestore, "configuration/pop_up_clinics"),
      {
        popUpClinics: arrayUnion({
          id: kebabCase(data?.name),
          name: data?.name,
          description: data?.description,
          scheduleType: data?.scheduleType?.id,
        }),
        updatedOn: serverTimestamp(),
      },
      { merge: true },
    )
      .then(async () => {
        toast(`Your New Pop-Up Clinic has been created!`, {
          duration: 5000,
          icon: (
            <FontAwesomeIcon
              icon={faCircleCheck}
              size="sm"
              className="text-movet-green"
            />
          ),
        });
        reset();
      })
      .catch((error: any) => {
        toast(`New Pop-Up Clinic Creation FAILED: ${error?.message}`, {
          duration: 5000,
          icon: (
            <FontAwesomeIcon
              icon={faCircleExclamation}
              size="sm"
              className="text-movet-red"
            />
          ),
        });
        setError(error);
      })
      .finally(() => {
        setIsLoading(false);
        setShowNewPopUpClinic(false);
      });
  };

  return (
    <>
      {showNewPopUpClinic && (
        <>
          <hr className="text-movet-gray mt-8" />
          <h3 className="text-xl mt-8 leading-6 font-medium text-movet-black text-center">
            CREATE NEW POP UP CLINIC
          </h3>
          {error ? (
            <Error error={error} />
          ) : isLoading ? (
            <Loader />
          ) : (
            <form className="flex flex-col justify-center items-center my-4 max-w-xl mx-auto">
              <div className="flex-col justify-center items-center mx-4 w-full mt-4">
                <span className="sm:mr-2">
                  Name of Clinic{" "}
                  <span className="text-sm text-movet-red">*</span>
                </span>
                <TextInput
                  required
                  name="name"
                  label=""
                  placeholder=""
                  type="text"
                  errors={errors}
                  control={control}
                />
              </div>
              <div className="flex-col justify-center items-center mx-4 w-full mt-4">
                <span className="sm:mr-2">
                  Description <span className="text-sm text-movet-red">*</span>
                </span>
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
              </div>
              <div className="flex-col justify-center items-center mx-4 w-full mt-4">
                <span className="sm:mr-2">
                  Recurrence <span className="text-sm text-movet-red">*</span>
                </span>
                <SelectInput
                  label=""
                  name="scheduleType"
                  required
                  values={[
                    {
                      id: "ONCE",
                      name: "One Time Clinic",
                    },
                    // {
                    //   id: "WEEKLY",
                    //   name: "Weekly Clinic",
                    // },
                    // {
                    //   id: "MONTHLY",
                    //   name: "Monthly Clinic",
                    // },
                    // { id: "YEARLY", name: "Yearly Clinic" },
                  ]}
                  errors={errors}
                  control={control}
                />
              </div>
              <button
                type="submit"
                onClick={handleSubmit(onSubmit as any)}
                disabled={!isDirty || isSubmitting}
                className={classNames(
                  !isDirty || isSubmitting
                    ? "w-full items-center justify-center rounded-full h-10 text-movet-gray mr-4"
                    : "w-full cursor-pointer items-center justify-center rounded-full h-10 transition duration-500 ease-in-out text-movet-white hover:bg-movet-black mr-4 bg-movet-green",
                  "mt-6",
                )}
              >
                <FontAwesomeIcon icon={faCheck} size="lg" />
                <span className="ml-2">CREATE NEW CLINIC</span>
              </button>
            </form>
          )}
        </>
      )}
      <Button
        text={showNewPopUpClinic ? "CANCEL" : "NEW POP-UP CLINIC"}
        color="red"
        icon={showNewPopUpClinic ? faTimes : faPlus}
        onClick={() => {
          if (showNewPopUpClinic) reset();
          setShowNewPopUpClinic(!showNewPopUpClinic);
        }}
        className="my-8"
      />
    </>
  );
};
