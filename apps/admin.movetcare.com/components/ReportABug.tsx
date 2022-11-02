import {
  faCircleCheck,
  faCircleExclamation,
  faSmile,
  faBug,
  faEnvelope,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { httpsCallable } from 'firebase/functions';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { functions, storage } from 'services/firebase';
import Button from './Button';
import SelectInput from './inputs/SelectInput';
import Loader from 'components/Loader';
import { ref, getDownloadURL, uploadBytesResumable } from 'firebase/storage';

const ReportABug = ({ type = 'bug' }: { type?: 'bug' | 'feature' }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedFiles, setSelectedFiles] = useState<any>();
  const [isFilePicked, setIsFilePicked] = useState<boolean>(type === 'feature');
  const {
    control,
    register,
    handleSubmit,
    reset,
    watch,
    formState: { isValid, isSubmitting, isDirty, errors },
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      name: '',
      description: '',
      url: '',
      application: { id: 'admin', name: 'Admin App - admin.movetcare.com' },
      priority: { id: 'low', name: 'Low' },
    },
  });

  const application = watch('application');

  const changeHandler = (event: any) => {
    setSelectedFiles(event.target.files);
    setIsFilePicked(true);
  };

  const onSubmit = async ({
    name,
    description,
    application,
    url,
    priority,
  }: {
    name: string;
    description: string;
    url: string;
    application:
      | { id: 'web'; name: 'Website - movetcare.com' }
      | { id: 'admin'; name: 'Admin App - admin.movetcare.com' }
      | { id: 'mobile'; name: 'Mobile iOS/Android App' };
    priority:
      | { id: 'low'; name: 'Low' }
      | { id: 'medium'; name: 'Medium' }
      | { id: 'high'; name: 'High' };
  }) => {
    setIsLoading(true);
    const fileUrls: Array<string> = [];
    await Promise.all(
      [...selectedFiles].map(async (fileData: any, index: number) => {
        const storageRef = ref(
          storage,
          `report_a_bug_internal/${fileData.name}`
        );
        const uploadTask = uploadBytesResumable(storageRef, fileData);
        await uploadTask.on(
          'state_changed',
          (snapshot: any) => {
            const progress = Math.round(
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            );
            console.log('File Upload %: ', progress);
          },
          (error: any) => {
            toast(error?.message, {
              icon: (
                <FontAwesomeIcon
                  icon={faCircleExclamation}
                  size="sm"
                  className="text-movet-red"
                />
              ),
            });
          },
          async () => {
            await getDownloadURL(uploadTask.snapshot.ref).then(
              async (downloadURL: string) => {
                fileUrls.push(downloadURL);
                if (index === selectedFiles.length - 1) {
                  await httpsCallable(
                    functions,
                    'reportABugInternal'
                  )({
                    type,
                    name,
                    description,
                    url,
                    application: application.id,
                    screenshot: fileUrls?.toString(),
                    priority: priority.id,
                  })
                    .then(() => {
                      toast(
                        `Your ${
                          type === 'feature'
                            ? 'new feature request'
                            : 'bug report'
                        } has been submitted!`,
                        {
                          icon: (
                            <FontAwesomeIcon
                              icon={faCircleCheck}
                              size="sm"
                              className="text-movet-green"
                            />
                          ),
                        }
                      );
                      reset();
                    })
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
                    )
                    .finally(() => setIsLoading(false));
                }
              }
            );
          }
        );
      })
    ).catch((error: any) =>
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
    <form
      onSubmit={handleSubmit(onSubmit as any)}
      className={`flex flex-col w-full mx-auto px-4 md:px-8 bg-white p-8 text-movet-black rounded-xl max-w-md justify-center items-center${
        isLoading ? ' overflow-hidden' : ''
      }`}
    >
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <div className="flex flex-col w-full items-center pt-4 mb-4">
            <label className="flex flex-row items-center w-full justify-center italic mt-2 mb-2 text-sm">
              <FontAwesomeIcon
                icon={type === 'feature' ? faSmile : faBug}
                size="2x"
                className={
                  type === 'feature' ? 'text-movet-green' : 'text-movet-red'
                }
              />
              <h1
                className={`ml-3 italic${
                  type === 'feature' ? 'text-movet-green' : ' text-movet-red'
                }`}
              >
                {type === 'feature' ? 'New Feature Request' : 'Report a Bug'}
              </h1>
            </label>
          </div>
          <label className="font-bold my-2 text-sm w-full">
            Name of {type === 'feature' ? 'Feature' : 'Bug'}
          </label>
          <input
            type="text"
            required
            placeholder="Write Something..."
            className="font-abside-smooth border-movet-black focus:outline-none focus:ring-1 focus:ring-movet-brown focus:border-movet-brown relative border w-full bg-white rounded-md pl-3 pr-10 py-2 text-left cursor-default sm:text-sm mb-2"
            {...register('name')}
          />
          <label className="font-bold my-2 text-sm w-full">Description</label>
          <textarea
            required
            placeholder="Please provide as much detail as possible..."
            className="font-abside-smooth border-movet-black focus:outline-none focus:ring-1 focus:ring-movet-brown focus:border-movet-brown relative border w-full bg-white rounded-md pl-3 pr-10 py-2 text-left cursor-default sm:text-sm mb-2"
            {...register('description')}
          />
          <label className="font-bold mb-2 text-sm w-full mt-2">
            Screenshot(s) or Recording(s)
          </label>
          <span className="my-2 w-full">
            <input
              type="file"
              name="file"
              onChange={changeHandler}
              required
              multiple
            />
          </span>
          <label className="font-bold mb-2 text-sm w-full mt-2">
            Application
          </label>
          <SelectInput
            label=""
            name="application"
            required
            values={[
              { id: 'web', name: 'Website - movetcare.com' },
              { id: 'admin', name: 'Admin App - admin.movetcare.com' },
              { id: 'mobile', name: 'Mobile iOS/Android App' },
            ]}
            errors={errors}
            control={control}
          />
          {(application.id === 'admin' || application.id === 'web') && (
            <>
              <label className="font-bold mb-2 mt-4 text-sm w-full">
                Related URL{' '}
                <span className="text-xs italic">(if applicable)</span>
              </label>
              <input
                type="text"
                placeholder="ex: https://movetcare.com"
                className="font-abside-smooth border-movet-black focus:outline-none focus:ring-1 focus:ring-movet-brown focus:border-movet-brown relative border w-full bg-white rounded-md pl-3 pr-10 py-2 text-left cursor-default sm:text-sm"
                {...register('url')}
              />
            </>
          )}
          <label className="font-bold mb-2 mt-4 text-sm w-full">
            Priority Level
          </label>
          <SelectInput
            label=""
            name="priority"
            required
            values={[
              { id: 'low', name: 'Low' },
              { id: 'medium', name: 'Medium' },
              { id: 'high', name: 'High' },
            ]}
            errors={errors}
            control={control}
          />
          <Button
            type="submit"
            color="red"
            disabled={!isDirty || isSubmitting || !isValid || !isFilePicked}
            className="mt-8"
          >
            <FontAwesomeIcon icon={faEnvelope} size="lg" />
            <span className="ml-2">SUBMIT</span>
          </Button>
        </>
      )}
    </form>
  );
};

export default ReportABug;
