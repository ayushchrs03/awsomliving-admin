import { useState } from "react";

export const Toggle = ({ name = "", isChecked, value, onChange }) => {
  return (
    <label className="toggle-switch min-w-[60px]">
      <input name={name} type="checkbox" checked={value} onChange={onChange} />
      <div class="toggle-switch-background">
        <div class="toggle-switch-handle"></div>
      </div>
    </label>
  );
};
