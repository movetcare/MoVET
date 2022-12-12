import {
  faEnvelopeSquare,
  faPhone,
  faRedo,
  faSpinner,
  faCircleExclamation,
  faCheckCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { DEBUG_TOGGLE, DEBUG } from "components/Debug";
import { collection, orderBy, query } from "firebase/firestore";
import { useState, useEffect } from "react";
import { useCollection } from "react-firebase-hooks/firestore";
import { auth, firestore, functions } from "services/firebase";
import Error from "components/Error";
import { isValidEmail } from "utils/isValidEmail";
import Breadcrumbs from "components/Breadcrumbs";
import toast from "react-hot-toast";
import { httpsCallable } from "firebase/functions";
import { onAuthStateChanged } from "firebase/auth";
import { formatPhoneNumber } from "utils/formatPhoneNumber";
import Button from "components/Button";
import Image from "next/image";

const ManageUsers = () => {
  const [isSuperAdmin, setIsSuperAdmin] = useState<boolean>(false);
  const [showDebug, setShowDebug] = useState<boolean>(false);
  const [admins, loadingAdmins, errorAdmins] = useCollection(
    query(collection(firestore, "admins"), orderBy("roles"))
  );
  const [users, loadingUsers, errorUsers] = useCollection(
    query(collection(firestore, "users"), orderBy("updatedOn", "desc"))
  );
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const claimsString = (user as any)?.reloadUserInfo?.customAttributes;
        if (claimsString) {
          const claims = JSON.parse(claimsString);
          if (claims?.isSuperAdmin) setIsSuperAdmin(true);
        }
      }
    });
    return () => unsubscribe();
  }, []);
  const resyncProVetUsers = async () => {
    toast("Re-Syncing All ProVet Users...", {
      duration: 1500,
      icon: (
        <FontAwesomeIcon
          icon={faSpinner}
          size="sm"
          className="text-movet-gray"
          spin
        />
      ),
    });
    await httpsCallable(functions, "resyncProVetUsers")()
      .then(() =>
        toast("Finished Re-Syncing All ProVet Users", {
          icon: (
            <FontAwesomeIcon
              icon={faCheckCircle}
              size="sm"
              className="text-movet-green"
            />
          ),
        })
      )
      .catch((error: any) =>
        toast(error?.message, {
          icon: (
            <FontAwesomeIcon
              icon={faCircleExclamation}
              size="sm"
              className="text-movet-red"
            />
          ),
        })
      );
  };

  return (
    <section className="flex flex-row items-center justify-center px-4 sm:px-6 lg:px-8 bg-white rounded-lg p-8 overflow-hidden">
      <div className="w-full">
        <>
          <Breadcrumbs
            pages={[
              { name: "Settings", href: "/settings/", current: false },
              { name: "Manage Users", href: "/settings/users/", current: true },
            ]}
          />
          {(loadingUsers || loadingAdmins) && (
            <h3 className="text-center uppercase italic">Loading...</h3>
          )}
          {errorUsers ||
            (errorAdmins && (
              <div className="my-4">
                <Error error={errorUsers || errorAdmins} />
              </div>
            ))}
          {admins && (
            <>
              <div className="sm:flex sm:items-center mb-8 mt-6">
                <div className="sm:flex-auto">
                  <h1 className="text-xl font-semibold text-movet-black text-left">
                    Admin Users
                  </h1>
                </div>
                <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
                  {isSuperAdmin && (
                    <DEBUG_TOGGLE
                      showDebug={showDebug}
                      setShowDebug={setShowDebug}
                    />
                  )}
                </div>
              </div>
              <table className="min-w-full divide-y divide-movet-gray overflow-hidden shadow rounded-lg md:mx-0">
                <thead className="bg-movet-red">
                  <tr>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-xs sm:text-sm font-semibold text-white"
                    >
                      ID
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-xs sm:text-sm font-semibold text-white table-cell"
                    >
                      Role(s)
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-movet-gray bg-white">
                  {admins &&
                    admins.docs.length > 0 &&
                    admins.docs.map((admin: any) => {
                      console.log(admin.data());
                      return admin.data() !== undefined ? (
                        <>
                          <tr key={admin.data()?.id}>
                            <td className="whitespace-nowrap px-3 py-4 text-xs sm:text-sm text-movet-black">
                              {isValidEmail(admin.data()?.id) ? (
                                <FontAwesomeIcon
                                  icon={faEnvelopeSquare}
                                  size="lg"
                                />
                              ) : (
                                <FontAwesomeIcon icon={faPhone} size="lg" />
                              )}
                              <a
                                href={
                                  (isValidEmail(admin.data()?.id)
                                    ? "mailto://"
                                    : "tel://") + `${admin.data()?.id}`
                                }
                                target="_blank"
                                className="ml-2 hover:underline ease-in-out duration-500 hover:text-movet-red truncate"
                                rel="noreferrer"
                              >
                                {isValidEmail(admin.data()?.id)
                                  ? admin.data()?.id
                                  : formatPhoneNumber(admin.data()?.id)}
                              </a>
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-xs sm:text-sm text-movet-black table-cell">
                              {admin
                                .data()
                                ?.roles.map((role: string, index: number) =>
                                  admin.data()?.roles.length > 1 &&
                                  index !== admin.data()?.roles.length - 1
                                    ? `${role?.toUpperCase()}, `
                                    : role?.toUpperCase()
                                )}
                            </td>
                          </tr>
                          {showDebug && (
                            <tr className="w-full">
                              <td className="w-full" colSpan={5}>
                                <DEBUG show={showDebug} json={admin.data()} />
                              </td>
                            </tr>
                          )}
                        </>
                      ) : (
                        <></>
                      );
                    })}
                </tbody>
              </table>
            </>
          )}
          {users && (
            <>
              <div className="sm:flex sm:items-center mt-8">
                <div className="sm:flex-auto">
                  <h1 className="text-xl font-semibold text-movet-black text-left">
                    ProVet Users
                  </h1>
                  <p className="text-xs italic">
                    <>
                      Updated:{" "}
                      {users &&
                        users.docs.length > 0 &&
                        users.docs.map((user: any, index: number) =>
                          user.data()?.updatedOn !== undefined &&
                          index === 0 ? (
                            <span>
                              {user
                                .data()
                                ?.updatedOn?.toDate()
                                ?.toLocaleString()
                                ?.toString()}
                            </span>
                          ) : (
                            ""
                          )
                        )}
                    </>
                  </p>
                </div>
                <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
                  <Button
                    color="black"
                    onClick={async () => {
                      await resyncProVetUsers();
                    }}
                  >
                    <span className="flex-shrink-0 cursor-pointer mr-2">
                      <FontAwesomeIcon
                        icon={faRedo}
                        className="text-movet-white"
                      />
                    </span>
                    Re-Sync Users w/ ProVet
                  </Button>
                </div>
              </div>
              <div className="mt-8 overflow-hidden shadow rounded-lg md:mx-0">
                <table className="min-w-full divide-y divide-movet-gray">
                  <thead className="bg-movet-red">
                    <tr>
                      <th className="hidden px-3 py-3.5 text-left text-xs sm:text-sm font-semibold text-white sm:table-cell">
                        ID
                      </th>
                      <th
                        scope="col"
                        className="py-3.5 pl-4 pr-3 text-left text-xs sm:text-sm font-semibold text-white sm:pl-20"
                      >
                        Name
                      </th>
                      <th className="hidden px-3 py-3.5 text-left text-xs sm:text-sm font-semibold text-white sm:table-cell">
                        Phone
                      </th>
                      <th
                        scope="col"
                        className="hidden px-3 py-3.5 text-left text-xs sm:text-sm font-semibold text-white  sm:table-cell"
                      >
                        Role
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-xs sm:text-sm font-semibold text-white"
                      >
                        Status
                      </th>
                      <th
                        scope="col"
                        className="hidden px-3 py-3.5 text-left text-xs sm:text-sm font-semibold text-white sm:table-cell"
                      >
                        Last Login
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-movet-gray bg-white">
                    {users &&
                      users.docs.length > 0 &&
                      users.docs.map((user: any) =>
                        user.data() !== undefined ? (
                          <>
                            <tr key={user.data()?.email}>
                              <td className="hidden sm:table-cell whitespace-nowrap px-3 py-4 text-xs sm:text-sm text-movet-black">
                                <a
                                  href={`tel://${user.data()?.phone}`}
                                  target="_blank"
                                  className="hover:underline ease-in-out duration-500 hover:text-movet-red text-xs sm:text-sm"
                                  rel="noreferrer"
                                >
                                  {user.data()?.id}
                                </a>
                              </td>
                              <td className="whitespace-nowrap py-4 pl-4 pr-3 text-xs sm:text-sm sm:pl-6">
                                <div className="flex items-center">
                                  <div className="h-10 w-10 flex-shrink-0">
                                    {user.data()?.picture ? (
                                      <Image
                                        className="h-10 w-10 rounded-full"
                                        src={user.data()?.picture}
                                        alt="User Photo"
                                        height={50}
                                        width={50}
                                        priority
                                      />
                                    ) : (
                                      <p className="flex h-10 w-10 rounded-full border border-movet-gray items-center justify-center text-center">
                                        {user.data()?.initials}
                                      </p>
                                    )}
                                  </div>
                                  <div className="ml-4">
                                    <div className="font-medium text-movet-black">
                                      {user.data()?.firstName}{" "}
                                      {user.data()?.lastName}
                                    </div>
                                    <div className="text-movet-black">
                                      <a
                                        href={`mailto://${user.data()?.email}`}
                                        target="_blank"
                                        className="hover:underline ease-in-out duration-500 hover:text-movet-red"
                                        rel="noreferrer"
                                      >
                                        {user.data()?.email}
                                      </a>
                                    </div>
                                    <div className="text-xs sm:text-sm text-movet-black">
                                      {user.data().title}
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="hidden sm:table-cell whitespace-nowrap px-3 py-4 text-xs sm:text-sm text-movet-black">
                                <a
                                  href={`tel://${user.data()?.phone}`}
                                  target="_blank"
                                  className="hover:underline ease-in-out duration-500 hover:text-movet-red text-xs sm:text-sm"
                                  rel="noreferrer"
                                >
                                  {formatPhoneNumber(
                                    user.data()?.phone.slice(2)
                                  )}
                                </a>
                              </td>
                              <td className="hidden whitespace-nowrap px-3 py-4 text-xs sm:text-sm text-movet-black sm:table-cell">
                                {user.data()?.userType === 1 && "Veterinarian"}
                                {user.data()?.userType === 2 && "Support"}
                                {user.data()?.userType === 3 && "Administrator"}
                                {user.data()?.userType === 4 && "Technical"}
                              </td>
                              <td className="whitespace-nowrap px-3 py-4 text-xs sm:text-sm text-movet-black table-cell">
                                {user.data()?.isActive ? (
                                  <span className="inline-flex rounded-full bg-movet-green px-2 text-xs font-semibold leading-5 text-movet-white">
                                    ACTIVE
                                  </span>
                                ) : (
                                  <span className="inline-flex rounded-full bg-movet-gray px-2 text-xs font-semibold leading-5 text-gray">
                                    INACTIVE
                                  </span>
                                )}
                              </td>
                              <td className="hidden whitespace-nowrap px-3 py-4 text-xs sm:text-sm text-movet-black sm:table-cell">
                                {user.data()?.lastLogin !== null
                                  ? user
                                      .data()
                                      ?.lastLogin?.toDate()
                                      ?.toLocaleString()
                                      ?.toString()
                                  : "None"}
                              </td>
                            </tr>
                            {showDebug && (
                              <tr className="w-full">
                                <td className="w-full" colSpan={5}>
                                  <DEBUG show={showDebug} json={user.data()} />
                                </td>
                              </tr>
                            )}
                          </>
                        ) : (
                          <></>
                        )
                      )}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </>
      </div>
    </section>
  );
};

export default ManageUsers;
