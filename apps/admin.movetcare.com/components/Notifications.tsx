import React, { useEffect } from "react";
import "firebase/messaging";
import { messages, pushConfig } from "services/firebase";
import { toast, Toaster, ToastBar } from "react-hot-toast";
import { useRouter } from "next/router";
import { faArrowRight, faCircleCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { onMessage } from "firebase/messaging";

const Notifications = ({ children }: any) => {
  const router = useRouter();
  useEffect(() => {
    if ("serviceWorker" in navigator)
      navigator.serviceWorker.addEventListener("message", (event) => {
        console.log("event for the service worker", event);
      });
    else console.error("service worker not supported");
    const setToken = async () => {
      try {
        const token = await pushConfig.init();
        if (token) {
          console.log("token", token);
          getMessage();
        }
      } catch (error) {
        console.log(error);
      }
    };
    setToken();
  }, []);

  const getMessage = () => {
    onMessage(messages, (message: any) => {
      console.log("PUSH MESSAGE", message);
      toast(JSON.stringify(message), {
        duration: 5000,
        icon: (
          <FontAwesomeIcon
            icon={faCircleCheck}
            size="sm"
            className="text-movet-yellow"
          />
        ),
      });
    });
  };

  return (
    <>
      <Toaster position="top-right" reverseOrder={false}>
        {(t: any) => {
          console.log("T", t);
          return (
            <ToastBar toast={t}>
              {({ icon, message }) => (
                <>
                  {icon}
                  {message}
                  {t.type !== "loading" && (
                    <FontAwesomeIcon
                      icon={faArrowRight}
                      onClick={() => router.push(t?.data?.url)}
                    />
                  )}
                </>
              )}
            </ToastBar>
          );
        }}
      </Toaster>
      {children}
    </>
  );
};

export default Notifications;
