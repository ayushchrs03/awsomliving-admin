import { IoInformationCircleOutline } from "react-icons/io5";
import AsyncSelect from "react-select/async";
import client from "../../../redux/axios-baseurl";

export const AsyncSelector = ({
  label,
  reqUrl = "",
  customParams = {},
  keyName = "",
  className,
  classNamePrefix,
  options,
  isDisabled,
  isClearable,
  onChange,
  autoFocus,
  value,
  isMulti,
  isSearchable,
  name,
  placeholder,
  noOptionsMessage,
  onBlur,
  touched,
  errorContent,
  infoContent,
  ...props
}) => {


  const customStyles = {
    control: (provided) => ({
      ...provided,
      width: "100%",
      height: "2.5rem",
      borderRadius: "8px",
      // backgroundColor: "#F6F6F6", // Set the background color for the control component
      border: "none",
      boxShadow: "none",
    }),
    menu: (provided) => ({
      ...provided,
      padding: "4px",
      borderRadius: "11px",
      // backgroundColor: "#F6F6F6", // Set the background color for the dropdown menu
    }),
    // container: (provided, state) => ({
    //   ...provided,
    //   marginTop: 50
    // }),
    valueContainer: (provided, state) => ({
      ...provided,
      overflow: "visible",
    }),
    option: (provided, state) => ({
      ...provided,
      fontSize: "14px",
      display: "flex",
      marginBottom: "2px",
      // backgroundColor: state.isHovered && "#ACD4F7",
      borderRadius: "11px",
      backgroundColor: state.isSelected
        ? "#ACD4F7"
        : state.isFocused && "#E4F1FD", // Change the color of selected option background
      color:
        state.isSelected || state.isFocused || (state.isHovered && "#000000"), // Change the color of selected option text
    }),
    placeholder: (provided, state) => ({
      ...provided,
      position: "absolute",
      top: state.hasValue || state.selectProps.inputValue ? -21 : "20%",
      transition: "top 0.3s, font-size 0.1s",
      fontSize:
        state.hasValue || state.selectProps.inputValue ? "10px" : "12px", // Adjust the font size of the placeholder
      color:
        state.hasValue || state.selectProps.inputValue ? "#2294b1" : "#999999",
    }),
    singleValue: (provided) => ({
      ...provided,
      fontSize: "14px", // Adjust the font size of the selected option
    }),
  };

  const fetchOptions = async (inputValue) => {
    if (!reqUrl) {
      return [];
    }
    try {
      const response = await client.get(reqUrl, {
        withCredentials: true,
        params: {
          value: inputValue,
          ...customParams,
        },
      });

      return response.data[keyName].map((option) => ({
        value: option._id,
        label: option.value,
      }));
    } catch (error) {
      console.error("Error fetching options:", error);
      return [];
    }
  };

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-1">
        <label className="text-[#858585] font-medium text-sm">{label}</label>
        {infoContent && (
          <IoInformationCircleOutline
            className="text-primary text-sm focus:outline-none"
            data-tooltip-id="my-tooltip"
            data-tooltip-content={infoContent}
          />
        )}
      </div>
      <div className="h-fit rounded-md shadow-sm">
        <AsyncSelect
          cacheOptions
          defaultOptions
          loadOptions={fetchOptions}
          name={name}
          options={options}
          isMulti={isMulti}
          autoFocus={autoFocus}
          className={className}
          defaultValue={value}
          onChange={onChange}
          value={value}
          classNamePrefix={classNamePrefix}
          isDisabled={isDisabled}
          isClearable={isClearable}
          isSearchable={isSearchable}
          styles={customStyles}
          placeholder={placeholder}
          noOptionsMessage={noOptionsMessage}
          onBlur={onBlur}
          {...props}
        />
      </div>
      <div className="h-1 mb-2">
        {errorContent && touched && (
          <p className=" text-error text-xs">{errorContent}</p>
        )}
      </div>
    </div>
  );
};
