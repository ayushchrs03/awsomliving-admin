import React from "react";
import { useNavigate } from "react-router-dom";
import { LuLayoutDashboard } from "react-icons/lu";

const Breadcrumb = ({ items = [] }) => {
  const navigate = useNavigate();

  const breadcrumbItems = [{ label: <LuLayoutDashboard />, path: "/" }, ...items];

  return (
    <div className="flex items-center gap-2 text-base px-2 mb-3 h-[24px]">
      {breadcrumbItems.map((item, index) => {
        const isActive = index === breadcrumbItems.length - 1;
        return (
        <React.Fragment key={index}>
          {index !== 0 && <span className="text-gray-400">/</span>}

            <span
              className={`cursor-pointer leading-[20px] ${
                isActive
                  ? "text-[#EF9421]"
                  : item.path
                ? "text-gray-600 hover:text-[#EF9421]"
                : "text-gray-900"
            }`}
            onClick={() => item.path && navigate(item.path)}
          >
            {item.label}
          </span>
        </React.Fragment>
      );
    })}
    </div>
  );
};

export default Breadcrumb;
