import React, { useEffect } from "react";
import { registerField } from "../../utils/formUtils";

const FormField = ({
  label,
  name,
  value,
  onChange,
  readOnly = false,
  type = "text",
  options = [],
  required = true,
  rules = [],
  error = "",
}) => {
  useEffect(() => {
    if (name) {
      registerField(name, rules);
    }
  }, [name, rules]);

  return (
    <div className="p-2">
      <label className="text-base leading-[20px] font-medium text-[#121212] tracking-wide flex items-center gap-1">
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>

      <div className="mt-2">
        {readOnly ? (
          <p className="text-base font-semibold text-gray-900 break-all">
            {value !== undefined && value !== null && value !== "" ? value : "—"}
          </p>
        ) : type === "checkbox-group" ? (
          <div className="flex flex-col gap-2 mt-2">
            {options.map((opt) => (
              <label
                key={opt.value}
                className="flex items-center gap-2 text-sm font-medium text-gray-800"
              >
                <input
                  type="checkbox"
                  checked={Array.isArray(value) && value.includes(opt.value)}
                  onChange={() => onChange(opt.value)}
                  className="h-4 w-4 accent-orange-500 bg-[#FAFAFA] "
                />
                {opt.label}
              </label>
            ))}
          </div>
        ) : type === "select" ? (
          <select
            value={value}
            onChange={onChange}
            required={required}
            className={`
              w-full px-4 py-3 text-sm text-gray-900
              border border-gray-200 rounded-md
              bg-[#FAFAFA] outline-none
              focus:ring-1 focus:ring-[#EF9421] focus:border-[#EF9421]
            `}
          >
            <option value="">Select {label}</option>
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        ) : (
          <input
            type={type}
            value={value}
            required={required}
            onChange={onChange}
            onKeyDown={
              type === "number"
                ? (e) => {
                    if (["e", "E", "+", "-", "."].includes(e.key)) {
                      e.preventDefault();
                    }
                  }
                : undefined
            }
            placeholder={`Enter ${label}`}
            className={`
              w-full px-4 py-3 text-sm text-gray-900
              border border-gray-200 rounded-md
              bg-[#FAFAFA] outline-none
              placeholder:text-gray-400
              focus:ring-1 focus:ring-[#EF9421] focus:border-[#EF9421]
            `}
          />
        )}
      </div>

      {error && <p className="text-xs text-red-600 mt-2">{error}</p>}
    </div>
  );
};

export default FormField;
