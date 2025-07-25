import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { SizeProp } from "@fortawesome/fontawesome-svg-core";
import { classNames } from "../../utils";
import { faEllipsisH } from "@fortawesome/free-solid-svg-icons";

interface ButtonProps extends React.ComponentPropsWithoutRef<"button"> {
  className?: string;
  buttonRef?: any;
  text?: string;
  icon?: any;
  disabled?: boolean;
  loading?: boolean;
  onClick?: any;
  children?: any;
  screenReaderText?: string;
  iconColor?: string;
  shape?: "wide" | "tall" | "round";
  title?: string;
  iconSize?: SizeProp;
  color?: "black" | "red" | "white" | "green";
  type?: "button" | "submit" | "reset";
  id?: string | undefined;
}

export const Button = ({
  className,
  buttonRef,
  text,
  icon,
  screenReaderText,
  children = null,
  disabled = false,
  loading = false,
  iconColor = "white",
  onClick,
  shape = "round",
  title,
  iconSize = "lg",
  color,
  type = "button",
  id = undefined,
  ...rest
}: ButtonProps) => {
  let content = children;
  const padding = () => {
    switch (shape) {
      case "wide":
        return "px-4 py-3 rounded-xl";
      case "tall":
        return "px-2 py-4 rounded-md";
      case "round":
        return "py-2 px-6 rounded-full";
      default:
        return "py-2 px-6 rounded-full";
    }
  };
  const heightAndWidth = () => {
    switch (iconSize) {
      case "sm":
        return "w-4";
      case "lg":
        return "h-8 w-8";
      case "2x":
        return "h-9 w-9";
      case "5x":
        return "h-20 w-20";
      default:
        return "h-5 w-5";
    }
  };

  if (!content) {
    if (loading)
      content = (
        <div className="flex items-center">
          <FontAwesomeIcon
            icon={faEllipsisH}
            className={`${heightAndWidth()} rounded-full`}
            size={iconSize}
          />
          <span className="ml-3 italic">Processing</span>
        </div>
      );
    else if (icon)
      content = (
        <div className="flex justify-center items-center">
          <div
            className={`flex justify-center items-center ${heightAndWidth()}`}
          >
            <FontAwesomeIcon icon={icon} color={iconColor} size={iconSize} />
          </div>
          {text && <span className="ml-3">{text}</span>}
        </div>
      );
    else
      content = (
        <p className="m-0 self-center font-bold text-movet-white">{text}</p>
      );
  }

  return (
    <button
      id={id}
      title={title}
      onClick={onClick}
      type={type}
      ref={buttonRef}
      disabled={disabled}
      className={classNames(
        padding(),
        "flex justify-center items-center mx-auto h-12 border border-transparent shadow-2xl font-source-sans-pro tracking-widest text-xs font-semibold uppercase group-hover:bg-movet-black hover:bg-movet-black ease-in-out duration-500",
        color === "white" &&
          ("bg-movet-white hover:bg-movet-red group-hover:bg-movet-red text-movet-black hover:text-movet-white" as any),
        color === "black" &&
          ("bg-movet-black hover:bg-movet-red group-hover:bg-movet-red text-movet-white" as any),
        color === "red" &&
          ("bg-movet-red hover:bg-movet-black text-movet-white" as any),
        color === "green" &&
          ("bg-movet-green/50 hover:bg-movet-green text-movet-white" as any),
        disabled
          ? "group-hover:bg-movet-gray group-hover:bg-opacity-50 hover:bg-opacity-50 hover:bg-movet-black bg-movet-black bg-opacity-50 cursor-not-allowed"
          : "",
        className ? className : "",
      )}
      {...rest}
    >
      {screenReaderText && <span className="sr-only">{screenReaderText}</span>}
      {content}
    </button>
  );
};
