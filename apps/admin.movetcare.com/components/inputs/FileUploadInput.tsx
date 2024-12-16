import { useRef, useState } from "react";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { storage } from "services/firebase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckCircle,
  faExclamationTriangle,
  faPaperclip,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import toast from "react-hot-toast";
import kebabCase from "lodash.kebabcase";

export const FileUploadInput = ({
  uploadPath,
  setValue,
}: {
  uploadPath: string;
  setValue: any;
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const inputFileRef = useRef(null);
  const onFileChangeCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setIsLoading(true);
    uploadFiles((e.target.files as any)[0]);
  };
  const onBtnClick = () => (inputFileRef.current as any).click();
  const uploadFiles = (file: any) => {
    if (!file) return;
    const uploadTask = uploadBytesResumable(
      ref(storage, `/${uploadPath}/${kebabCase(file?.name)}`),
      file,
      {
        contentType: file?.type,
      },
    );
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const prog = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100,
        );
        console.log("UPLOAD PROGRESS %: ", prog);
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
          setValue(downloadURL);
          toast("Upload Successful!", {
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
        }),
    );
  };

  return (
    <div>
      <div
        className={`mr-3 mt-3 cursor-pointer inline-flex items-center justify-center rounded-full h-10 w-10 transition duration-500 ease-in-out hover:bg-movet-gray hover:bg-opacity-25 focus:outline-none${isLoading ? " text-movet-yellow" : ""}`}
        onClick={onBtnClick}
      >
        <FontAwesomeIcon
          icon={isLoading ? faSpinner : faPaperclip}
          size="lg"
          spin={isLoading}
        />
      </div>
      <div>
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
