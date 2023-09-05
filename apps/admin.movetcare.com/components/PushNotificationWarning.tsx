import { faLink, faWarning } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { isSupported } from "firebase/messaging";
import { useEffect, useState } from "react";
export const PushNotificationWarning = () => {
  const [notificationPermissionRequired, setNotificationPermissionRequired] =
    useState<boolean | null>(null);

  useEffect(() => {
    const checkNotificationsSupported = async () => {
      const pushNotificationsSupported = await isSupported();
      if (pushNotificationsSupported) {
        if (Notification.permission !== "granted")
          setNotificationPermissionRequired(true);
      } else setNotificationPermissionRequired(false);
    };
    checkNotificationsSupported();
  }, []);

  return notificationPermissionRequired ? (
    <div className="rounded-md bg-movet-yellow p-4 mb-8">
      <div className="flex flex-row items-center justify-center">
        <div className="flex-shrink-0">
          <FontAwesomeIcon
            icon={faWarning}
            className="text-movet-white mr-4"
            size="2x"
          />
        </div>
        <div className="ml-3">
          <h2 className="font-extrabold text-movet-white m-0">
            Attention needed - Push Notification Permissions Missing!
          </h2>
          <div className="mt-1 text-movet-white">
            <p>
              You are missing the permission required to receive push
              notifications on this device. Please enable push notifications in
              your browser settings.
            </p>
          </div>
        </div>
      </div>
    </div>
  ) : notificationPermissionRequired === false ? (
    <div className="rounded-md bg-movet-red p-4 mb-8">
      <div className="flex flex-row items-center justify-center">
        <div className="flex-shrink-0">
          <FontAwesomeIcon
            icon={faWarning}
            className="text-movet-white mr-4"
            size="2x"
          />
        </div>
        <div className="ml-3">
          <h2 className="font-extrabold text-movet-white m-0">
            Push Notifications are NOT Supported
          </h2>
          <div className="mt-1 text-movet-white">
            <p>
              You are missing the Browser APIs required to receive push
              notifications. Please upgrade your browser to the latest version!
            </p>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <></>
  );
};
