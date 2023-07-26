import Breadcrumbs from "components/Breadcrumbs";
import "react-tooltip/dist/react-tooltip.css";
import { Closures } from "./Closures";
import { Openings } from "./Openings";
import { HoursStatus } from "./HoursStatus";

const ManageSchedule = () => {
  return (
    <section className="flex flex-row items-center justify-center bg-white rounded-lg">
      <div className="bg-white rounded-lg w-full">
        <div className="px-8 my-4 w-full border-b pb-4 border-movet-gray">
          <Breadcrumbs
            pages={[
              { name: "Settings", href: "/settings/", current: false },
              {
                name: "Manage Hours",
                href: "/settings/booking/manage-schedules/",
                current: true,
              },
            ]}
          />
        </div>
        <div className="divide-y divide-movet-gray">
          <section className="divide-y divide-movet-gray lg:col-span-9">
            <div className="divide-y divide-movet-gray">
              <div className="px-4 sm:px-6">
                <h2 className="text-2xl mb-2 leading-6 font-medium text-movet-black">
                  Manage Hours
                </h2>
                <p className="text-sm text-movet-black -mt-1">
                  Use these options to control the availability of appointments
                  and the hours of operation.
                </p>
              </div>
              <ul className="mt-4 mb-8 divide-y divide-movet-gray px-8">
                <li className="py-4 flex-col sm:flex-row items-center justify-center">
                  <HoursStatus />
                </li>
                <li className="py-4 flex-col sm:flex-row items-center justify-center">
                  <Openings />
                </li>
                <li className="py-4 flex-col sm:flex-row items-center justify-center">
                  <Closures />
                </li>
              </ul>
            </div>
          </section>
        </div>
      </div>
    </section>
  );
};

export default ManageSchedule;
