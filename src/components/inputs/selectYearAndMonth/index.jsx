import { IoInformationCircleOutline } from "react-icons/io5";

export const PeriodSelector = ({
  label,
  onBlur,
  valueOne,
  valueTwo,
  typeOne,
  typeTwo,
  touched,
  onChange,
  disabled,
  value,
  className,
  infoContent,
  errorContent,
  autoComplete,
  placeholderOne,
  placeholderTwo,
  ...props
}) => {
  const handleChange = (event) => {
    const newValue = event.target.value;
    if (newValue.length <= 2) {
      // Enforcing maxLength manually
      onChange(newValue || null);
    }
  };


  return (
    <div>
      <div className="w-full flex flex-col gap-1">
        <div className="flex items-center gap-1">
          <label className="text-black text-sm dark:text-white">{label}</label>
          {infoContent && (
            <IoInformationCircleOutline
              className="text-primary text-sm focus:outline-none"
              data-tooltip-id="my-tooltip"
              data-tooltip-content={infoContent}
            />
          )}
        </div>
        <div className="w-full relative flex gap-2">
          <div className="w-full relative">
            <input
              {...props}
              className={`${className} ${errorContent && touched ? "border-error" : "border-[#D6D6D6]"
                } w-full rounded-md shadow-sm text-black placeholder:text-[#C4C4C4] placeholder:text-xs text-sm p-3 bg-pageBodyBg focus:border-focusInputBorderColor h-49 dark:bg-gray-900 dark:text-white`}
              type={typeOne}
              placeholder={placeholderOne}
              value={value || null}
              // onChange={(e) => handleChange("valueOne", e)}
              onChange={(e) => handleChange(e)}
              onBlur={onBlur}
              autoComplete={autoComplete}
              disabled={disabled}
              maxLength={2}
            />
            {value > 0 && (
              <div className="pointer-events-none absolute inset-y-0 right-2 -translate-y-1/2 top-1/2 flex items-center pl-3">
                <span className="text-gray-500 sm:text-sm">{`${value == 1 ? "Month" : "Months"
                  }`}</span>
              </div>
            )}
          </div>
          {/* <div className="relative">
            <input
              {...props}
              className={`${className} ${errorContent && touched ? "border-error" : "border-[#D6D6D6]"
                } w-full rounded-md shadow-sm text-black placeholder:text-[#C4C4C4] placeholder:text-xs text-sm p-3 bg-pageBodyBg focus:border-focusInputBorderColor h-49 dark:bg-gray-900 dark:text-white`}
              type={typeTwo}
              placeholder={placeholderTwo}
              value={value?.valueTwo || ""}
              onChange={(e) => handleChange("valueTwo", e)}
              onBlur={onBlur}
              autoComplete={autoComplete}
              disabled={disabled}
              maxLength={2}
            />
            {valueTwo > 0 && (
              <div className="pointer-events-none absolute inset-y-0 right-2 -translate-y-1/2 top-1/2 flex items-center pl-3">
                <span className="text-gray-500 sm:text-sm">{`${valueTwo == 1 ? "Day" : "Days"
                  }`}</span>
              </div>
            )}
          </div> */}
        </div>
      </div>
      <div className="h-1 mb-2">
        {errorContent && <p className="text-error text-xs">{errorContent}</p>}
      </div>
    </div>
  );
};
