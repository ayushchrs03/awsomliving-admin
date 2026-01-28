import React, { useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { TableShimmer } from "../shimmers/tableShimmer";
import { MdOutlineAddBox } from "react-icons/md";
import { Checkbox } from "@mui/material";
import { FaUsers } from "react-icons/fa";
import { FaUserCheck } from "react-icons/fa";
import { FaUserTimes } from "react-icons/fa"
import SearchIcon from "@mui/icons-material/Search";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";

import { EyeArrowLeftOutline } from "mdi-material-ui";
import { MdOutlineModeEditOutline } from "react-icons/md";

const DataTablePro = ({
  loading = false,
  headers = [],
  data = [],
  title = "",

  addLink = "/",
  addButtonLabel = "Add New",
  showAddButton = true,

  editLink = "/",
  viewLink = "/",

  // ✅ Stats Cards
  showStats = false,
  stats = {
    total: 0,
    active: 0,
    inactive: 0,
  },

  // ✅ Row Selection
  selectable = true,
  selectedIds = [],
  onSelectionChange,

  // ✅ Bulk Actions
  showBulkActions = true,

  // ✅ Search + Filter
  showSearch = true,
  searchValue = "",
  onSearchChange,
  showFilter = true,
  onFilterClick,

  // ✅ Pagination / Load More
  showLoadMore = false,
  hasNextPage = false,
  onLoadMore,

  // ✅ Status Toggle
  onStatusToggle,
}) => {
  const navigate = useNavigate();

  // ✅ Selected Row Details
  const selectedId = selectedIds?.[0] || null;
  const selectedItem = selectedId
    ? data.find((item) => item._id === selectedId)
    : null;

  // ✅ Only one checkbox selection
  const handleSelectOne = (item) => {
    if (!onSelectionChange) return;

    const id = item._id;

    // ✅ If same checked again -> unselect
    if (selectedIds.includes(id)) {
      onSelectionChange([]);
      return;
    }

    onSelectionChange([id]);
  };

  // ✅ Pagination (IntersectionObserver)
  const loadMoreRef = useRef(null);

  useEffect(() => {
    if (!showLoadMore || !loadMoreRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const firstEntry = entries[0];

        if (
          firstEntry.isIntersecting &&
          hasNextPage &&
          !loading &&
          data.length > 0
        ) {
          onLoadMore?.();
        }
      },
      {
        root: null,
        rootMargin: "100px",
        threshold: 0,
      }
    );

    const currentRef = loadMoreRef.current;

    if (currentRef) observer.observe(currentRef);

    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, [showLoadMore, hasNextPage, loading, data.length, onLoadMore]);

  // ✅ Bulk navigation
  const handleBulkView = () => {
    if (!selectedId) return;
    navigate(`${viewLink}?id=${selectedId}`);
  };

  const handleBulkEdit = () => {
    if (!selectedId) return;
    navigate(`${editLink}?id=${selectedId}`);
  };
const entityName = title?.split(" ")?.[0] || "Item";

const handleAdd =()=>{
      navigate(`${addLink}`);
}
  return (
    <>
      <div className="px-2">
<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
            {title}
          </h2>

          {showAddButton && (
         <button
  className="bg-[#EF9421] text-white hover:bg-orange-500 
             px-4 py-2 rounded text-sm 
             flex items-center justify-center gap-2 
             w-full sm:w-auto"
  onClick={handleAdd}
>
  <MdOutlineAddBox size={18} />
  {addButtonLabel}
</button>
          )}
        </div>
        
        {showStats && (

<div className="grid grid-cols-3 gap-4 mb-4">
  
  <div className="bg-green-50 rounded-xl p-4">
    <div className="flex items-center gap-2 text-base text-gray-600">
      <FaUsers className="text-green-600" size={14} />
      <p>Total {entityName}</p>
    </div>
    <h3 className="text-xl font-semibold mt-2">{stats.total}</h3>
  </div>

  <div className="bg-blue-50 rounded-xl p-4">
    <div className="flex items-center gap-2 text-base text-gray-600">
      <FaUserCheck className="text-blue-600" size={14} />
      <p>Active {entityName}</p>
    </div>
    <h3 className="text-xl font-semibold mt-2">{stats.active}</h3>
  </div>

  <div className="bg-red-50 rounded-xl p-4">
    <div className="flex items-center gap-2 text-base text-gray-600">
      <FaUserTimes className="text-red-600" size={14} />
      <p>Inactive {entityName}</p>
    </div>
    <h3 className="text-xl font-semibold mt-2">{stats.inactive}</h3>
  </div>
</div>

       )} 

       

<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
          {selectable && showBulkActions && selectedIds.length > 0 ? (
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-sm sm:text-lg text-gray-600 dark:text-gray-200">
              <div className="flex items-center">
                {/* <Checkbox checked={true} size="small" /> */}
                <span className="font-medium">
                 Action
                </span>
              </div>

              <button
                onClick={handleBulkView}
                className="flex items-center gap-2 text-[#3B82F6]"
              >
                <EyeArrowLeftOutline fontSize="small" />
                View
              </button>

              <button
                onClick={handleBulkEdit}
                className="flex items-center gap-2 text-[#EF9421]"
              >
                <MdOutlineModeEditOutline fontSize="small" />
                Edit
              </button>
            </div>
          ) : (
            <div />
          )}

<div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            {showSearch && (
              <div className="relative w-full sm:w-[260px]">
                <SearchIcon
                  fontSize="small"
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  value={searchValue}
                  placeholder="Search across user"
                  onChange={(e) => onSearchChange?.(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#EF9421]"
                />
              </div>
            )}

            {showFilter && (
              <button
                onClick={onFilterClick}
  className="flex items-center justify-center gap-2 
             px-4 py-2 rounded-lg border border-gray-200 
             text-sm text-[#EF9421] hover:bg-orange-50
             w-full sm:w-auto"              >
                <FilterAltOutlinedIcon fontSize="small" />
                Filter
              </button>
            )}
          </div>
        </div>
      </div>

      {loading && data.length === 0 ? (
        <TableShimmer />
      ) : (
        <>
          <div className="overflow-x-auto overflow-y-auto min-h-[500px] mx-auto w-full">
            <table className="min-w-full bg-white dark:bg-slate-800">
              <thead>
                <tr className="w-full bg-[#F8F8F8] dark:bg-gray-900">
                  {selectable && (
                    <th className="text-center py-4 px-4 font-normal text-xs">
                      #
                    </th>
                  )}

                  {headers.map((header, index) => (
                    <th
                      key={index}
                     className="text-left py-4 px-4 font-normal text-sm whitespace-nowrap"
                    >
                      <div className="flex items-center justify-start text-[#121212] dark:text-gray-200">
                        {header.headerName}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {data.length === 0 ? (
                  <tr>
                    <td
                      colSpan={selectable ? headers.length + 1 : headers.length}
                      className="text-center py-8 text-gray-400"
                    >
                      No data found
                    </td>
                  </tr>
                ) : (
                  data.map((item) => {
                  const checked = selectedIds.includes(item._id);

                  return (
                    <tr
                      key={item._id}
                      className={`border-b border-dashed border-gray-200 dark:border-gray-500 hover:bg-gray-50/50 dark:hover:bg-gray-700/50 ${checked ? "bg-orange-50 dark:bg-gray-700/40" : ""
                      }`}
                    >
                      {selectable && (
                        <td className="text-center py-4 px-4 whitespace-nowrap text-xs">
                          <Checkbox
                            checked={checked}
                            onChange={() => handleSelectOne(item)}
                            size="small"
                          />
                        </td>
                      )}

                      {headers.map((header, colIndex) => {

                        if (header.fieldName === "generateToken") {
  const isEmfit =
    item.deviceName?.toLowerCase() === "emfit" ||
    item.type?.toLowerCase() === "emfit";

  return (
    <td
      key={colIndex}
      className="text-center py-4 px-4 whitespace-nowrap text-xs"
    >
      {isEmfit ? (
        <button
          onClick={() => onGenerateToken?.(item)}
          className="bg-[#EF9421] text-white px-3 py-1 rounded text-xs hover:bg-orange-400"
        >
          Generate
        </button>
      ) : (
        "-"
      )}
    </td>
  );
}

                        if (header.fieldName?.toLowerCase() === "status") {
                          return (
                            <td
                              key={colIndex}
                              className="py-4 px-2 whitespace-nowrap text-xs"
                            >
                              <button
                                onClick={() =>
                                  onStatusToggle?.(item._id, item.status)
                                }
                                className={`px-3 py-1 rounded-full text-xs font-medium ${item.status === false
                                    ? "bg-red-100 text-red-600"
                                    : "bg-green-100 text-green-600"
                                }`}
                              >
                                {item.status === false ? "Inactive" : "Active"}
                              </button>
                            </td>
                          );
                        }

                        return (
                          <td
                            key={colIndex}
                            className="text-left py-4 px-4 whitespace-nowrap text-sm"
                          >
                            {colIndex === 0 && viewLink ? (
                              <Link to={`${viewLink}?id=${item._id}`}>
                                <span className="text-[#EF9421] font-medium cursor-pointer">
                                  {item[header.fieldName]}
                                </span>
                              </Link>
                            ) : (
                              <span className="text-gray-700 dark:text-white">
                                {item[header.fieldName]}
                              </span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })
              )}
              </tbody>
            </table>
          </div>

          {showLoadMore && (
            <div
              ref={loadMoreRef}
              className="flex justify-center py-6 text-sm text-gray-500"
            >
              {loading
                ? "Loading more..."
                : hasNextPage
                ? "Scroll to load more"
                : ""}
            </div>
          )}
        </>
      )}
    </>
  );
};

export default DataTablePro;
