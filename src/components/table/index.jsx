import { useState, useEffect } from "react";
import ReactPaginate from "react-paginate";
import { IoArrowUpOutline } from "react-icons/io5";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { MoreOption } from "../moreOption";
import { Link } from "react-router-dom";
import { TableShimmer } from "../shimmers/tableShimmer";
import { Toggle } from "../inputs/toogle";
import { NoData } from "../noDara";
import { LoaderIcon } from "react-hot-toast";

export const Table = ({
  loading,
  headers,
  initialData,
  selectedValue,
  setSelectedValue,
  currentPage,
  setCurrentPage,
  setSort,
  headersSort,
  totalPages,

  movingRows = {},
}) => {
  // const [data, setData] = useState(initialData);
  const data = initialData

  const [sorting, setSorting] = useState({
    column: null,
    direction: "asc", // "asc" or "desc"
  });

  // Handler for select change
  const handleChange = (event) => {
    setSelectedValue(parseInt(event.target.value));
  };

  // useEffect(() => {
  //   setData(initialData);
  // }, [initialData]);

  // Function to handle sorting
  const handleSort = (column) => {
    setSort((prev) => {
      return {
        column: headersSort[column],
        direction: prev.direction == "DESC" ? "ASC" : "DESC",
      };
    });

    if (sorting.column === column) {
      setSorting((prevSorting) => ({
        ...prevSorting,
        direction: prevSorting.direction === "asc" ? "desc" : "asc",
      }));
    } else {
      setSorting({
        column,
        direction: "asc",
      });
    }
  };

  // Function to handle page change
  const handlePageChange = (selectedPage) => {
    setCurrentPage(selectedPage.selected);
  };

  let itemsPerPageCount = [];

  for (let i = 10; i <= 50; i++) {
    if (i % 10 == 0) {
      itemsPerPageCount.push(i);
    }
  }
  return (
    <>
      {loading ? (
        <TableShimmer />
      ) : (
        <>
          {initialData?.length > 0 ? (
            <>
              <div className="overflow-x-auto min-h-52 mx-auto w-full">
                <table className="min-w-full bg-white dark:bg-slate-800 table-striped">
                  <thead>
                    <tr className="w-full bg-[#F0F0F0] dark:bg-gray-900">
                      {headers?.map((header, index) => (
                        <th
                          key={index}
                          className="text-center py-4 px-4 font-normal text-xs whitespace-nowrap "
                        >
                          <div className="flex items-center justify-center text-[#121212] dark:text-gray-200 ">
                            {header}
                            <>
                              {/* {!headersSort &&
                                !header.toLowerCase().includes("action") && (
                                  <button
                                    className="ml-2"
                                    onClick={() => handleSort(index)}
                                  >
                                    <IoArrowUpOutline
                                      className={`${
                                        sorting.column === index &&
                                        sorting.direction === "asc"
                                          ? "rotate-180"
                                          : ""
                                      }`}
                                    />
                                  </button>
                                )} */}
                              {headersSort &&
                                !header.toLowerCase().includes("action") &&
                                headersSort[index].length > 0 && (
                                  <button
                                    className="ml-2"
                                    onClick={() => handleSort(index)}
                                  >
                                    <IoArrowUpOutline
                                      className={`${
                                        sorting.column === index &&
                                        sorting.direction === "asc"
                                          ? "rotate-180"
                                          : ""
                                      }`}
                                    />
                                  </button>
                                )}
                            </>
                            {/* {Object.entries(header).map(
                          ([key, cell], cellIndex) => (
                           
                          )
                        )} */}
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td
                          colSpan={headers?.length}
                          className="text-center py-4 "
                        >
                          Loading...
                        </td>
                      </tr>
                    ) : (
                      <>
                        <>
                          {data?.map((row, rowIndex) => (
                            <tr
                              key={rowIndex}
                              // className="border-b border-dashed border-gray-300 dark:border-gray-500 last:border-none"
                              className={`table-row border-b border-dashed border-gray-300 dark:border-gray-500 
                last:border-none hover:bg-gray-50/50 dark:hover:bg-gray-700/50
                ${movingRows[rowIndex] || ""}`}
                            >
                              {Object.entries(row).map(
                                ([key, cell], cellIndex) => (
                                  <td
                                    key={cellIndex}
                                    className={`text-center py-4 px-1 whitespace-nowrap text-xs`}
                                  >
                                    {renderCell(cell, row)}
                                  </td>
                                )
                              )}
                            </tr>
                          ))}
                        </>
                      </>
                    )}
                  </tbody>
                </table>
              </div>

              {totalPages > 1 && (
                <div className="px-2 py-4 flex flex-col sm:flex-row justify-start items-center gap-4 bg-white dark:bg-slate-800">
                  <div className="flex items-center">
                    <p className="text-xs text-black dark:text-white">
                      Rows per page:
                    </p>
                    <select
                      className="focus:outline-none text-xs px-2"
                      value={selectedValue}
                      onChange={handleChange}
                    >
                      {itemsPerPageCount?.map((i, k) => (
                        <option key={k} value={i}>
                          {i}
                        </option>
                      ))}
                    </select>
                  </div>
                  {/* <p className="text-xs dark:text-white">1-10 of 22</p> */}
                  <ReactPaginate
                    previousLabel={
                      <IoIosArrowBack className="text-xs text-black dark:text-white" />
                    }
                    nextLabel={
                      <IoIosArrowForward className="text-xs text-black dark:text-white" />
                    }
                    breakLabel={"..."}
                    pageCount={totalPages}
                    marginPagesDisplayed={2}
                    pageRangeDisplayed={5}
                    forcePage={currentPage}
                    onPageChange={handlePageChange}
                    activeLinkClassName=" px-2"
                    containerClassName={
                      "pagination my-2 flex justify-center items-center gap-2 text-black dark:text-white"
                    }
                    activeClassName={"active text-primaryText"}
                  />
                </div>
              )}
            </>
          ) : (
            <NoData />
          )}
        </>
      )}
    </>
  );
};

const renderCell = (cell, row) => {
  // 1. Custom React component
  if (cell.component) return cell.component;

  // 2. Toggle cell
  if (cell.type === "toggle") {
    return (
      <div className="flex justify-center items-center">
        {!cell.loading ? (
          <Toggle onChange={cell.onChange} isChecked={cell.checked} />
        ) : (
          <LoaderIcon />
        )}
      </div>
    );
  }

  if (cell.link) {
    return (
      <Link
        to={cell.link}
        className="text-primaryText hover:underline font-medium text-xs"
        title={cell.tooltip || ""}
      >
        {cell.content}
      </Link>
    );
  }
  if (cell.type === "status") {
    const statusClasses = {
      Active: "bg-[#43b9b2]/[0.1] text-[#43b9b2] dark:text-green-300",
      "In progress": "bg-[#43b9b2]/[0.1] text-[#43b9b2] dark:text-green-300",
      Reject: "bg-[#fd7e40]/[0.1] text-[#C42A02] dark:text-red-300",
      "Under Notice": "bg-[#fd7e40]/[0.1] text-[#C42A02] dark:text-red-300",
      Occupied: "bg-[#fd7e40]/[0.1] text-[#C42A02] dark:text-red-300",
      Pending: "bg-[#fd7e4033]/[0.2] text-[#fd7e40] dark:text-yellow-300",
      "Under-Review":
        "bg-[#fd7e4033]/[0.2] text-[#fd7e40] dark:text-yellow-300",
      Inactive: "bg-[#fd7e4033]/[0.2] text-[#fd7e40] dark:text-yellow-300",
      "Not leased": "bg-[#fd7e4033]/[0.2] text-[#fd7e40] dark:text-yellow-300",
      Expired: "bg-[#2c2c31]/[0.2] text-[#2c2c31] dark:text-gray-300",
      "Modification-Required":
        "bg-[#c280d2]/[0.2] text-[#c280d2] dark:text-[#dda7eb]",
      Vacant: "bg-green-500/[0.2] text-green-900 dark:text-[#dda7eb]",
    };

    return (
      <span
        className={`${statusClasses[cell.content] || "dark:text-white"} 
        px-3 py-1 rounded-full`}
      >
        {cell.content}
      </span>
    );
  }

  return (
    <span title={cell.tooltip || ""}>
      {typeof cell.content === "string" && cell.content.length > 30
        ? cell.content.slice(0, 30) + "..."
        : cell.content}
    </span>
  );
};
