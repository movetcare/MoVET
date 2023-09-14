import {
  faUserGear,
  faCircleExclamation,
  faUserCheck,
  faCheckCircle,
  faClock,
  faGear,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Loader } from "ui";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { setDoc, doc, serverTimestamp } from "firebase/firestore";
import toast from "react-hot-toast";
import { firestore } from "services/firebase";
import { NumberInput } from "components/inputs/NumberInput";
import Button from "components/Button";
import { useRouter } from "next/router";
import environment from "utils/environment";
import AdminCheck from "components/AdminCheck";

const Tools = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();
  const { id } = router.query;
  const {
    reset,
    handleSubmit,
    control,
    formState: { isValid, isSubmitting, isDirty, errors },
  } = useForm({
    mode: "onSubmit",
    defaultValues: {
      clientId: null,
    } as any,
  });

  const onSubmit = async (data: any) => {
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
      { merge: true },
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
            },
          ),
      )
      .catch((error: any) =>
        toast(`MoVET Account Creation FAILED: ${error?.message}`, {
          duration: 5000,

          icon: (
            <FontAwesomeIcon
              icon={faCircleExclamation}
              size="sm"
              className="text-movet-red"
            />
          ),
        }),
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
    <AdminCheck>
      {environment === "development" && (
        <div className="bg-white shadow overflow-hidden rounded-lg mb-4">
          <div className="flex flex-row items-center justify-center -mb-4">
            <FontAwesomeIcon
              icon={faGear}
              className={"text-movet-green"}
              size="lg"
            />
            <h1 className="ml-2 my-4 text-lg cursor-pointer">
              Trigger Cron Task
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
                  <p className=" mt-2 text-center text-sm">
                    Use this tool to manually trigger the systems cron job and
                    perform queued tasks.
                  </p>
                  <div className="mx-auto w-full flex flex-col justify-center items-center group mt-4">
                    <Button
                      type="submit"
                      color="red"
                      onClick={() =>
                        window.open(
                          "http://localhost:5001/movet-care-staging/us-central1/taskRunnerDev",
                          "_blank",
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
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </div>
      )}
      <div className="bg-white shadow overflow-hidden rounded-lg mb-4">
        {!id && (
          <div className="flex flex-row items-center justify-center -mb-4">
            <FontAwesomeIcon
              icon={faUserGear}
              className={"text-movet-green"}
              size="lg"
            />
            <h1 className="ml-2 my-4 text-lg cursor-pointer">
              Repair MoVET Account
            </h1>
          </div>
        )}
        {isLoading ? (
          <div className="mb-6 -z-10">
            <Loader height={200} width={200} />
          </div>
        ) : id ? (
          <div
            className={
              "flex flex-col items-center px-4 py-4 sm:px-6 group mx-auto max-w-xl -mt-10"
            }
          >
            <div className="overflow-hidden px-4">
              <Loader message={`Processing Account Repair for Client #${id}`} />
            </div>

            <p className="italic -mt-6">This can take up to three minutes...</p>
          </div>
        ) : (
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
                  <p className=" mt-2 text-center text-sm">
                    Use this tool to generate a MoVET account for an existing
                    (manually added) Client and/or to automatically link a
                    Stripe Customer to an existing Client in ProVet.
                  </p>
                  <form
                    onSubmit={handleSubmit(onSubmit as any)}
                    className="flex flex-col w-full mx-auto my-6 px-4 md:px-8"
                  >
                    <NumberInput
                      placeholder="Client #"
                      label="ProVet Client ID"
                      name="clientId"
                      errors={errors}
                      control={control}
                      required
                    />
                    <p className="my-1 text-center text-xs italic">
                      The existing Client will be emailed an account
                      confirmation link once the process is completed
                      successfully. This will enable them to be able to login to
                      the MoVET mobile apps and access the rest of the MoVET
                      platform.
                    </p>
                    <div className="mx-auto w-full flex flex-col justify-center items-center group mt-4">
                      <Button
                        type="submit"
                        color="red"
                        disabled={!isDirty || isSubmitting || !isValid}
                        className="mb-3"
                      >
                        <FontAwesomeIcon icon={faUserCheck} size="lg" />
                        <span className="ml-2">CREATE ACCOUNT</span>
                      </Button>
                      <p className="invisible group-hover:visible text-xs text-movet-red italic text-center w-full sm:w-2/3 mx-auto -mb-6 duration-500 ease-in-out">
                        * NOTE: Client MUST HAVE AN EMAIL ADDRESS in ProVet,
                        otherwise this tool will not work!
                      </p>
                    </div>
                  </form>
                </div>
              </div>
            </li>
          </ul>
        )}
      </div>
    </AdminCheck>
  );
};

export default Tools;
