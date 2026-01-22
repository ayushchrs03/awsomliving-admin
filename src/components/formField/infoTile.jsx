import React from "react";

const InfoTile = ({ label, value, className = "" }) => {
  return (
    <div
      className={`
        p-5 rounded-xl border
        bg-green-50 border-green-200
        shadow-sm
        transition-all duration-300 ease-out
        hover:-translate-y-1
        hover:shadow-lg
        ${className}
      `}
    >
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
        {label}
      </p>

      <p className="text-base font-semibold text-gray-900 mt-2 break-all">
        {value || "—"}
      </p>
    </div>
  );
};

export default InfoTile;
