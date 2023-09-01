import React, { useCallback, useEffect, useState } from "react";
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
  const [currentNotification, setCurrentNotification] = useState<any>(null);

  const displayNotification = useCallback(
    (payload: any) =>
      toast.custom(
        (t: any) => (
          <div
            className="bg-white border-movet-red border-2 p-4 rounded-xl flex flex-row items-center min-w-min cursor-pointer ease-in-out duration-300 hover:border-movet-black"
            onClick={() => {
              payload?.fcmOptions?.link
                ? (router.push(payload?.fcmOptions?.link) as any)
                : (router.push("/telehealth/chat") as any);
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
              <p className="text-sm text-left">{payload.notification.body}</p>
            </div>
            <FontAwesomeIcon icon={faArrowRight} />
          </div>
        ),
        {
          duration: 50000,
        },
      ),
    [router],
  );

  useEffect(() => {
    if (router && query) {
      notifications
        .onMessageListener()
        .then((payload: any) => {
          console.log("PUSH NOTIFICATION RECEIVED - Init", payload);
          setCurrentNotification(payload);
          if (!payload?.fcmOptions?.link.includes(query?.id))
            displayNotification(payload);
        })
        .catch((error) => console.error("PUSH NOTIFICATION FAILURE: ", error));
    }
  }, [displayNotification, query, router]);

  useEffect(() => {
    if (currentNotification)
      notifications
        .onMessageListener()
        .then((payload: any) => {
          console.log(
            "PUSH NOTIFICATION RECEIVED - currentNotification",
            payload,
          );
          setCurrentNotification(payload);
          if (!payload?.fcmOptions?.link.includes(query?.id))
            displayNotification(payload);
        })
        .catch((error) => console.error("PUSH NOTIFICATION FAILURE: ", error));
  }, [currentNotification, displayNotification, query?.id, router]);

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
