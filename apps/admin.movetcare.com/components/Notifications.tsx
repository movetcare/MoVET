import React, { useEffect } from "react";
import "firebase/messaging";
import { toast, Toaster, ToastBar } from "react-hot-toast";
import { useRouter } from "next/router";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import { notifications } from "services/notifications";

const Notifications = ({ children }: any) => {
  const router = useRouter();
  const { query } = router;

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.addEventListener("message", (event) => {
        console.log("event for the service worker", event?.data || event);
      });
    } else
      alert(
        "WARNING - Service Workers are not supported in this browser! Push Notifications will NOT work...",
      );
  }, []);

  useEffect(() => {
    const setToken = async () => await notifications.configure();
    setToken();
    notifications
      .onMessageListener()
      .then((payload: any) => {
        console.log("PUSH NOTIFICATION RECEIVED", payload);
        if (!payload?.fcmOptions?.link.includes(query?.id))
          toast.custom(
            (t: any) => (
              <div
                className="bg-white border-movet-red border-2 p-4 rounded-xl flex flex-row items-center min-w-min cursor-pointer ease-in-out duration-300 hover:border-movet-black"
                onClick={() => {
                  payload?.fcmOptions?.link
                    ? router.push(payload?.fcmOptions?.link)
                    : "/telehealth/chat";
                  toast.dismiss(t.id);
                }}
              >
                <Image
                  src="/images/icons/telehealth.svg"
                  alt={`Telehealth icon`}
                  width={50}
                  height={50}
                />
                <div className="flex flex-col px-4 -ml-4">
                  <h1 className="text-base text-left">
                    {payload.notification.title}
                  </h1>
                  <p className="text-sm text-left">
                    {payload.notification.body}
                  </p>
                </div>
                <FontAwesomeIcon icon={faArrowRight} />
              </div>
            ),
            {
              duration: 50000,
            },
          );
      })
      .catch((error) => console.error("PUSH NOTIFICATION FAILURE: ", error));
    return;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Toaster position="top-right" reverseOrder={false}>
        {(t: any) => (
          <ToastBar toast={t}>
            {({ icon, message }) => (
              <>
                {icon}
                {message}
              </>
            )}
          </ToastBar>
        )}
      </Toaster>
      {children}
    </>
  );
};

export default Notifications;
