export const BookingHeader = ({
  isAppMode,
  title,
  description,
  customDescription = null,
}: {
  isAppMode: boolean;
  title: string;
  description?: string;
  customDescription?: any | null;
}) => {
  return (
    <div
      className="flex flex-row justify-center items-center text-center w-full"
      id="top"
    >
      <div className="flex flex-col justify-center items-center w-full">
        {!isAppMode && (
          <h2
            className={`text-3xlfont-extrabold tracking-tight text-movet-black`}
          >
            {title}
          </h2>
        )}
        {customDescription ? (
          customDescription
        ) : (
          <p
            className={`text-lg leading-6 text-movet-black${isAppMode ? " mt-8" : ""}`}
          >
            {description}
          </p>
        )}
      </div>
    </div>
  );
};
