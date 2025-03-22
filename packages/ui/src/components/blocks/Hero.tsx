import Image from "next/image";
import { useRouter } from "next/router";
import type { ClinicConfig } from "types";

export const Hero = ({
  title,
  secondTitle,
  description,
  callToAction,
  imageUrl,
  clinicsConfig,
}: {
  title: string;
  secondTitle: string;
  description: any;
  callToAction: any;
  imageUrl: string;
  clinicsConfig?: Array<ClinicConfig>;
}) => {
  const router = useRouter();
  return (
    <section className="relative z-10 pb-24 -mt-12 w-full sm:pb-0 md:mt-0">
      <div className="flex relative justify-center items-center py-12 mb-12 sm:py-4 sm:mb-0 sm:max-w-screen-lg sm:mx-auto sm:px-8">
        <div className="flex justify-center sm:w-1/2">
          <div className="relative z-10 my-0 w-80 sm:text-center sm:mt-10 md:my-0">
            {title && (
              <h1 className="text-2xl sm:text-3xl whitespace-nowrap mb-1.5">
                {title}
              </h1>
            )}
            {secondTitle && (
              <h1 className="mb-4 text-4xl sm:text-6xl text-movet-red">
                {secondTitle}
              </h1>
            )}
            {description && (
              <p className="text-base font-bold leading-6 text-center sm:text-lg font-abside">
                {description}
              </p>
            )}
            {router?.query?.mode !== "app" && callToAction && (
              <div className="flex flex-col justify-center items-center mt-4">
                {callToAction}
              </div>
            )}
          </div>
        </div>
        {imageUrl && (
          <>
            <div className="hidden justify-center pr-0 w-1/2 h-full md:flex sm:pl-8 md:pl-0">
              <div className="max-w-sm">
                <Image
                  src={imageUrl}
                  alt="dog"
                  className="rounded-full"
                  width={340}
                  height={340}
                  priority
                />
              </div>
            </div>
          </>
        )}
      </div>
      {imageUrl && (
        <div className="sm:hidden curve h-16 before:bg-movet-white before:translate-x-[-7%] before:translate-y-[30%] after:bg-movet-tan after:translate-x-[85%] after:translate-y-[70%]">
          <div className="flex absolute -bottom-28 z-10 justify-center w-full">
            <Image
              src={imageUrl}
              alt="dog"
              className="rounded-full"
              width={260}
              height={260}
              priority
            />
          </div>
        </div>
      )}
    </section>
  );
};
