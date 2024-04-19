import { classNames } from "utils/classNames";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Breadcrumbs from "components/Breadcrumbs";
import { subNavigation } from "../SubNavigation";
import { onSnapshot, doc } from "firebase/firestore";
import { useState, useEffect } from "react";
import { firestore } from "services/firebase";
import Error from "../../../Error";
import { Loader } from "ui";
import { NewPopUpClinic } from "./NewPopUpClinic";
import { PopUpClinicConfiguration } from "./PopUpClinicConfiguration";
const PAGE_NAME = subNavigation[4].name;

const ManagePopUpClinics = () => {
  const [error, setError] = useState<any>(null);
  const [popUpClinics, setPopUpClinics] = useState<any>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      doc(firestore, "configuration", "pop_up_clinics"),
      (doc: any) => {
        console.log("doc.data()?.popUpClinics", doc.data()?.popUpClinics);
        setPopUpClinics(doc.data()?.popUpClinics);
        setIsLoading(false);
      },
      (error: any) => {
        setError(error?.message || error);
      },
    );
    return () => unsubscribe();
  }, []);

  return (
    <section className="flex flex-row items-center justify-center bg-white rounded-lg overflow-hidden">
      <div className="bg-white rounded-lg overflow-hidden w-full">
        <div className="px-8 my-4 w-full border-b pb-4 border-movet-gray">
          <Breadcrumbs
            pages={[
              { name: "Settings", href: "/settings/", current: false },
              {
                name: "Manage Booking",
                href: "/settings/booking/",
                current: false,
              },
              {
                name: "Pop-Up Clinics",
                href: "/settings/booking/pop-up-clinics",
                current: true,
              },
            ]}
          />
        </div>
        <div className="divide-y divide-movet-gray lg:grid lg:grid-cols-12 lg:divide-y-0 lg:divide-x -mt-4">
          <aside className="lg:col-span-3">
            <nav className="space-y-1">
              {subNavigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className={classNames(
                    item.name === PAGE_NAME
                      ? "bg-movet-red text-movet-white hover:bg-opacity-80 hover:text-movet-white"
                      : "border-transparent text-movet-black hover:bg-movet-white hover:text-movet-black",
                    "group border-l-4 px-3 py-2 flex items-center text-sm font-medium",
                  )}
                  aria-current={item.name === PAGE_NAME ? "page" : undefined}
                >
                  <FontAwesomeIcon
                    icon={item.icon}
                    className={classNames(
                      item.name === PAGE_NAME
                        ? "text-movet-white group-hover:text-movet-white"
                        : "text-movet-black group-hover:text-movet-black",
                      "flex-shrink-0 -ml-1 mr-3 h-6 w-6",
                    )}
                    aria-hidden="true"
                  />
                  <span className="truncate">{item.name}</span>
                </a>
              ))}
            </nav>
          </aside>
          <section className="divide-y divide-movet-gray lg:col-span-9">
            <div className="divide-y divide-movet-gray">
              {error ? (
                <Error error={error} />
              ) : isLoading ? (
                <Loader />
              ) : (
                <div className="px-4 sm:px-6">
                  {!popUpClinics || popUpClinics?.length === 0 ? (
                    <h2 className="text-2xl mt-8 leading-6 font-medium text-movet-black text-center">
                      NO POP-UP CLINICS FOUND...
                    </h2>
                  ) : (
                    <h2 className="text-2xl my-6 leading-6 font-medium text-movet-black text-center">
                      Pop-Up Clinics
                    </h2>
                  )}
                  {popUpClinics &&
                    popUpClinics?.map(
                      (popUpConfiguration: {
                        name: string;
                        description: string;
                        id: string;
                        resourceIds: Array<any> | undefined;
                      }) => (
                        <PopUpClinicConfiguration
                          key={popUpConfiguration?.id}
                          configuration={popUpConfiguration}
                          popUpClinics={popUpClinics}
                        />
                      ),
                    )}
                  <NewPopUpClinic />
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </section>
  );
};

export default ManagePopUpClinics;
