import {
  faCircleExclamation,
  faCheckCircle,
  faUserAltSlash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { setDoc, doc, serverTimestamp } from "firebase/firestore";
import toast from "react-hot-toast";
import { firestore } from "services/firebase";

import { useRouter } from "next/router";
import environment from "utils/environment";

const Testing = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();
  const { id } = router.query;
  const {
    reset,
    // handleSubmit,
    // control,
    // formState: { isValid, isSubmitting, isDirty, errors },
  } = useForm({
    mode: "onSubmit",
    defaultValues: {
      clientId: null,
    },
  });

  const onSubmit = async (data: any) => {
    console.log(isLoading);
    setIsLoading(true);
    await setDoc(
      doc(firestore, "tasks_queue", `create_new_client_${data.clientId}`),
      {
        options: { clientId: data.clientId },
        worker: "create_new_client",
        status: "scheduled",
        performAt: serverTimestamp(),
        updatedOn: serverTimestamp(),
      },
      { merge: true }
    )
      .then(
        () =>
          !id &&
          toast(
            `Processing MoVET Account Creation for ProVet Client #${data.clientId}. This can take up to two minutes...`,
            {
              className: "text-sm",
              duration: 5000,
              position: "top-center",
              icon: (
                <FontAwesomeIcon
                  icon={faCheckCircle}
                  size="lg"
                  className="text-movet-green"
                />
              ),
            }
          )
      )
      .catch((error: any) =>
        toast(`MoVET Account Creation FAILED: ${error?.message}`, {
          duration: 5000,
          position: "bottom-center",
          icon: (
            <FontAwesomeIcon
              icon={faCircleExclamation}
              size="sm"
              className="text-movet-red"
            />
          ),
        })
      )
      .finally(() => {
        setIsLoading(false);
        reset();
      });
  };

  useEffect(() => {
    if (id) onSubmit({ clientId: id });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return (
    <>
      {environment === "development" && (
        <div className="bg-white shadow overflow-hidden rounded-lg mb-4">
          <div className="flex flex-row items-center justify-center -mb-4">
            <FontAwesomeIcon
              icon={faUserAltSlash}
              className={"text-movet-red"}
              size="lg"
            />
            <h1 className="ml-2 my-4 text-lg cursor-pointer">
              Delete Test Users
            </h1>
          </div>
          <ul
            role="list"
            className="divide-y divide-movet-gray border-t border-movet-gray mt-4"
          >
            <li>
              <div
                className={
                  "flex flex-col items-center px-4 py-4 sm:px-6 group mx-auto max-w-xl"
                }
              >
                <div className="min-w-0 flex-col w-full justify-center">
                  <h1 className=" mt-2 text-center text-sm">COMING SOON!</h1>
                  {/* <div className="mx-auto w-full flex flex-col justify-center items-center group mt-4">
                    <Button
                      type="submit"
                      color="red"
                      onClick={() =>
                        window.open(
                          "http://localhost:5001/movet-care-staging/us-central1/taskRunnerDev",
                          "_blank"
                        )
                      }
                      className="mb-3"
                    >
                      <FontAwesomeIcon icon={faClock} size="lg" />
                      <span className="ml-2">RUN CRON TASKS</span>
                    </Button>
                    <p className="invisible group-hover:visible text-xs text-movet-red italic text-center w-full sm:w-2/3 mx-auto -mb-4 duration-500 ease-in-out">
                      * NOTE: This will open a new tab with a blank page.
                    </p>
                  </div> */}
                </div>
              </div>
            </li>
          </ul>
        </div>
      )}
    </>
  );
};

export default Testing;
