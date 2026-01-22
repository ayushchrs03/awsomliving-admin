import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { IoInformationCircleOutline } from "react-icons/io5";

export const Input = ({
  name,
  type,
  value,
  label,
  onBlur,
  touched,
  onChange,
  className,
  placeholder,
  infoContent,
  errorContent,
  autoComplete,
  disabled,

  ...props
}) => {
  const [passwordType, setPasswordType] = useState("password");

  const viewPassword = () => {
    setPasswordType(passwordType === "password" ? "text" : "password");
  };

  const handleChange = (e) => {
    // Prevent more than one space consecutively
    let newValue;
    let nameArr = ["password", "email"];
    if (nameArr.includes(e.target.name)) {
      newValue = e.target.value.replace(/\s/g, "");
    } else {
      newValue = e.target.value.replace(/\s{2,}/g, " ");
    }

    if (e.target.name === "otp" && (newValue.length > 4 || newValue > 9999)) {
      newValue = newValue.slice(0, 4);
    } else if (e.target.value.length > 150) {
      return;
    }
    e.target.value = newValue;
    onChange(e);
  };

  return (
    <div>
      <div className="w-full flex flex-col gap-1">
        <div className="flex items-center gap-1">
          <label className="text-black text-sm dark:text-white pb-1">{label}</label>
          {infoContent && (
            <IoInformationCircleOutline
              className="text-primary text-sm focus:outline-none"
              data-tooltip-id="my-tooltip"
              data-tooltip-content={infoContent}
            />
          )}
        </div>
        <div className="w-full relative">
          <input
            {...props}
            className={`${className} ${
              errorContent && touched ? "border-error" : "border-[#D6D6D6]"
            } w-full text-black placeholder:text-[#C4C4C4] placeholder:text-xs p-3 !bg-[#F9FAFC] focus:border-focusInputBorderColor h-[36px] dark:bg-gray-900 dark:text-white rounded-md shadow-sm`}
            type={type === "password" ? passwordType : type}
            placeholder={placeholder}
            value={value}
            onChange={handleChange}
            name={name}
            onBlur={onBlur}
            autoComplete={autoComplete}
            disabled={disabled}
          />
          {type === "password" && (
            <button
              type="button"
              onClick={viewPassword}
              className={`absolute top-1/2 -translate-y-1/2 right-4`}
              // ${
              //   errorContent ? "right-10" : "right-4"
              // }
            >
              {passwordType === "password" ? (
                <FaEye className="text-[#858585]" />
              ) : (
                <FaEyeSlash className="text-[#858585]" />
              )}
            </button>
          )}
        </div>
      </div>
      {errorContent && (
        <div className="h-1 mb-2">
          <p className=" text-error text-xs">{errorContent}</p>
        </div>
      )}
    </div>
  );
};
