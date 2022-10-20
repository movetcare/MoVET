import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { SizeProp } from "@fortawesome/fontawesome-svg-core";
import { classNames } from "../../utils";
import { faEllipsisH } from "@fortawesome/free-solid-svg-icons";

interface ButtonProps extends React.ComponentPropsWithoutRef<"button"> {
  className?: string;
  reference?: any;
  text?: string;
  icon?: any;
  disabled?: boolean;
  loading?: boolean;
  onClick?: Function | any;
  children?: any;
  screenReaderText?: string;
  iconColor?: string;
  shape?: "wide" | "tall" | "round";
  title?: string;
  iconSize?: SizeProp;
  color?: "black" | "red" | "white";
  type?: "button" | "submit" | "reset";
}

export const Button = ({
  className,
  reference,
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
      title={title}
      onClick={onClick}
      type={type}
      ref={reference}
      disabled={disabled}
      className={classNames(
        padding(),
        "flex justify-center items-center h-12 border border-transparent shadow-sm font-source-sans-pro tracking-widest text-xs font-semibold uppercase group-hover:bg-movet-black hover:bg-movet-black ease-in-out duration-500",
        color === "white" &&
          "bg-movet-white hover:bg-movet-red group-hover:bg-movet-red text-black hover:text-movet-white",
        color === "black" &&
          "bg-movet-black hover:bg-movet-red group-hover:bg-movet-red text-movet-white",
        color === "red" && "bg-movet-red hover:bg-movet-black text-movet-white",
        disabled
          ? "group-hover:bg-movet-gray group-hover:bg-opacity-50 hover:bg-opacity-50 hover:bg-movet-black bg-movet-black bg-opacity-50 cursor-not-allowed"
          : "",
        className ? className : ""
      )}
      {...rest}
    >
      {screenReaderText && <span className="sr-only">{screenReaderText}</span>}
      {content}
    </button>
  );
};
