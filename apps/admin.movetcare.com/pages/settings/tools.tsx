import {
  faUserGear,
  faCircleExclamation,
  faUserCheck,
  faCheckCircle,
  faClock,
  faGear,
  faCloudArrowUp,
  faCircleCheck,
  faRedo,
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
  const [marketingDeploymentSummary, setMarketingDeploymentSummary] =
    useState<any>(null);
  const [webDeploymentSummary, setWebDeploymentSummary] = useState<any>(null);
  const [adminDeploymentSummary, setAdminDeploymentSummary] =
    useState<any>(null);
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

  const getDeploymentStatus = async (
    application: "MARKETING" | "WEB" | "ADMIN",
  ) => {
    const result = await fetch(
      `https://api.vercel.com/v13/deployments/${application === "MARKETING" ? "movetcare.com" : application === "WEB" ? "app.movetcare.com" : "admin.movetcare.com"}`,
      {
        headers: {
          Authorization: "Bearer " + process.env.NEXT_PUBLIC_DEPLOY_TOKEN,
          "Content-Type": "application/json",
        },
        method: "get",
      },
    );
    const data = await result.json();
    console.log(application + " DEPLOY SUMMARY =>", data);
    if (application === "MARKETING") setMarketingDeploymentSummary(data);
    else if (application === "WEB") setWebDeploymentSummary(data);
    else if (application === "ADMIN") setAdminDeploymentSummary(data);
  };

  useEffect(() => {
    getDeploymentStatus("WEB");
    getDeploymentStatus("MARKETING");
    getDeploymentStatus("ADMIN");
  }, []);

  const deployApplication = async (
    application: "MARKETING" | "WEB" | "ADMIN",
  ) => {
    const deploy = await fetch(
      `https://api.vercel.com/v1/integrations/deploy/${
        application === "MARKETING"
          ? "prj_U3YE4SJdfQooyh9TsZsZmvdoL28T/exR90BAbzS"
          : application === "WEB"
            ? "prj_da86e8MG9HWaYYjOhzhDRwznKPtc/Kv7tDyrjjO"
            : "prj_zwuwfb9o6mrilCIVcJCUKa6NAtua/UUpwHgjX3H"
      }?buildCache=false`,
      {
        method: "post",
      },
    );
    const deployData = await deploy.json();
    console.log(application + " DEPLOY TRIGGER RESPONSE", deployData);
    if (deployData?.job?.id)
      toast(
        `${application} App Deployment Triggered: ${deployData?.job?.id}\n\nStatus: ${deployData?.job?.state} - ${new Date(
          deployData?.job?.createdAt,
        ).toLocaleTimeString("en-US", {
          timeZone: "America/Denver",
          timeZoneName: "short",
          hour12: true,
          hour: "2-digit",
          minute: "2-digit",
        })}`,
        {
          icon: (
            <FontAwesomeIcon
              icon={faCircleCheck}
              size="sm"
              className="text-movet-green"
            />
          ),
        },
      );
    else
      toast(`Something went wrong...\n\n${JSON.stringify(deployData)}`, {
        icon: (
          <FontAwesomeIcon
            icon={faCircleExclamation}
            size="sm"
            className="text-movet-red"
          />
        ),
      });
  };

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

  const DeploymentTool = ({
    application,
    deploymentSummary,
  }: {
    application: "MARKETING" | "WEB" | "ADMIN";
    deploymentSummary: any;
  }) => {
    return (
      <div className="mx-auto w-full flex flex-col justify-center items-center p-4">
        <Button
          type="submit"
          color="red"
          onClick={() => deployApplication(application)}
          className="mb-3"
        >
          <FontAwesomeIcon icon={faCloudArrowUp} size="lg" />
          <span className="ml-2">RE-DEPLOY {application}</span>
        </Button>
        <div className="hover:cursor-pointer">
          {deploymentSummary?.ready && (
            <p className="text-center text-xs">
              <FontAwesomeIcon
                icon={faRedo}
                size="xs"
                className="mr-1 hover:cursor-pointer hover:text-movet-green ease-in-out duration-500"
                onClick={() => {
                  toast(
                    `${application} App Deployment Status is Refreshing...`,
                    {
                      icon: (
                        <FontAwesomeIcon
                          icon={faCircleCheck}
                          size="sm"
                          className="text-movet-green"
                        />
                      ),
                    },
                  );
                  getDeploymentStatus(application);
                }}
              />
              Last Deployment:{" "}
              <span
                className="italic"
                onClick={() =>
                  window.open(deploymentSummary?.inspectorUrl, "_blank")
                }
              >
                {new Date(deploymentSummary?.ready).toLocaleTimeString(
                  "en-US",
                  {
                    // timeZone: "America/Denver",
                    timeZoneName: "short",
                    day: "numeric",
                    month: "numeric",
                    year: "numeric",
                    hour12: true,
                    hour: "2-digit",
                    minute: "2-digit",
                  },
                )}
              </span>
            </p>
          )}
          {deploymentSummary?.readyState &&
            deploymentSummary?.readyState !== "READY" && (
              <p
                className="text-center text-xs text-movet-red"
                onClick={() =>
                  window.open(deploymentSummary?.inspectorUrl, "_blank")
                }
              >
                Status:{" "}
                <span className="italic">{deploymentSummary?.readyState}</span>
              </p>
            )}
        </div>
      </div>
    );
  };

  return (
    <AdminCheck>
      <div className="bg-white shadow overflow-hidden rounded-lg mb-4">
        <div className="flex flex-row items-center justify-center -mb-4">
          <FontAwesomeIcon
            icon={faCloudArrowUp}
            className={"text-movet-green"}
            size="lg"
          />
          <h1 className="ml-2 my-4 text-lg cursor-pointer">
            Re-Deploy an Application
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
                  Use this tool to manually trigger deployments of MoVET
                  applications.
                </p>
                <p className="mt-2 text-center text-xs italic">
                  This is useful when changes made in the Admin app are not
                  being reflected on the marketing website or scheduling app.
                </p>
                <div className="flex flex-col md:flex-row w-full mx-auto">
                  <DeploymentTool
                    application="MARKETING"
                    deploymentSummary={marketingDeploymentSummary}
                  />
                  <DeploymentTool
                    application="WEB"
                    deploymentSummary={webDeploymentSummary}
                  />
                  <DeploymentTool
                    application="ADMIN"
                    deploymentSummary={adminDeploymentSummary}
                  />
                </div>
                <p className="text-center text-sm italic text-movet-red">
                  NOTE: Deployments can take up to 5 minutes to complete...
                </p>
                <p className="text-center text-xs italic text-movet-red">
                  Contact technical support if it&apos;s been more than 15
                  minutes and the &quot;Last Deployment&quot; time is not
                  updating after clicking on the refresh button for that
                  application.
                </p>
              </div>
            </div>
          </li>
        </ul>
      </div>
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
                  "flex flex-col items-center px-4 py-4 sm:px-6 mx-auto max-w-xl"
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
