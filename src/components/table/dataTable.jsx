import React, { useState, useEffect, useRef } from 'react'
import { TableShimmer } from '../shimmers/tableShimmer'
import { Link } from 'react-router-dom'
import {
    IconButton,
    Menu,
    MenuItem,
    Switch
} from "@mui/material";
import {
    DotsVertical,
    EyeArrowLeftOutline,
    PencilOutline,
} from "mdi-material-ui";
import SearchIcon from "@mui/icons-material/Search";

const DataTable = ({
    loading = false,
    headers = [],
    data = [],
    addLink = "/",
    onGenerateToken,
    addButtonLabel = "Add",
    showAddButton = true,
    editLink = "/",
    viewLink = "/",
    title = "",
    statusToggle = false,
    onStatusToggle,
    showActionType = "default",

    showLoadMore = false,
    hasNextPage = false,
    onLoadMore,

    onResolveChange,
    onSearch
}) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedRowId, setSelectedRowId] = useState(null);
    const [tableData, setTableData] = useState([]);

    const rowOptionsOpen = Boolean(anchorEl);
    const loadMoreRef = useRef(null);

    useEffect(() => {
        setTableData(data);
    }, [data]);

    const handleRowOptionsClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleRowOptionsClose = () => {
        setAnchorEl(null);
        setSelectedRowId(null);
    };

    useEffect(() => {
      if (!showLoadMore || !loadMoreRef.current) return;

      const observer = new IntersectionObserver(
        (entries) => {
          const firstEntry = entries[0];

          if (
            firstEntry.isIntersecting &&
            hasNextPage &&
            !loading &&
            tableData.length > 0
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

      if (currentRef) {
        observer.observe(currentRef);
      }

      return () => {
        if (currentRef) {
          observer.unobserve(currentRef);
        }
      };
    }, [showLoadMore, hasNextPage, loading, tableData.length, onLoadMore]);

    const [searchValue, setSearchValue] = useState("");

    return (
        <>
            {loading && tableData.length === 0 ? (
                <TableShimmer />
            ) : (
                <>
                    <div className="px-2 py-3">
                        <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                            {title}
                        </h2>
                        {showAddButton && (
                            <Link to={addLink}>
                                <button className="bg-[#EF9421] text-white hover:bg-orange-500 px-3 py-2 rounded text-sm hover:opacity-90">
                                    {addButtonLabel}
                                </button>
                            </Link>
                        )}
                    </div>
                        {/* <div className="mt-3 flex justify-end">
                            <div className="relative w-64">
                                <SearchIcon
                                    fontSize="small"
                                    className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400"
                                />
                                <input
                                    type="text"
                                    value={searchValue}
                                    placeholder={`Search ${title}...`}
                                    onChange={(e) => {
                                        setSearchValue(e.target.value);
                                        onSearch?.(e.target.value);
                                    }}
                                    className="w-full pl-8 pr-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#EF9421]"
                                />
                            </div>
                        </div> */}
                    </div>

                    <div className="overflow-x-auto overflow-y-auto min-h-[500px] mx-auto w-full">
                        <table className="min-w-full bg-white dark:bg-slate-800 table-striped">
                            <thead>
                                <tr className="w-full bg-[#F0F0F0] dark:bg-gray-900">
                                    {headers.map((header, index) => (
                                        <th
                                            key={index}
                                            className="text-center py-4 px-4 font-normal text-xs whitespace-nowrap"
                                        >
                                            <div className="flex items-center justify-center text-[#121212] dark:text-gray-200">
                                                {header.headerName}
                                            </div>
                                        </th>
                                    ))}
                                </tr>
                            </thead>

                            <tbody>
                                {tableData.map((item, index) => (
                                    <tr
                                        key={index}
                                        className="table-row border-b border-dashed border-gray-300 dark:border-gray-500 last:border-none hover:bg-gray-50/50 dark:hover:bg-gray-700/50"
                                    >
                                        {headers.map((header, hIndex) => {
                                            if (header.fieldName === "#") {
                                                return (
                                                    <td
                                                        key={hIndex}
                                                        className="text-center py-4 px-1 whitespace-nowrap text-xs"
                                                    >
                                                        {index + 1}
                                                    </td>
                                                );
                                            }
                                            if (header.fieldName === "generateToken") {
                                                const isEmfit =
                                                    item.deviceName?.toLowerCase() === "emfit" ||
                                                    item.type?.toLowerCase() === "emfit";

                                                return (
                                                    <td key={hIndex} className="text-center py-4 text-xs">
                                                        {isEmfit ? (
                                                            <button
                                                                onClick={() => onGenerateToken?.(item)}
                                                                className="bg-[#EF9421] text-white px-3 py-1 rounded text-xs hover:bg-orange-400"
                                                            >
                                                                Generate
                                                            </button>
                                                        ) : "-"}
                                                    </td>
                                                );
                                            }

                                            if (header.headerName === "Action") {
                                                return (
                                                    <td
                                                        key={hIndex}
                                                        className="text-center py-4 px-1 whitespace-nowrap text-xs"
                                                    >
                                                        <IconButton
                                                            size="small"
                                                            onClick={(e) => {
                                                                setSelectedRowId(item?._id);
                                                                handleRowOptionsClick(e);
                                                            }}
                                                        >
                                                            <DotsVertical />
                                                        </IconButton>

                                                        <Menu
                                                            elevation={0}
                                                            keepMounted
                                                            anchorEl={anchorEl}
                                                            open={rowOptionsOpen}
                                                            onClose={handleRowOptionsClose}
                                                        >
                                                            {showActionType === "resolve" ? (
                                                                <>
                                                                    <MenuItem
                                                                        onClick={() => {
                                                                            onResolveChange?.(selectedRowId, true);
                                                                            handleRowOptionsClose();
                                                                        }}
                                                                    >
                                                                        Resolve
                                                                    </MenuItem>

                                                                    <MenuItem
                                                                        onClick={() => {
                                                                            onResolveChange?.(selectedRowId, false);
                                                                            handleRowOptionsClose();
                                                                        }}
                                                                    >
                                                                        Unresolved
                                                                    </MenuItem>
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <Link to={`${editLink}?id=${selectedRowId}`}>
                                                                        <MenuItem onClick={handleRowOptionsClose}>
                                                                            <PencilOutline fontSize="small" sx={{ mr: 2 }} />
                                                                            Edit
                                                                        </MenuItem>
                                                                    </Link>

                                                                    {viewLink && (
                                                                        <Link to={`${viewLink}?id=${selectedRowId}`}>
                                                                            <MenuItem onClick={handleRowOptionsClose}>
                                                                                <EyeArrowLeftOutline fontSize="small" sx={{ mr: 2 }} />
                                                                                View
                                                                            </MenuItem>
                                                                        </Link>
                                                                    )}
                                                                </>
                                                            )}
                                                        </Menu>
                                                    </td>
                                                );
                                            }

                                            if (statusToggle && header.fieldName?.toLowerCase() === "status") {
                                                return (
                                                    <td
                                                        key={hIndex}
                                                        className="text-center py-4 px-1 whitespace-nowrap text-xs"
                                                    >
                                                        <Switch
                                                            checked={Boolean(item.status)}
                                                            onChange={() =>
                                                                onStatusToggle &&
                                                                onStatusToggle(item._id, item.status)
                                                            }
                                                            size="small"
                                                            sx={{
                                                                '& .MuiSwitch-switchBase.Mui-checked': {
                                                                    color: '#EF9421',
                                                                },
                                                                '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                                                    backgroundColor: '#EF9421',
                                                                },
                                                                '& .MuiSwitch-track': {
                                                                    backgroundColor: '#E5E5E5',
                                                                },
                                                            }}
                                                        />
                                                    </td>
                                                );
                                            }

                                           return (
  <td
    key={hIndex}
    className="text-center py-4 px-1 whitespace-nowrap text-xs"
  >
   {hIndex === 1 && viewLink ? (
  <Link to={`${viewLink}?id=${item._id}`}>
    <span className="dark:text-white px-3 py-1 rounded-full cursor-pointer text-[#EF9421]">
      {item[header.fieldName]}
    </span>
  </Link>
) : (
  <span className="dark:text-white px-3 py-1 rounded-full">
    {item[header.fieldName]}
  </span>
)}
  </td>
);

                                        })}
                                    </tr>
                                ))}
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

export default DataTable;