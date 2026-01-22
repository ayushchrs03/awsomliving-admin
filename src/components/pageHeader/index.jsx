import React from "react";

function PageHeader({ title, subtitle, rightContent }) {
  return (
    <div>
      <div className="flex  flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">
            {title}
          </h1>

          {subtitle && (
            <p className="text-sm sm:text-base text-gray-500 mt-1">
              {subtitle}
            </p>
          )}
        </div>

        {rightContent && <div>{rightContent}</div>}
      </div>

    </div>
  );
}

export default PageHeader;
