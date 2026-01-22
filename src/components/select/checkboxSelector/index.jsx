import Select from "react-select";

export const CheckboxSelector = ({
  title,
  checked,
  onChange,
  selectOptions = [],
  selectedValue,
  onSelectChange,
  onLabelChange,
  ...props
}) => {
  const customStyles = {
    control: (provided) => ({
      ...provided,
      width: "100%",
      height: "12px",
      borderRadius: "8px",
      // backgroundColor: "#F6F6F6", // Set the background color for the control component
      border: "none",
      boxShadow: "none",
      backgroundColor: "var(--body-color)",
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

  const options = [];
  for (let i = 0; i <= 20; i++) {
    options.push({ value: i, label: `${i}` });
  }

  const defaultValue = { value: 1, label: "1" };

  return (
    <div className="min-h-[49px] px-2 py-1 flex items-center rounded-md shadow-sm bg-pageBodyBg dark:bg-gray-900">
      <input
        type="text"
        value={title}
        onChange={(e) => onLabelChange(e.target.value)} // Handle label change
        className=" font-medium text-[#666666] mr-2 bg-pageBodyBg dark:bg-gray-900"
      />
      {/* <Select
        options={selectOptions}
        value={selectOptions.find((option) => option.value === selectedValue)} // Bind to selected value
        onChange={onSelectChange} // Update selected value
        placeholder=""
        isSearchable={false}
        className="bg-pageBodyBg"
        styles={customStyles}
        {...props}
      /> */}
      <input
        className="dark:bg-gray-900"
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)} // Update boolean value on checkbox change
      />
    </div>
  );
};
