import {
  faCheckCircle,
  faCircleExclamation,
  faEnvelopeSquare,
} from "@fortawesome/free-solid-svg-icons";
import AdminCheck from "./AdminCheck";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Error from "components/Error";
import { Button, Loader } from "ui";
import { useEffect, useState } from "react";
import {
  collection,
  doc,
  query,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { auth, firestore } from "services/firebase";
import { useCollection } from "react-firebase-hooks/firestore";
import { useForm } from "react-hook-form";
import { TextInput } from "ui/src/components/forms/inputs";
import Select, { components } from "react-select";
import toast from "react-hot-toast";
import { uuid } from "utils/uuid";

export const TestAdminPushNotifications = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<any>(null);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [activeAdminTokens, setActiveAdminTokens] = useState<any>(null);
  const [fcmTokensAdmin, loadingFcmTokensAdmin, errorFcmTokensAdmin] =
    useCollection(query(collection(firestore, "admin_push_tokens")));
  const {
    handleSubmit,
    control,
    reset,
    formState: { errors, isDirty, isSubmitting },
  } = useForm({
    mode: "onSubmit",
    defaultValues: {
      title: "",
      message: "",
      path: "/telehealth/chat/",
    },
  });

  useEffect(() => {
    if (fcmTokensAdmin && fcmTokensAdmin.docs.length > 0) {
      const activeAdminTokens: Array<any> = [];
      fcmTokensAdmin.docs.map((adminUser: any) => {
        adminUser?.data()?.tokens?.map((token: any) => {
          if (token?.isActive)
            activeAdminTokens.push({
              name: adminUser?.data()?.user?.displayName,
              uid: adminUser?.data()?.user?.uid,
              device: `${token?.device?.browser?.name} - ${token?.device?.os?.name}`,
              token: token?.token,
            });
        });
      });
      setActiveAdminTokens(activeAdminTokens);
      setIsLoading(false);
    }
  }, [fcmTokensAdmin]);

  useEffect(() => {
    if (errorFcmTokensAdmin) setError(errorFcmTokensAdmin);
  }, [errorFcmTokensAdmin]);

  useEffect(() => {
    if (loadingFcmTokensAdmin) setIsLoading(loadingFcmTokensAdmin);
  }, [loadingFcmTokensAdmin]);

  const onSubmit = async (data: any) => {
    const id = uuid();
    await setDoc(doc(firestore, `push_notifications/${id}`), {
      ...data,
      user: selectedUser,
      id,
      createdBy: {
        uid: auth?.currentUser?.uid,
        email: auth?.currentUser?.email,
        name: auth?.currentUser?.displayName,
      },
      category: "admin-test",
      status: "pending",
      createdOn: serverTimestamp(),
    })
      .then(() =>
        toast(
          `Sending Push Notification to ${selectedUser?.name} @ ${selectedUser?.device} ...`,
          {
            duration: 5000,
            icon: (
              <FontAwesomeIcon
                icon={faCheckCircle}
                size="sm"
                className="text-movet-green"
              />
            ),
          },
        ),
      )
      .catch((error: any) =>
        toast(`Push Notification FAILED: ${error?.message}`, {
          duration: 8000,
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

  const Option: any = (props: any) => (
    <>
      <components.Option {...props}>
        <div className="flex flex-row items-center justify-between">
          <div>{props.children}</div>
        </div>
      </components.Option>
    </>
  );

  const formatOptionLabel = ({
    name,
    device,
    token,
  }: {
    name: string;
    device: string;
    token: string;
  }) => (
    <div className="flex flex-col">
      <p className="flex flex-row items-center text-lg">
        {name} <span className="ml-2 text-sm italic">{device}</span>{" "}
        <span className="text-movet-gray text-sm italic ml-2">
          ...{token?.slice(-8)}
        </span>
      </p>
    </div>
  );

  return (
    <AdminCheck>
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
          {activeAdminTokens && activeAdminTokens.length > 0 && (
            <ul
              role="list"
              className="divide-y divide-movet-gray border-t border-movet-gray mt-4"
            >
              <li>
                <h2 className="text-center text-lg">
                  TEST ADMIN NOTIFICATIONS
                </h2>
                <form
                  onSubmit={handleSubmit(onSubmit as any)}
                  className="text-center text-sm px-8 mb-8"
                >
                  <div className="flex flex-col sm:flex-row justify-between items-center w-full mx-auto py-2">
                    <TextInput
                      required
                      className="w-full"
                      name="title"
                      label=""
                      placeholder="Title"
                      type="text"
                      errors={errors}
                      control={control}
                    />
                  </div>
                  <div className="flex flex-col sm:flex-row justify-between items-center w-full mx-auto py-2">
                    <TextInput
                      multiline
                      numberOfLines={3}
                      required
                      className="w-full"
                      name="message"
                      label=""
                      placeholder="Message"
                      type="text"
                      errors={errors}
                      control={control}
                    />
                  </div>
                  <div className="flex flex-col sm:flex-row justify-between items-center w-full mx-auto py-2">
                    <TextInput
                      required
                      className="w-full mb-2"
                      name="path"
                      label=""
                      placeholder="Link Path (ex: /telehealth/chat/)"
                      type="text"
                      errors={errors}
                      control={control}
                    />
                  </div>
                  <Select
                    isClearable
                    closeMenuOnSelect
                    closeMenuOnScroll
                    escapeClearsValue
                    menuShouldScrollIntoView
                    openMenuOnClick
                    isLoading={isLoading}
                    onChange={(option: any) => setSelectedUser(option)}
                    placeholder="Select a User"
                    loadingMessage={() => "Loading Admin Users..."}
                    noOptionsMessage={() => "No Admin Users Found..."}
                    formatOptionLabel={formatOptionLabel}
                    options={activeAdminTokens || []}
                    menuPosition="fixed"
                    components={{ Option }}
                    styles={{
                      input: (base: any) => ({
                        ...base,
                        fontFamily: "Abside Smooth",
                        borderWidth: 0,
                        borderColor: "transparent",
                        boxShadow: "none",
                        "input:focus": {
                          boxShadow: "none",
                          borderWidth: 0,
                          borderColor: "transparent",
                        },
                        "input:hover": {
                          boxShadow: "none",
                          borderWidth: 0,
                          borderColor: "transparent",
                        },
                      }),
                      control: (base: any) => ({
                        ...base,
                        boxShadow: "none",
                        borderWidth: 0,
                        borderColor: "transparent",
                        fontFamily: "Abside Smooth",
                      }),
                      option: (base: any, state: any) => ({
                        ...base,
                        boxShadow: "none",
                        fontWeight: state.isSelected ? "bold" : "normal",
                        fontFamily: "Abside Smooth",
                        color: state.isSelected ? "#f6f2f0" : "#232127",
                        backgroundColor: state.isSelected
                          ? "#E76159"
                          : "transparent",
                      }),
                      singleValue: (base: any, state: any) => ({
                        ...base,
                        borderWidth: 0,
                        borderColor: "transparent",
                        fontFamily: "Abside Smooth",
                        color: (state.data as any).color,
                      }),
                      indicatorSeparator: (base: any) => ({
                        ...base,
                        backgroundColor: "#232127",
                      }),
                      dropdownIndicator: (base: any) => ({
                        ...base,
                        color: "#232127",
                        ":hover": {
                          color: "#232127",
                        },
                      }),
                    }}
                    theme={(theme: any) => ({
                      ...theme,
                      borderRadius: 0,
                      colors: {
                        ...theme.colors,
                        danger: "#E76159",
                        primary50: "#A15643",
                        primary: "#232127",
                      },
                    })}
                    className="search-input border-movet-black/50 relative border w-full bg-white rounded-xl py-2 text-left cursor-pointer sm:text-sm"
                  />
                  <Button
                    type="submit"
                    color="black"
                    disabled={!isDirty || isSubmitting || selectedUser === null}
                    className="mt-8"
                    icon={faEnvelopeSquare}
                    text="Send Push Notification"
                  />
                </form>
              </li>
            </ul>
          )}
        </>
      )}
    </AdminCheck>
  );
};
