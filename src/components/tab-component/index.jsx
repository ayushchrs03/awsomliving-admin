import React, { useState } from "react";
import "./TabComponent.css";
import { Link, useLocation } from "react-router-dom";

const TabComponent = ({ tabs, containerClassName }) => {
  const pathname = useLocation().pathname;

  return (
    <div className={`${containerClassName} tab-container`}>
      <div className="tab-headers">
        {tabs?.map((tab) => (
          <>
            <Link
              key={tab.label}
              to={tab.link}
              className={`${
                tab.link == pathname
                  ? "border-primaryText font-bold text-primaryText"
                  : "border-transparent text-[#3D3D47]"
              } border-b-2 px-4 py-2 font-medium dark:text-white hover:text-gray-500`}
            >
              {tab.label}
            </Link>
          </>
        ))}
      </div>

      {/* <div className="tab-content">
        {tabs.map((tab) =>
          activeTab === tab.label ? <div key={tab.label}>{tab.content}</div> : null
        )}
      </div> */}
    </div>
  );
};

export default TabComponent;
