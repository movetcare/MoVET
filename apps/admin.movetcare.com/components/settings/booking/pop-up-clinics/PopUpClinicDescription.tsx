import {
  faCheck,
  faCircleExclamation,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { firestore } from "services/firebase";
import toast from "react-hot-toast";
import { useState } from "react";
import { Transition } from "@headlessui/react";
import Error from "../../../Error";
import TextInput from "components/inputs/TextInput";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { object, string } from "yup";
import kebabCase from "lodash.kebabcase";
import { Button } from "ui";

export const PopUpClinicDescription = ({
  configuration,
  popUpClinics,
}: {
  configuration: {
    name: string;
    description: string;
    id: string;
    isActive?: boolean;
    resourceConfiguration?:
      | Array<{
          id: string;
          staggerTime: number;
        }>
      | undefined;
  };
  popUpClinics: any;
}) => {
  const [error, setError] = useState<any>(null);

  const {
    handleSubmit,
    control,
    reset,
    watch,
    formState: { errors, isDirty, isSubmitting },
  } = useForm({
    mode: "onSubmit",
    resolver: yupResolver(
      object().shape({
        name: string().required("A clinic name is required"),
        description: string().required(
          "A description for the pop up clinic is required",
        ),
      }),
    ),
    defaultValues: {
      name: configuration.name || "",
      description: configuration.description || "",
    },
  });

  const name = watch("name");

  const onSubmit = async (data: any) => {
    const newPopUpClinics = popUpClinics.map((clinic: any) => {
      if (clinic.id === configuration?.id)
        return {
          ...clinic,
          id: kebabCase(data?.name),
          name: data.name,
          description: data.description,
        };
      else return clinic;
    });
    await setDoc(
      doc(firestore, "configuration/pop_up_clinics"),
      {
        popUpClinics: newPopUpClinics,
        updatedOn: serverTimestamp(),
      },
      { merge: true },
    )
      .then(() => {
        toast(`"${configuration?.name}" Pop-Up Clinic has been updated`, {
          position: "top-center",
          duration: 5000,
          icon: (
            <FontAwesomeIcon
              icon={faTrash}
              size="lg"
              className="text-movet-green"
            />
          ),
        });
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
      });
  };

  return error ? (
    <Error error={error} />
  ) : (
    <>
      <section className="px-10 py-4 flex-col sm:flex-row items-center justify-center">
        <div className="flex flex-col mr-4">
          <span className="sm:mr-2 mt-4">
            Name & Description <span className="text-sm text-movet-red">*</span>
          </span>
          <p className="text-sm">
            This displays in the scheduling flow as the name and description of
            the clinic.
          </p>
        </div>
        <div className="flex-col justify-center items-center mx-4 w-full mt-4">
          <span className="sm:mr-2">
            Name of Clinic <span className="text-sm text-movet-red">*</span>
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
          <p className="text-xs text-movet-black/70 italic mt-2">
            Clinic Schedule URL:{" "}
            <b>
              <a
                href={`https://app.movetcare.com/book-a-clinic/${kebabCase(name)}`}
                target="_blank"
                className="hover:text-movet-red hover:underline"
              >
                https://app.movetcare.com/book-a-clinic/{kebabCase(name)}
              </a>
            </b>
          </p>
        </div>
        <div className="flex-col justify-center items-center mx-4 w-full mt-4 mb-6">
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
        <div className="flex flex-col justify-center items-center mx-4 w-full mb-2">
          <Transition
            show={isDirty}
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
              disabled={!isDirty || isSubmitting}
            />
          </Transition>
        </div>
      </section>
      <hr className="mb-4 text-movet-gray" />
    </>
  );
};
