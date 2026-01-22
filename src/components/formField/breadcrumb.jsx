import React from "react";
import { useNavigate } from "react-router-dom";

const Breadcrumb = ({ items }) => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center gap-2 text-xl px-2">
      {items.map((item, index) => (
        <React.Fragment key={index}>
          {index !== 0 && <span className="text-gray-400">/</span>}

          <span
            className={`cursor-pointer ${
              item.path
                ? "text-gray-600 hover:text-[#EF9421]"
                : "font-medium text-gray-900"
            }`}
            onClick={() => item.path && navigate(item.path)}
          >
            {item.label}
          </span>
        </React.Fragment>
      ))}
    </div>
  );
};

export default  Breadcrumb
