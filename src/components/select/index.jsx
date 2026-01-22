import Select from "react-select";
import { IoInformationCircleOutline } from "react-icons/io5";

export const Selector = ({
  label,
  className,
  classNamePrefix,
  options,
  isDisabled,
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
  containerClassName,
  loading,
  ...props
}) => {
  const customStyles = {
    control: (provided) => ({
      ...provided,
      width: "100%",
      minHeight: "49px",
      borderRadius: "8px",
      backgroundColor: "transprent", // Set the background color for the control component
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
      borderRadius: "0px",
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

  

  return (
    <div
      className={`${
        containerClassName && containerClassName
      } flex flex-col gap-1`}
    >
      <div className="flex items-center gap-1">
        <label className="text-black text-sm dark:text-white">{label}</label>
        {infoContent && (
          <IoInformationCircleOutline
            className="text-primary text-sm focus:outline-none  "
            data-tooltip-id="my-tooltip"
            data-tooltip-content={infoContent}
          />
        )}
      </div>
      <div
        className={`${
          className ? className : "bg-pageBodyBg dark:bg-gray-900"
        } h-fit rounded-md shadow-sm`}
      >
        <Select
          name={name}
          options={options}
          isMulti={isMulti}
          autoFocus={autoFocus}
          classNames={{
            control: () =>
              "!w-full !min-h-[49px] !bg-transparent !border-none !rounded-[8px]",
            menu: () =>
              "bg-gray-200 dark:bg-gray-900 dark:!text-gray-500 focus:!shadow-none focus:!outline-none",
            option: (state) =>
              `${state.isSelected && "!text-white dark:!text-white"}`,
            singleValue: () => "!text-black dark:!text-white",
          }}
          defaultValue={value}
          onChange={onChange}
          value={value}
          classNamePrefix={classNamePrefix}
          isDisabled={isDisabled}
          isSearchable={isSearchable}
          styles={customStyles}
          placeholder={placeholder}
          noOptionsMessage={noOptionsMessage}
          onBlur={onBlur}
          {...props}
          components={{
            IndicatorSeparator: () => null,
          }}
          isLoading={loading}
        />
      </div>
      {errorContent && touched && (
        <div className="h-1 mb-2">
          <p className=" text-error text-xs">{errorContent}</p>
        </div>
      )}
    </div>
  );
};
