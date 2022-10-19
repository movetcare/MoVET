import { faTruckMedical } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const EmergencyWarning = () => (
  <>
    <div className="mt-8 mb-8 text-center text-movet-red mx-auto">
      <FontAwesomeIcon icon={faTruckMedical} size="3x" />
    </div>
    <h2 className="text-xl mt-0 text-center mb-6">Emergency Care Notice</h2>
    <p className="text-left">
      MoVET serves the Greater Denver area and offers primary, non-urgent
      services. We don&apos;t see new patients for sick appointments (basic
      wound care, chronic maintenance issues, and minor illness, such as
      vomiting, head shaking, itching, etc) unless you&apos;ve previously
      established care with MoVET during a wellness visit (annual wellness
      checkup examinations, quality of life assessments, new pet exams to
      establish care, puppy & kitten exams, and vaccine appointments).
    </p>
    <p className="text-left">
      We do not perform end-of-life veterinary care, nor do we perform
      anesthetic procedures, such as surgery or dentals, but will partner with
      you to make the best recommendation for you that fits your needs with a
      local practice or specialist in town who can help.
    </p>
    <p className="font-extrabold my-4 text-lg">
      If you think this is an animal emergency, please contact a 24/7 ER clinic
      or urgent care center:
    </p>
    <ul className="my-8">
      <li className="font-bold text-lg">EAST DENVER</li>
      <li>
        <a
          href="https://www.vrcc.com/"
          target="_blank"
          rel="noreferrer"
          className="text-movet-brown hover:underline"
        >
          VRCC Veterinary Specialty & Emergency Hospital
        </a>
      </li>
      {/* <li>3550 S Jason St, Englewood, CO 80110</li>
                <li>(303) 874-7387</li>
                <li>https://www.vrcc.com/</li> */}
    </ul>
    <ul className="my-8">
      <li className="font-bold text-lg">NW DENVER</li>
      <li>
        <a
          href="https://evolutionvet.com/"
          target="_blank"
          rel="noreferrer"
          className="text-movet-brown hover:underline"
        >
          Evolution Veterinary Specialists
        </a>
      </li>
      {/* <li>34 Van Gordon St Suite 160, Lakewood, CO 80228</li>
                <li>(720) 510-7707</li>
                <li>https://evolutionvet.com/</li> */}
    </ul>
    <ul className="my-8">
      <li className="font-bold text-lg">SE DENVER</li>
      <li>
        <a
          href="https://aescparker.com/"
          target="_blank"
          rel="noreferrer"
          className="text-movet-brown hover:underline"
        >
          Animal Emergency & Specialty Center (AESC)
        </a>
      </li>
      {/* <li>17701 Cottonwood Dr, Parker, CO 80134</li>
                <li>(720) 842-5050</li>
                <li>https://aescparker.com/</li> */}
    </ul>
    <ul className="my-8">
      <li className="font-bold text-lg">NE DENVER</li>
      <li>
        <a
          href="https://veterinaryemergencygroup.com/locations/denver-co/"
          target="_blank"
          rel="noreferrer"
          className="text-movet-brown hover:underline"
        >
          Veterinary Emergency Group (VEG)
        </a>
      </li>
      {/* <li>3845 E Colfax Ave, Denver, CO 80206</li>
                <li>(720) 574-9834</li>
                <li>
                  https://veterinaryemergencygroup.com/locations/denver-co/
                </li> */}
    </ul>
    <ul className="my-8">
      <li className="font-bold text-lg">WEST DENVER</li>
      <li>
        <a
          href="https://vcahospitals.com/deer-creek-littleton"
          target="_blank"
          rel="noreferrer"
          className="text-movet-brown hover:underline"
        >
          VCA Deer Creek Animal Hospital
        </a>
      </li>
      {/* <li>10148 W Chatfield Ave, Littleton, CO 80127</li>
                <li>(303) 973-4200</li>
                <li>
                  https://vcahospitals.com/deer-creek-littleton?utm_source=maps&utm_medium=organic&utm_campaign=VCA_Deer_Creek_Animal_Hospital
                </li> */}
    </ul>
    <ul className="my-8">
      <li className="font-bold text-lg">SOUTH DENVER </li>
      <li>
        <a
          href="https://www.cvsg.com/"
          target="_blank"
          rel="noreferrer"
          className="text-movet-brown hover:underline"
        >
          Colorado Veterinary Specialty Group (CVSG)
        </a>
      </li>
      {/* <li> 401 E County Line Rd, Littleton, CO 80122</li>
                <li>(303) 794-1188</li>
                <li> https://www.cvsg.com/</li> */}
    </ul>
  </>
);
