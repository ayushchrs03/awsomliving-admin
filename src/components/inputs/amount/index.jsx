import React, { useEffect } from "react";
import { IoInformationCircleOutline } from "react-icons/io5";

export const AmountInput = ({
  name,
  value,
  label,
  onBlur,
  disabled,
  currency,
  onChange,
  className,
  placeholder,
  infoContent,
  errorContent,
  autoComplete,
  onCurrencyChange,
  ...props
}) => {
  const [amount, setAmount] = React.useState(value?.amount || "");

  useEffect(() => {
    onChange({ amount, currency });
  }, [currency]);

  const handleAmountChange = (e) => {
    const newAmount = e.target.value;
    setAmount(newAmount);
    onChange({ amount: newAmount, currency });
  };

  const handleCurrencyChange = (e) => {
    const newCurrency = e.target.value;
    onCurrencyChange(newCurrency); // Notify parent of currency change
    onChange({ amount, currency: newCurrency });
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
        <div className="w-full relative">
          <div className="relative rounded-md shadow-sm">
            {amount > 0 && (
              <div className="absolute inset-y-0 left-0 flex items-center">
                {/* <label htmlFor="currency" className=" dark:text-white">
                  Currency
                </label> */}
                <select
                  id="currency"
                  name="currency"
                  className="rounded-md border-0 bg-transparent text-gray-500 sm:text-sm outline-none"
                  value={currency}
                  onChange={handleCurrencyChange}
                >
                  <option value="Rs">Rs</option>
                  <option value="AED">AED</option>
                </select>
              </div>
            )}
            <input
              type="number"
              className={`${
                amount > 0 ? (currency == "Rs" ? "ps-14" : "ps-14") : ""
              } w-full text-black placeholder:text-[#C4C4C4] placeholder:text-xs p-3 bg-pageBodyBg focus:border-focusInputBorderColor h-49 dark:text-white dark:bg-gray-900 rounded-md ${className}`}
              placeholder={placeholder}
              value={amount}
              onChange={handleAmountChange}
              onBlur={onBlur}
              autoComplete={autoComplete}
              disabled={disabled}
              {...props}
            />
          </div>
        </div>
      </div>
      <div className="h-1 mb-2">
        {errorContent && <p className="text-error text-xs">{errorContent}</p>}
      </div>
    </div>
  );
};
