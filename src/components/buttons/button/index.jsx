import { ImSpinner2 } from "react-icons/im";

export const Button = ({
  simpleLink,
  outLine,
  mainPrimary,
  gradientBtn,
  children,
  type,
  className,
  onClick,
  disabled,
  isLoading,
  leftIcon,
  rightIcon,
  ...props
}) => {
  return (
    <button
      {...props}
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
      className={`font-inter ${className ? className : "px-8 py-2"}
      ${
        disabled || (isLoading && "!bg-[#FE7819] hover:bg-slate-500 rounded")
      } ${
        simpleLink &&
        !disabled &&
        !isLoading &&
        "text-[#FE7819] font-medium  hover:text-gray-700 rounded"
      } ${outLine && !disabled && !isLoading && "rounded text-[#FE7819]"} ${
        mainPrimary &&
        !disabled &&
        !isLoading &&
        " border-[#884EA7] bg-[#FE7819] text-white hover:bg-orange-500 hover:bg-opacity-80 hover:border-[#fbf5ff] rounded"
      } ${
        gradientBtn &&
        !disabled &&
        !isLoading &&
        "bg-gradient-to-r from-[#884EA7] to-[#fbf5ff] text-white hover:bg-opacity-80 px-7 hover:bg-gradient-to-l rounded"
      }  border-[#884EA7] dark:border-gray-700 flex justify-center items-center gap-2 transition-all duration-300 ease-in-out hover:transition-all hover:duration-300 hover:ease-in-out disabled:cursor-not-allowed disabled:dark:bg-gray-500 disabled:dark:text-white disabled:border-gray-400`}
    >
      {leftIcon && leftIcon}
      {children}
      {rightIcon && rightIcon}
      {isLoading ? (
        <ImSpinner2 className="animate-spin text-white !text-xl" />
      ) : (
        ""
      )}
    </button>
  );
};
