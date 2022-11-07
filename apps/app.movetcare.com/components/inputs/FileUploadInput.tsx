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

export const FileUploadInput = ({
  label = "",
  isAppMode = false,
  fileName,
  uploadPath,
}: {
  label: string;
  isAppMode: boolean;
  fileName: string;
  uploadPath: string;
}) => {
  const [progress, setProgress] = useState<number | null>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const inputFileRef = useRef();
  const onFileChangeCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setIsLoading(true);
    uploadFiles(e.target.files);
  };
  const onBtnClick = () => (inputFileRef.current as any).click();
  const uploadFiles = (file: any) => {
    if (!file) return;
    const uploadTask = uploadBytesResumable(
      ref(storage, `/${uploadPath}/${fileName} - ${file[0]?.name}`),
      file
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
        console.error(error);
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
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          console.log("File available at", downloadURL);
          toast("Previous Vet Record Uploaded!", {
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
        });
      }
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
              {isAppMode ? (
                <>
                  <FontAwesomeIcon
                    icon={faCloudArrowUp}
                    size="2x"
                    className="text-movet-black group-hover:text-movet-brown ease-in-out duration-500"
                  />
                  <p className="text-sm text-movet-black dark:text-movet-black">
                    Tap to Upload
                  </p>
                  <p className="text-xs text-movet-black dark:text-movet-black">
                    PDF, PNG, or JPG
                  </p>
                </>
              ) : (
                <>
                  <FontAwesomeIcon
                    icon={faCloudArrowUp}
                    size="2x"
                    className="text-movet-black group-hover:text-movet-brown ease-in-out duration-500"
                  />
                  <p className="text-sm text-movet-black dark:text-movet-black">
                    Click to upload
                  </p>
                  <p className="text-xs text-movet-black dark:text-movet-black">
                    PDF, PNG, or JPG
                  </p>
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
