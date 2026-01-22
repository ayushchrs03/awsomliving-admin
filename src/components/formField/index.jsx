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
    <div
      className={`p-2`}
    >
      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide flex items-center gap-1">
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
                  className="h-4 w-4 accent-orange-500"
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
  w-full mt-2 bg-transparent text-base text-gray-900
  outline-none border-b pb-1 border-gray-400
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
  w-full mt-2 bg-transparent text-base text-gray-900
  outline-none placeholder:text-gray-400 border-b border-gray-400 pb-1

`}
          />
        )}
      </div>

      {error && <p className="text-xs text-red-600 mt-2">{error}</p>}
    </div>
  );
};

export default FormField;
