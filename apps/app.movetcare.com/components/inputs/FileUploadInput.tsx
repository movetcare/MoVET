import Image from "next/image";
import { useRef, useState } from "react";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { storage } from "services/firebase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckCircle,
  faCloudArrowUp,
  faExclamationTriangle,
} from "@fortawesome/free-solid-svg-icons";
import { Loader } from "ui";
import toast from "react-hot-toast";
import { Transition } from "@headlessui/react";
import kebabCase from "lodash.kebabcase";
let fileType: string | any = null;
export const FileUploadInput = ({
  label = "",
  isAppMode = false,
  fileName,
  uploadPath,
  fileTypes = "PDF, PNG or JPG",
  setValue,
  successMessage = "File Uploaded!",
  previewImage = false,
}: {
  label: string;
  isAppMode: boolean;
  fileName: string;
  uploadPath: string;
  fileTypes?: string;
  setValue: any;
  successMessage: string;
  previewImage?: boolean;
}) => {
  const [progress, setProgress] = useState<number | null>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [sourceFileName, setSourceFileName] = useState<string | null>(null);
  const inputFileRef = useRef();
  const onFileChangeCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setIsLoading(true);
    uploadFiles((e.target.files as any)[0]);
  };
  const onBtnClick = () => (inputFileRef.current as any).click();
  const uploadFiles = (file: any) => {
    if (!file) return;
    setSourceFileName(file?.name);
    switch (file?.type) {
      case "image/png":
        fileType = ".png";
        break;
      case "image/jpeg":
        fileType = ".jpeg";
        break;
      case "image/jpg":
        fileType = ".jpg";
        break;
      case "application/pdf":
        fileType = ".pdf";
        break;
      default:
        break;
    }
    const uploadTask = uploadBytesResumable(
      ref(storage, `/${uploadPath}/${kebabCase(fileName)}${fileType}`),
      file,
      {
        contentType: file?.type,
      }
    );
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const prog = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setProgress(prog);
      },
      (error) => {
        setValue(error?.message);
        toast("Whoops! Something went wrong, please try again...", {
          duration: 4000,
          icon: (
            <FontAwesomeIcon
              icon={faExclamationTriangle}
              size="sm"
              className="text-movet-red"
            />
          ),
        });
        setIsLoading(false);
      },
      () =>
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL: string) => {
          setValue({
            url: downloadURL,
            name: `${kebabCase(fileName)}${fileType}`,
          });
          setPhotoUrl(downloadURL);
          toast(successMessage, {
            duration: 4000,
            icon: (
              <FontAwesomeIcon
                icon={faCheckCircle}
                size="sm"
                className="text-movet-green"
              />
            ),
          });
          setIsLoading(false);
        })
    );
  };

  return (
    <div className="mt-8 w-full flex flex-col justify-center mx-auto">
      {label !== "" && (
        <label className="block text-sm font-medium text-movet-black font-abside mb-2">
          {label} {progress ? `- Uploaded ${progress}%` : ""}
        </label>
      )}
      <div
        onClick={onBtnClick}
        className="flex flex-col justify-center items-center w-full group hover:bg-movet-gray hover:bg-opacity-10 ease-in-out duration-500 h-38 bg-white rounded-lg border-2 border-gray-300 border-dashed cursor-pointer dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
      >
        <div className="flex flex-col justify-center items-center pt-5 pb-6">
          {isLoading ? (
            <>
              <Loader message={`Upload ${progress}% Complete`} />
            </>
          ) : (
            <>
              <Transition
                show={previewImage && photoUrl !== null}
                enter="transition ease-in duration-500"
                leave="transition ease-out duration-300"
                leaveTo="opacity-10"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leaveFrom="opacity-100"
              >
                {photoUrl && (
                  <Image
                    src={photoUrl}
                    alt="Photo Preview"
                    height={50}
                    width={50}
                    className="rounded-xl h-100 w-100 mx-auto my-4"
                  />
                )}
              </Transition>
              {sourceFileName && <p>Using: &quot;{sourceFileName}&quot;</p>}
              {isAppMode ? (
                <>
                  {!sourceFileName && (
                    <FontAwesomeIcon
                      icon={faCloudArrowUp}
                      size="2x"
                      className="text-movet-black group-hover:text-movet-brown ease-in-out duration-500"
                    />
                  )}
                  <p className="text-sm text-movet-black dark:text-movet-black">
                    Tap to {sourceFileName ? "Replace" : "Upload"}
                  </p>
                  {fileTypes && (
                    <p className="text-xs text-movet-black dark:text-movet-black -mt-2 italic">
                      {fileTypes}
                    </p>
                  )}
                </>
              ) : (
                <>
                  {!sourceFileName && (
                    <FontAwesomeIcon
                      icon={faCloudArrowUp}
                      size="2x"
                      className="text-movet-black group-hover:text-movet-brown ease-in-out duration-500"
                    />
                  )}
                  <p className="text-sm text-movet-black dark:text-movet-black">
                    Click to {sourceFileName ? "Replace" : "Upload"}
                  </p>
                  {fileTypes && (
                    <p className="text-xs text-movet-black dark:text-movet-black -mt-2 italic">
                      {fileTypes}
                    </p>
                  )}
                </>
              )}
            </>
          )}
        </div>
        <input
          type="file"
          ref={inputFileRef as any}
          onChangeCapture={onFileChangeCapture}
          className="hidden"
        />
      </div>
    </div>
  );
};
