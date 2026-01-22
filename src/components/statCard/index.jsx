import React from "react";

function StatCard({
  label,
  value,
  change,
  icon: Icon,
  bg = "bg-white",
  border = "border-gray-200",
  iconBg,
  iconColor,
  changeColor,
}) {
  return (
    <div
      className={`
        relative p-6 rounded-xl
        w-full
        min-w-60
        sm:min-w-70
        ${bg} border ${border}
        transition-all duration-300 ease-out
        hover:shadow-lg hover:-translate-y-1
      `}
    >
      
      <div className={`absolute top-4 right-4 p-3 rounded-lg ${iconBg}`}>
        <Icon className={`text-xl ${iconColor}`} />
      </div>

      <p className="text-sm text-gray-500 font-medium">
        {label}
      </p>

      <p className="text-3xl font-semibold text-gray-900 mt-2">
        {value}
      </p>

      <p className={`text-sm mt-3 flex items-center gap-1 ${changeColor}`}>
        {change}
      </p>
    </div>
  );
}

export default StatCard;
