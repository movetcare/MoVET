import Image from "next/image";
import { useRouter } from "next/router";

export const Hero = ({
  title,
  secondTitle,
  description,
  callToAction,
  imageUrl,
}: {
  title: string;
  secondTitle: string;
  description: any;
  callToAction: any;
  imageUrl: string;
}) => {
  const router = useRouter();
  return (
    <section className="relative w-full pb-24 sm:pb-0 z-10 -mt-12 md:mt-0">
      <div className="flex justify-center items-center relative py-12 mb-12 sm:py-4 sm:mb-0 sm:max-w-screen-lg sm:mx-auto sm:px-8">
        <div className="sm:w-1/2 flex justify-center">
          <div className="w-80 relative z-10 sm:text-center my-0 sm:mt-10 md:my-0">
            {title && (
              <h1 className="text-2xl sm:text-3xl whitespace-nowrap mb-1.5">
                {title}
              </h1>
            )}
            {secondTitle && (
              <h1 className="text-4xl sm:text-6xl text-movet-red mb-4">
                {secondTitle}
              </h1>
            )}
            {description && (
              <p className="text-base sm:text-lg font-bold font-abside leading-6 text-center">
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
            <div className="hidden md:flex w-1/2 h-full pr-0 sm:pl-8 md:pl-0 justify-center">
              <div className="max-w-sm">
                <Image
                  src={imageUrl}
                  alt="dog"
                  className="rounded-full"
                  width={340}
                  height={340}
                />
              </div>
            </div>
            <div className="absolute right-0 bottom-0 w-[25%] sm:hidden">
              <div className="absolute w-full h-[132%] -bottom-12">
                <svg
                  className="fill-current text-movet-tan w-[62%] h-[45%] absolute right-0 bottom-[84%]"
                  viewBox="1 0 52 52"
                >
                  <path d="M 0,53 H 53 V 0 C 39,26 24,35 0,53 Z" />
                </svg>
                <div className="backdrop-app w-full h-full bg-movet-tan"></div>
              </div>
              <Image
                src={imageUrl}
                alt="dog"
                className="rounded-md invisible"
                width={340}
                height={340}
              />
            </div>
          </>
        )}
      </div>
      {imageUrl && (
        <div className="sm:hidden curve h-16 before:bg-movet-white before:translate-x-[-7%] before:translate-y-[30%] after:bg-movet-tan after:translate-x-[85%] after:translate-y-[70%]">
          <div className="absolute w-full flex justify-center -bottom-28 z-10">
            <Image
              src={imageUrl}
              alt="dog"
              className="rounded-full"
              width={260}
              height={260}
            />
          </div>
        </div>
      )}
    </section>
  );
};
