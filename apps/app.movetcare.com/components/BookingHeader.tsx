export const BookingHeader = ({
  isAppMode,
  title,
  description,
}: {
  isAppMode: boolean;
  title: string;
  description: string;
}) => {
  return (
    <div
      className="flex flex-row justify-center items-center text-center w-full"
      id="top"
    >
      <div className="flex flex-col justify-center items-center w-full">
        <h2
          className={`${
            isAppMode ? "text-2xl" : "text-3xl"
          } font-extrabold tracking-tight text-movet-black`}
        >
          {title}
        </h2>
        <p className="text-lg leading-6 text-movet-black">{description}</p>
      </div>
    </div>
  );
};
