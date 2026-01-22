import React from "react";

function ChartCard({ title, subtitle, children }) {
  return (
    <div className=" pt-4">
      <div className="bg-white border border-gray-200 rounded-2xl p-8 w-full">
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900">
            {title}
          </h2>
          {subtitle && (
            <p className="text-sm text-gray-500 mt-1">
              {subtitle}
            </p>
          )}
        </div>

        {children}
      </div>
    </div>
  );
}

export default ChartCard;
