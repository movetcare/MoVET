import { Listbox, Transition } from '@headlessui/react';
import {
  faCheck,
  faCheckCircle,
  faCircleExclamation,
  faList,
} from '@fortawesome/free-solid-svg-icons';
import { classNames } from 'utils/classNames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Error from '../../Error';
import Loader from '../../Loader';
import {
  query,
  collection,
  orderBy,
  doc,
  serverTimestamp,
  setDoc,
  onSnapshot,
} from 'firebase/firestore';
import { useCollection } from 'react-firebase-hooks/firestore';
import { firestore } from 'services/firebase';
import toast from 'react-hot-toast';
import { Fragment, useEffect, useState } from 'react';
import { PatternFormat, NumericFormat } from 'react-number-format';

const ClinicSettings = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<any>(null);
  const [selectedStandardVcprReason, setSelectedStandardVcprReason] =
    useState<string>('Select a Reason...');
  const [didTouchStandardVcprReason, setDidTouchStandardVcprReason] =
    useState<boolean>(false);
  const [selectedMinorIllnessVcprReason, setSelectedMinorIllnessVcprReason] =
    useState<string>('Select a Reason...');
  const [didTouchMinorIllnessVcprReason, setDidTouchMinorIllnessVcprReason] =
    useState<boolean>(false);
  const [selectedLunchTime, setSelectedLunchTime] = useState<string | null>(
    null
  );
  const [didTouchLunchTime, setDidTouchLunchTime] = useState<boolean>(false);

  const [selectedLunchDuration, setSelectedLunchDuration] = useState<
    string | null
  >(null);
  const [didTouchLunchDuration, setDidTouchLunchDuration] =
    useState<boolean>(false);
  const [selectedOnePatientDuration, setSelectedOnePatientDuration] = useState<
    string | null
  >(null);
  const [didTouchOnePatientDuration, setDidTouchOnePatientDuration] =
    useState<boolean>(false);
  const [selectedTwoPatientDuration, setSelectedTwoPatientDuration] = useState<
    string | null
  >(null);
  const [didTouchTwoPatientDuration, setDidTouchTwoPatientDuration] =
    useState<boolean>(false);
  const [selectedThreePatientDuration, setSelectedThreePatientDuration] =
    useState<string | null>(null);
  const [didTouchThreePatientDuration, setDidTouchThreePatientDuration] =
    useState<boolean>(false);
  const [reasons, loadingReasons, errorReasons] = useCollection(
    query(collection(firestore, 'reasons'), orderBy('name', 'asc'))
  );
  useEffect(() => {
    if (reasons) {
      const unsubscribe = onSnapshot(
        doc(firestore, 'configuration', 'booking'),
        (doc: any) => {
          reasons.docs.forEach((reason: any) => {
            if (reason.data()?.id === doc.data()?.clinicStandardVcprReason)
              setSelectedStandardVcprReason(reason.data()?.name);
            if (reason.data()?.id === doc.data()?.clinicMinorIllnessVcprReason)
              setSelectedMinorIllnessVcprReason(reason.data()?.name);
            if (doc.data()?.clinicLunchTime)
              setSelectedLunchTime(doc.data()?.clinicLunchTime);
            if (doc.data()?.clinicLunchDuration)
              setSelectedLunchDuration(doc.data()?.clinicLunchDuration);
            if (doc.data()?.clinicOnePatientDuration)
              setSelectedOnePatientDuration(
                doc.data()?.clinicOnePatientDuration
              );
            if (doc.data()?.clinicTwoPatientDuration)
              setSelectedTwoPatientDuration(
                doc.data()?.clinicTwoPatientDuration
              );
            if (doc.data()?.clinicThreePatientDuration)
              setSelectedThreePatientDuration(
                doc.data()?.clinicThreePatientDuration
              );
          });
          setIsLoading(false);
        },
        (error: any) => {
          setError(error?.message || error);
          setIsLoading(false);
        }
      );
      return () => unsubscribe();
    } else return;
  }, [reasons]);
  useEffect(() => {
    if (
      reasons &&
      didTouchStandardVcprReason &&
      selectedStandardVcprReason !== 'Select a Reason...'
    ) {
      const updateClinicBookingConfiguration = async () => {
        let reasonId: number | null = null;
        reasons.docs.forEach((reason: any) =>
          reason.data()?.name === selectedStandardVcprReason
            ? (reasonId = reason.data()?.id)
            : null
        );
        await setDoc(
          doc(firestore, 'configuration/booking'),
          {
            clinicStandardVcprReason: reasonId,
            updatedOn: serverTimestamp(),
          },
          { merge: true }
        )
          .then(() =>
            toast(
              `Standard VCPR Reason for Clinic Updated to "${selectedStandardVcprReason}"`,
              {
                position: 'top-center',
                icon: (
                  <FontAwesomeIcon
                    icon={faCheckCircle}
                    size="sm"
                    className="text-movet-green"
                  />
                ),
              }
            )
          )
          .catch((error: any) =>
            toast(`Standard VCPR Reason Update FAILED: ${error?.message}`, {
              duration: 5000,
              position: 'bottom-center',
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
      updateClinicBookingConfiguration();
    }
  }, [selectedStandardVcprReason, reasons, didTouchStandardVcprReason]);
  useEffect(() => {
    if (
      reasons &&
      didTouchMinorIllnessVcprReason &&
      selectedMinorIllnessVcprReason !== 'Select a Reason...'
    ) {
      const updateClinicBookingConfiguration = async () => {
        let reasonId: number | null = null;
        reasons.docs.forEach((reason: any) =>
          reason.data()?.name === selectedMinorIllnessVcprReason
            ? (reasonId = reason.data()?.id)
            : null
        );
        await setDoc(
          doc(firestore, 'configuration/booking'),
          {
            clinicMinorIllnessVcprReason: reasonId,
            updatedOn: serverTimestamp(),
          },
          { merge: true }
        )
          .then(() =>
            toast(
              `Minor Illness VCPR Reason for Clinic Updated to "${selectedMinorIllnessVcprReason}"`,
              {
                position: 'top-center',
                icon: (
                  <FontAwesomeIcon
                    icon={faCheckCircle}
                    size="sm"
                    className="text-movet-green"
                  />
                ),
              }
            )
          )
          .catch((error: any) =>
            toast(
              `Minor Illness VCPR Reason Update FAILED: ${error?.message}`,
              {
                duration: 5000,
                position: 'bottom-center',
                icon: (
                  <FontAwesomeIcon
                    icon={faCircleExclamation}
                    size="sm"
                    className="text-movet-red"
                  />
                ),
              }
            )
          );
      };
      updateClinicBookingConfiguration();
    }
  }, [selectedMinorIllnessVcprReason, reasons, didTouchMinorIllnessVcprReason]);
  useEffect(() => {
    if (
      reasons &&
      didTouchLunchTime &&
      selectedLunchTime &&
      selectedLunchTime !== ''
    ) {
      const updateClinicBookingConfiguration = async () => {
        await setDoc(
          doc(firestore, 'configuration/booking'),
          {
            clinicLunchTime: selectedLunchTime,
            updatedOn: serverTimestamp(),
          },
          { merge: true }
        )
          .then(() =>
            toast(`Clinic Lunch Time Updated to "${selectedLunchTime}"`, {
              position: 'top-center',
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
            toast(`Clinic Lunch Time Updated FAILED: ${error?.message}`, {
              duration: 5000,
              position: 'bottom-center',
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
      updateClinicBookingConfiguration();
    }
  }, [selectedLunchTime, reasons, didTouchLunchTime]);
  useEffect(() => {
    if (reasons && didTouchLunchDuration && selectedLunchDuration) {
      const updateClinicBookingConfiguration = async () => {
        await setDoc(
          doc(firestore, 'configuration/booking'),
          {
            clinicLunchDuration: selectedLunchDuration,
            updatedOn: serverTimestamp(),
          },
          { merge: true }
        )
          .then(() =>
            toast(
              `Clinic Lunch Duration Updated to "${selectedLunchDuration}"`,
              {
                position: 'top-center',
                icon: (
                  <FontAwesomeIcon
                    icon={faCheckCircle}
                    size="sm"
                    className="text-movet-green"
                  />
                ),
              }
            )
          )
          .catch((error: any) =>
            toast(`Clinic Lunch Duration Updated FAILED: ${error?.message}`, {
              duration: 5000,
              position: 'bottom-center',
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
      updateClinicBookingConfiguration();
    }
  }, [selectedLunchDuration, reasons, didTouchLunchDuration]);
  useEffect(() => {
    if (
      reasons &&
      ((didTouchOnePatientDuration && selectedOnePatientDuration) ||
        (didTouchTwoPatientDuration && selectedTwoPatientDuration) ||
        (didTouchThreePatientDuration && selectedThreePatientDuration)) &&
      selectedThreePatientDuration !== '' &&
      selectedTwoPatientDuration !== '' &&
      selectedOnePatientDuration !== ''
    ) {
      const updateClinicBookingConfiguration = async () => {
        await setDoc(
          doc(firestore, 'configuration/booking'),
          {
            clinicOnePatientDuration: selectedOnePatientDuration,
            clinicTwoPatientDuration: selectedTwoPatientDuration,
            clinicThreePatientDuration: selectedThreePatientDuration,
            updatedOn: serverTimestamp(),
          },
          { merge: true }
        )
          .then(() =>
            toast('Updated Multi-Patient Appointment Duration', {
              position: 'top-center',
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
            toast(
              `Multi-Patient Appointment Duration Updated FAILED: ${error?.message}`,
              {
                duration: 5000,
                position: 'bottom-center',
                icon: (
                  <FontAwesomeIcon
                    icon={faCircleExclamation}
                    size="sm"
                    className="text-movet-red"
                  />
                ),
              }
            )
          );
      };
      updateClinicBookingConfiguration();
    }
  }, [
    selectedOnePatientDuration,
    selectedTwoPatientDuration,
    selectedThreePatientDuration,
    reasons,
    didTouchOnePatientDuration,
    didTouchTwoPatientDuration,
    didTouchThreePatientDuration,
  ]);
  return (
    <form className="divide-y divide-movet-gray lg:col-span-9">
      <div className="divide-y divide-movet-gray">
        <>
          {loadingReasons || isLoading ? (
            <Loader />
          ) : errorReasons || error ? (
            <div className="my-4">
              <Error error={errorReasons || error} />
            </div>
          ) : (
            reasons &&
            reasons.docs.length > 0 && (
              <div className="px-4 sm:px-6">
                <div>
                  <h2 className="text-2xl mb-2 leading-6 font-medium text-movet-black">
                    CLINIC OPTIONS
                  </h2>
                  <p className="text-sm text-movet-black -mt-1">
                    Use the options below to configure how clients can book
                    appointments at the Clinic.
                  </p>
                </div>
                <ul
                  role="list"
                  className="mt-4 mb-8 divide-y divide-movet-gray"
                >
                  <li className="py-4 flex-col sm:flex-row items-center justify-center">
                    <div className="flex flex-col mr-4">
                      <h3>Standard Lunch</h3>
                      <p className="text-sm">
                        This controls availability of appointments during the
                        standard lunch hour. All available appointment slots
                        that overlap with this time and duration will be marked
                        as unavailable in the scheduling.
                      </p>
                    </div>
                    <div className="flex justify-center items-center my-4">
                      <div className="flex-col justify-center items-center mx-4">
                        <p className="text-center my-2">Start Time</p>
                        <PatternFormat
                          isAllowed={(values: any) => {
                            const { value } = values;
                            return value < 2401;
                          }}
                          format={'##:##'}
                          mask="_"
                          patternChar="#"
                          name={'lunch-start-time'}
                          type="text"
                          valueIsNumericString
                          value={selectedLunchTime}
                          onBlur={() => setDidTouchLunchTime(true)}
                          onValueChange={(target: any) =>
                            setSelectedLunchTime(target.value)
                          }
                          className={
                            'focus:ring-movet-brown focus:border-movet-brown py-3 px-3.5 block w-full rounded-lg placeholder-movet-gray font-abside-smooth sm:w-20'
                          }
                        />
                        <p className="text-center mt-2 italic text-xs">
                          (24 Hour)
                        </p>
                      </div>
                      <div className="flex-col justify-center items-center mx-4">
                        <p className="text-center my-2">Duration</p>
                        <NumericFormat
                          isAllowed={(values: any) => {
                            const { value } = values;
                            return value < 181;
                          }}
                          allowLeadingZeros={false}
                          allowNegative={false}
                          name={'lunch-duration'}
                          type="text"
                          valueIsNumericString
                          value={selectedLunchDuration}
                          onBlur={() => setDidTouchLunchDuration(true)}
                          onValueChange={(target: any) =>
                            setSelectedLunchDuration(target.value)
                          }
                          className={
                            'focus:ring-movet-brown focus:border-movet-brown py-3 px-4 block w-full rounded-lg placeholder-movet-gray font-abside-smooth sm:w-14'
                          }
                        />
                        <p className="text-center mt-2 italic text-xs">
                          (Minutes)
                        </p>
                      </div>
                    </div>
                  </li>
                  <li className="py-4 flex-col sm:flex-row items-center justify-center">
                    <div className="flex flex-col mr-4">
                      <h3>Multi-Patient Appointment Durations</h3>
                      <p className="text-sm">
                        This controls the duration of appointments depending on
                        the number of patients selected.
                      </p>
                    </div>
                    <div className="flex justify-center items-center my-4">
                      <div className="flex-col justify-center items-center mx-4">
                        <p className="text-center my-2">1 Patient</p>
                        <NumericFormat
                          isAllowed={(values: any) => {
                            const { value } = values;
                            return value < 181;
                          }}
                          allowLeadingZeros={false}
                          allowNegative={false}
                          name={'one-patient-duration'}
                          type="text"
                          valueIsNumericString
                          value={selectedOnePatientDuration}
                          onBlur={() => setDidTouchOnePatientDuration(true)}
                          onValueChange={(target: any) =>
                            setSelectedOnePatientDuration(target.value)
                          }
                          className={
                            'focus:ring-movet-brown focus:border-movet-brown py-3 px-3.5 block w-full rounded-lg placeholder-movet-gray font-abside-smooth sm:w-14'
                          }
                        />
                        <p className="text-center mt-2 italic text-xs">
                          Minutes
                        </p>
                      </div>
                      <div className="flex-col justify-center items-center mx-4">
                        <p className="text-center my-2">2 Patients</p>
                        <NumericFormat
                          isAllowed={(values: any) => {
                            const { value } = values;
                            return value < 181;
                          }}
                          allowLeadingZeros={false}
                          allowNegative={false}
                          name={'two-patient-duration'}
                          type="text"
                          valueIsNumericString
                          value={selectedTwoPatientDuration}
                          onBlur={() => setDidTouchTwoPatientDuration(true)}
                          onValueChange={(target: any) =>
                            setSelectedTwoPatientDuration(target.value)
                          }
                          className={
                            'focus:ring-movet-brown focus:border-movet-brown py-3 px-3.5 block w-full rounded-lg placeholder-movet-gray font-abside-smooth sm:w-14'
                          }
                        />
                        <p className="text-center mt-2 italic text-xs">
                          Minutes
                        </p>
                      </div>
                      <div className="flex-col justify-center items-center mx-4">
                        <p className="text-center my-2">3 Patients</p>
                        <NumericFormat
                          isAllowed={(values: any) => {
                            const { value } = values;
                            return value < 181;
                          }}
                          allowLeadingZeros={false}
                          allowNegative={false}
                          name={'three-patient-duration'}
                          type="text"
                          valueIsNumericString
                          value={selectedThreePatientDuration}
                          onBlur={() => setDidTouchThreePatientDuration(true)}
                          onValueChange={(target: any) =>
                            setSelectedThreePatientDuration(target.value)
                          }
                          className={
                            'focus:ring-movet-brown focus:border-movet-brown py-3 px-3.5 block w-full rounded-lg placeholder-movet-gray font-abside-smooth sm:w-14'
                          }
                        />
                        <p className="text-center mt-2 italic text-xs">
                          Minutes
                        </p>
                      </div>
                    </div>
                  </li>
                  <li className="py-4 flex-col sm:flex-row items-center justify-center">
                    <div className="flex flex-col mr-4">
                      <h3>
                        VCPR Reason - <b>Standard</b>
                      </h3>
                      <p className="text-sm">
                        This is the reason assigned to appointments when a 1st
                        time client (or existing client with a new pet) books an
                        appointment and does not indicate their pet(s) have a
                        minor illness.
                      </p>
                    </div>
                    <Listbox
                      value={selectedStandardVcprReason}
                      onChange={setSelectedStandardVcprReason}
                    >
                      {({ open }) => (
                        <>
                          <div
                            className={
                              'relative bg-white w-full sm:w-2/3 mx-auto my-4'
                            }
                          >
                            <Listbox.Button
                              className={
                                'border-movet-black focus:outline-none focus:ring-1 focus:ring-movet-brown focus:border-movet-brown relative border w-full bg-white rounded-md pl-3 pr-10 py-2 text-left cursor-default sm:text-sm'
                              }
                            >
                              {selectedStandardVcprReason && (
                                <span
                                  className={
                                    'text-movet-black block truncate font-abside-smooth text-base h-7 mt-1 ml-1'
                                  }
                                >
                                  {selectedStandardVcprReason}
                                </span>
                              )}
                              <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                                {false && (
                                  <FontAwesomeIcon
                                    icon={faList}
                                    className="h-4 w-4 mr-2"
                                    size="sm"
                                  />
                                )}
                              </span>
                            </Listbox.Button>
                            <Transition
                              show={open}
                              as={Fragment}
                              enter="transition duration-100 ease-out"
                              enterFrom="transform scale-95 opacity-0"
                              enterTo="transform scale-100 opacity-100"
                              leave="transition duration-75 ease-out"
                              leaveFrom="transform scale-100 opacity-100"
                              leaveTo="transform scale-95 opacity-0"
                            >
                              <Listbox.Options className="absolute z-50 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-movet-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                                {reasons &&
                                  reasons.docs.length > 0 &&
                                  reasons.docs.map((item: any) => (
                                    <Listbox.Option
                                      key={item.data()?.id}
                                      onClick={() =>
                                        setDidTouchStandardVcprReason(true)
                                      }
                                      className={({ active }) =>
                                        classNames(
                                          active
                                            ? 'text-movet-white bg-movet-brown'
                                            : 'text-movet-black',
                                          'text-left cursor-default select-none relative py-2 pl-4 pr-4'
                                        )
                                      }
                                      value={item.data()?.name}
                                    >
                                      {({ active, selected }) => (
                                        <>
                                          <span
                                            className={classNames(
                                              selected
                                                ? 'font-semibold'
                                                : 'font-normal',
                                              'block truncate ml-2'
                                            )}
                                          >
                                            #{item.data()?.id}-{' '}
                                            {item.data()?.name}
                                          </span>
                                          {selected ? (
                                            <span
                                              className={classNames(
                                                active
                                                  ? 'text-white'
                                                  : 'text-movet-black',
                                                'absolute inset-y-0 left-0 flex items-center pl-1.5'
                                              )}
                                            >
                                              <FontAwesomeIcon
                                                icon={faCheck}
                                                className="h-4 w-4"
                                                size="sm"
                                              />
                                            </span>
                                          ) : null}
                                        </>
                                      )}
                                    </Listbox.Option>
                                  ))}
                              </Listbox.Options>
                            </Transition>
                          </div>
                        </>
                      )}
                    </Listbox>
                    <div className="flex flex-col mr-4 mt-8">
                      <h3>
                        VCPR Reason - <b>Minor Illness</b>
                      </h3>
                      <p className="text-sm">
                        This is the reason assigned to appointments when a 1st
                        time client (or existing client with a new pet) books an
                        appointment and indicates their pet(s) do have a minor
                        illness.
                      </p>
                    </div>
                    <Listbox
                      value={selectedMinorIllnessVcprReason}
                      onChange={setSelectedMinorIllnessVcprReason}
                    >
                      {({ open }) => (
                        <>
                          <div
                            className={`relative bg-white w-full sm:w-2/3 mx-auto my-4 ${
                              open ? 'mb-72' : ''
                            }`}
                          >
                            <Listbox.Button
                              className={
                                'border-movet-black focus:outline-none focus:ring-1 focus:ring-movet-brown focus:border-movet-brown relative border w-full bg-white rounded-md pl-3 pr-10 py-2 text-left cursor-default sm:text-sm'
                              }
                            >
                              {selectedMinorIllnessVcprReason && (
                                <span
                                  className={
                                    'text-movet-black block truncate font-abside-smooth text-base h-7 mt-1 ml-1'
                                  }
                                >
                                  {selectedMinorIllnessVcprReason}
                                </span>
                              )}
                              <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                                {false && (
                                  <FontAwesomeIcon
                                    icon={faList}
                                    className="h-4 w-4 mr-2"
                                    size="sm"
                                  />
                                )}
                              </span>
                            </Listbox.Button>
                            <Transition
                              show={open}
                              as={Fragment}
                              enter="transition duration-100 ease-out"
                              enterFrom="transform scale-95 opacity-0"
                              enterTo="transform scale-100 opacity-100"
                              leave="transition duration-75 ease-out"
                              leaveFrom="transform scale-100 opacity-100"
                              leaveTo="transform scale-95 opacity-0"
                            >
                              <Listbox.Options className="absolute z-50 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-movet-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                                {reasons &&
                                  reasons.docs.length > 0 &&
                                  reasons.docs.map((item: any) => (
                                    <Listbox.Option
                                      key={item.data()?.id}
                                      onClick={() =>
                                        setDidTouchMinorIllnessVcprReason(true)
                                      }
                                      className={({ active }) =>
                                        classNames(
                                          active
                                            ? 'text-movet-white bg-movet-brown'
                                            : 'text-movet-black',
                                          'text-left cursor-default select-none relative py-2 pl-4 pr-4'
                                        )
                                      }
                                      value={item.data()?.name}
                                    >
                                      {({ active, selected }) => (
                                        <>
                                          <span
                                            className={classNames(
                                              selected
                                                ? 'font-semibold'
                                                : 'font-normal',
                                              'block truncate ml-2'
                                            )}
                                          >
                                            #{item.data()?.id}-{' '}
                                            {item.data()?.name}
                                          </span>
                                          {selected ? (
                                            <span
                                              className={classNames(
                                                active
                                                  ? 'text-white'
                                                  : 'text-movet-black',
                                                'absolute inset-y-0 left-0 flex items-center pl-1.5'
                                              )}
                                            >
                                              <FontAwesomeIcon
                                                icon={faCheck}
                                                className="h-4 w-4"
                                                size="sm"
                                              />
                                            </span>
                                          ) : null}
                                        </>
                                      )}
                                    </Listbox.Option>
                                  ))}
                              </Listbox.Options>
                            </Transition>
                          </div>
                        </>
                      )}
                    </Listbox>
                  </li>
                </ul>
              </div>
            )
          )}
        </>
      </div>
    </form>
  );
};

export default ClinicSettings;
