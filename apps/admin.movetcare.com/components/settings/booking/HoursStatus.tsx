import { Divider } from "components/Divider";
import { useState } from "react";
import { Loader } from "ui";

export const HoursStatus = () => {
  const [isLoading, setIsLoading] = useState(false);
  return (
    <div className="py-4 flex-col sm:flex-row items-center justify-center">
      <h3>HOURS STATUS</h3>
      <p className="text-sm">
        Use this setting to change the OPEN/CLOSE status on the{" "}
        <a
          href="https://movetcare.com/hours"
          target="_blank"
          className="text-movet-red hover:underline"
        >
          website hours page
        </a>
        .
      </p>
      <Divider />
      {isLoading ? <Loader message="Loading Openings" /> : <p>test</p>}
    </div>
  );
};
