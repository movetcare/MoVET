import { faBell } from "@fortawesome/free-solid-svg-icons";
import AdminCheck from "./AdminCheck";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Error from "components/Error";
import { Loader } from "ui";
import { useState } from "react";
import { TestAdminPushNotifications } from "./TestAdminPushNotifications";

export const PushNotificationsWidget = () => {
  const [isLoading] = useState(false);
  const [error] = useState<any>(null);

  return (
    <AdminCheck>
      <div className="bg-white shadow overflow-hidden rounded-lg my-4">
        <div className="flex flex-row items-center justify-center -mb-4">
          <FontAwesomeIcon icon={faBell} className="text-movet-red" size="lg" />
          <h1 className="ml-2 my-4 text-lg">Push Notifications</h1>
        </div>
        {isLoading ? (
          <div className="mb-6">
            <Loader height={200} width={200} />
          </div>
        ) : error ? (
          <div className="px-8 pb-8">
            <Error error={error} />
          </div>
        ) : (
          <>
            <ul
              role="list"
              className="divide-y divide-movet-gray border-t border-movet-gray mt-4"
            >
              <li>
                <p>CLIENT NOTIFICATIONS</p>
              </li>
            </ul>
            <TestAdminPushNotifications />
          </>
        )}
      </div>
    </AdminCheck>
  );
};
