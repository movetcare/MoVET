import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { SizeProp } from "@fortawesome/fontawesome-svg-core";
import { classNames } from "utils/classNames";
interface ButtonProps extends React.ComponentPropsWithoutRef<"button"> {
  className?: string;
  reference?: any;
  text?: string;
  icon?: any;
  disabled?: boolean;
  loading?: boolean;
  onClick?: any;
  children?: any;
  screenReaderText?: string;
  iconColor?: string;
  shape?: "wide" | "tall" | "round";
  name?: string;
  iconSize?: SizeProp;
  color?: "black" | "red";
  type?: "button" | "submit" | "reset";
  id?: string;
}

const Button = ({
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
  name,
  id,
  iconSize = "lg",
  color,
  type = "button",
  ...rest
}: ButtonProps) => {
  let content = children;
  const padding = () => {
    switch (shape) {
      case "wide":
        return "px-4 py-3 rounded-lg";
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
            icon="ellipsis-h" //{faEllipsisH}
            spin
            className={`${heightAndWidth()} rounded-full`}
            size={iconSize}
          />
          <span className="ml-3 italic">Processing</span>
        </div>
      );
    else if (icon)
      content = (
        <div className="flex justify-center items-center">
          <div className={`flex items-center ${heightAndWidth()}`}>
            <FontAwesomeIcon icon={icon} color={iconColor} size={iconSize} />
          </div>
          {text && <span className="ml-3">{text}</span>}
        </div>
      );
    else content = <p className="m-0 self-center font-bold">{text}</p>;
  }

  return (
    <button
      id={id}
      onClick={onClick}
      type={type}
      ref={reference}
      disabled={disabled}
      className={classNames(
        padding(),
        "flex justify-center items-center h-12 border border-transparent shadow-sm font-source-sans-pro tracking-widest text-movet-white text-xs font-semibold uppercase group-hover:bg-movet-black hover:bg-movet-black ease-in-out duration-300",
        color === "black" && "bg-movet-black hover:bg-movet-red",
        color === "red" && "bg-movet-red hover:bg-movet-black",
        disabled
          ? "group-hover:bg-movet-gray group-hover:bg-opacity-50 hover:bg-opacity-50 hover:bg-movet-black bg-movet-black bg-opacity-50"
          : "",
        className ? className : ""
      )}
      data-cy={name}
      {...rest}
    >
      {screenReaderText && <span className="sr-only">{screenReaderText}</span>}
      {content}
    </button>
  );
};

export default Button;
