// "./index.css";
export const Checkbox = ({ containerClassName,...props }) => {
  return (
    <>
      <label className={`${containerClassName} w-4 container`}>
        <input checked="checked" type="checkbox" {...props} />
        <div className="checkmark"></div>
      </label>
    </>
  );
};
