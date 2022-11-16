import {
  faArrowRight,
  faCat,
  faDog,
  faInfoCircle,
  faPlusCircle,
  faStethoscope,
} from "@fortawesome/free-solid-svg-icons";
import { useForm } from "react-hook-form";
import { Button } from "ui";
import { Loader } from "ui";
import { Error } from "components/Error";
import { Fragment, useEffect, useRef, useState } from "react";
import { Booking } from "types/Booking";
import {
  onSnapshot,
  collection,
  where,
  query,
  doc,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { firestore } from "services/firebase";
import { yupResolver } from "@hookform/resolvers/yup";
import { AddAPet } from "./AddAPet";
import { array, object, string, lazy } from "yup";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { capitalizeFirstLetter } from "utilities";
import { Dialog, Transition } from "@headlessui/react";
import ErrorMessage from "components/inputs/ErrorMessage";
import { BookingHeader } from "components/booking/BookingHeader";

export const SelectAPet = ({
  session,
  isAppMode,
}: {
  session: Booking;
  isAppMode: boolean;
}) => {
  const cancelButtonRef = useRef(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<any>(null);
  const [pets, setPets] = useState<any>(null);
  const [showAddAPet, setShowAddAPet] = useState<boolean>(false);
  const [vcprRequiredError, setVcprRequiredError] = useState<boolean>(false);
  const [showVcprDescription, setShowVcprDescription] =
    useState<boolean>(false);
  const [establishCareExamRequired, setEstablishCareExamRequired] =
    useState<boolean>(false);
  const [disableClose, setDisableClose] = useState<boolean>(false);
  const [showExplainer, setShowExplainer] = useState<boolean>(false);
  // const [petPhotos, setPetPhotos] = useState<Array<{
  //   url: string;
  //   patient: number;
  // }> | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { isDirty, isValid, errors, isSubmitting },
  } = useForm({
    mode: "all",
    resolver: yupResolver(
      object().shape({
        pets: lazy((val) =>
          Array.isArray(val)
            ? array()
                .min(1, "A pet selection is required")
                .max(3, "Only 3 pets are allowed per appointment")
                .of(string())
                .required("A pet selection is required")
            : string()
                .matches(/.*\d/, "A pet selection is required")
                .required("A pet selection is required")
        ),
      })
    ),
    defaultValues: {
      pets: null,
    },
  });
  const selectedPets: Array<string> | string | null = watch("pets") as any;
  useEffect(() => {
    if (pets !== null && pets?.length > 0) {
      let vcprPetMatchCount = 0;
      let vcprPetCount = 0;
      pets.forEach((pet: any) => {
        if (pet.vcprRequired) vcprPetCount++;
        if (selectedPets !== null) {
          if (Array.isArray(selectedPets))
            selectedPets.map((selectedPet: any) => {
              if (selectedPet === pet.value && pet.vcprRequired)
                vcprPetMatchCount++;
            });
        } else if (selectedPets === pet.value && pet.vcprRequired)
          vcprPetMatchCount++;
      });
      if (
        selectedPets !== null &&
        vcprPetMatchCount > 0 &&
        vcprPetMatchCount !== selectedPets.length
      )
        setVcprRequiredError(true);
      else setVcprRequiredError(false);
      if (
        (Array.isArray(selectedPets) &&
          selectedPets !== null &&
          vcprPetMatchCount > 0 &&
          vcprPetMatchCount === selectedPets.length) ||
        (selectedPets === pets[0].value && pets[0].vcprRequired)
      )
        setEstablishCareExamRequired(true);
      else setEstablishCareExamRequired(false);
      if (vcprPetCount > 0) setShowVcprDescription(true);
    }
  }, [selectedPets, pets]);
  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(
        collection(firestore, "patients"),
        where("client", "==", Number(session.client.uid))
      ),
      (snapshot: any) => {
        const activePets: any = [];
        snapshot.forEach((doc: any) => {
          if (!doc.data().archived)
            activePets.push({
              name: doc.data().name,
              value: `${doc.data().id}`,
              vcprRequired: doc.data().vcprRequired,
              species: doc.data().species,
              client: doc.data().client,
            });
        });
        if (activePets.length === 0) {
          setShowAddAPet(true);
          setDisableClose(true);
        }
        setPets(activePets);
        setIsLoading(false);
      },
      (error: any) => setError(error)
    );
    return () => unsubscribe();
  }, [reset, session.client.uid]);

  // useEffect(() => {
  //   if (pets) {
  //     const petPhotos: Array<{
  //       url: string;
  //       patient: number;
  //     }> = [];
  //     pets.forEach((pet: any) => {
  //       if (pet.client && pet.value)
  //         getDownloadURL(
  //           ref(
  //             storage,
  //             `clients/${pet.client}/patients/${pet.value}/photo/image`
  //           )
  //         )
  //           .then((url: string) => petPhotos.push({ patient: pet.value, url }))
  //           .catch(() => null);
  //     });
  //     console.log("petPhotos", petPhotos);
  //     setPetPhotos(petPhotos);
  //   }
  // }, [pets]);

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    await setDoc(
      doc(firestore, "bookings", `${session.id}`),
      {
        vcprRequired: establishCareExamRequired,
        patients: data.pets,
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
      {isLoading ? (
        <Loader
          message={
            isSubmitting
              ? "Saving Pet Selection(s)..."
              : "Loading Your Pet(s)..."
          }
        />
      ) : error ? (
        <Error error={error} isAppMode={isAppMode} />
      ) : showAddAPet ? (
        <AddAPet
          session={session}
          isAppMode={isAppMode}
          setShowAddAPet={setShowAddAPet}
          disableClose={disableClose}
        />
      ) : (
        <>
          <BookingHeader
            isAppMode={isAppMode}
            title={`Select ${pets.length > 1 ? "Your Pets" : "a Pet"}`}
            description={`Which ${
              pets.length > 1 ? "pets" : "pet"
            } would you like to book an
              appointment for?`}
          />
          <legend className="mt-8 text-2xl font-medium mb-2 w-full text-center">
            {session.client.displayName
              ? `${session.client.displayName}'s `
              : "Your "}
            {pets.length > 1 ? "Pets" : "Pet"}
          </legend>
          {pets
            .sort(
              (item: any, nextItem: any) =>
                nextItem.vcprRequired - item.vcprRequired
            )
            .map((pet: any, index: number) => (
              <div
                key={index}
                className={
                  index === pets.length - 1
                    ? "w-full"
                    : "w-full border-b border-movet-gray divide-y divide-movet-gray"
                }
              >
                <label
                  htmlFor={`${pet.name}`}
                  className="text-lg select-none font-source-sans-pro flex flex-row items-center py-2 w-full"
                >
                  {/* {petPhotos &&
                      petPhotos.map(
                        ({ patient, url }: { url: string; patient: number }) =>
                          `${patient}` === pet.value ? (
                            <Image
                              src={`${url}`}
                              height={20}
                              width={20}
                              alt={`${pet.names} Photo`}
                              className="mr-2 h-8 w-8 text-movet-brown flex-none"
                            />
                          ) : (
                            <FontAwesomeIcon
                              icon={pet.species.includes("Dog") ? faDog : faCat}
                              size={"lg"}
                              className="mr-2 h-8 w-8 text-movet-brown flex-none"
                            />
                          )
                      )} */}
                  <FontAwesomeIcon
                    icon={pet.species.includes("Dog") ? faDog : faCat}
                    size={"lg"}
                    className="mr-2 h-8 w-8 text-movet-brown flex-none"
                  />
                  <p>{capitalizeFirstLetter(pet.name)}</p>
                  {pet.vcprRequired ? (
                    <span className="text-xs italic text-movet-red ml-2 text-right grow font-extrabold">
                      * Requires Establish Care Exam
                    </span>
                  ) : (
                    <span className="text-xs italic text-movet-red ml-2 text-center grow">
                      {""}
                    </span>
                  )}
                  <div className="ml-3 flex items-center h-5 flex-none">
                    <input
                      id={`${pet.name}`}
                      {...register("pets")}
                      value={`${pet.value}`}
                      type="checkbox"
                      className="focus:ring-movet-brown h-6 w-6 text-movet-brown border-movet-gray rounded-full ease-in-out duration-500"
                    />
                  </div>
                </label>
              </div>
            ))}
          <ErrorMessage
            errorMessage={
              vcprRequiredError
                ? "Only pets that require an Establish Care Exam may be selected"
                : (errors?.pets?.message as string)
            }
          />
          {showVcprDescription && (
            <>
              <span
                className="text-center text-gray mt-8 flex justify-center items-center text-xs cursor-pointer italic hover:text-movet-brown ease-in-out duration-500"
                onClick={() => setShowExplainer(!showExplainer)}
              >
                <FontAwesomeIcon
                  icon={faInfoCircle}
                  size="lg"
                  className="mr-2 text-movet-brown -mt-1"
                />
                What are Establish Care Exams?
              </span>
            </>
          )}
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
                            <FontAwesomeIcon icon={faStethoscope} size="2x" />
                          </div>
                          <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                            <Dialog.Title
                              as="h2"
                              className="text-xl uppercase leading-6 font-medium mt-0"
                            >
                              What are Establish Care Exams?
                            </Dialog.Title>
                            <div className="mt-6 text-left">
                              <p>
                                Establish Care Exams are used to start a
                                Veterinarian-Client-Patient Relationship
                                (&quot;VCPR&quot;).
                              </p>
                              <p>
                                A VCPR is established only when your
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
          <div className="flex flex-col sm:flex-row mt-12 mb-6">
            <Button
              icon={faPlusCircle}
              iconSize={"sm"}
              color="black"
              text="Add a Pet"
              className={"w-full sm:w-1/2 mr-0 sm:mr-4"}
              onClick={() => {
                setShowAddAPet(true);
                document?.getElementById("top")?.scrollIntoView();
              }}
            />
            <Button
              type="submit"
              icon={faArrowRight}
              iconSize={"sm"}
              disabled={!isDirty || !isValid || vcprRequiredError}
              color="red"
              text="Continue"
              className={"w-full sm:w-1/2 ml-0 sm:ml-4 mt-4 sm:mt-0"}
              onClick={handleSubmit(onSubmit)}
            />
          </div>
        </>
      )}
    </>
  );
};
