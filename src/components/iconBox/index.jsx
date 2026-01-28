import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { IoIosArrowForward, IoIosArrowRoundForward } from "react-icons/io";
import { iconSize } from "../../utils";
import { FaAngleRight } from "react-icons/fa";

export const IconBox = ({
  to,
  icon,
  item,
  child,
  title,
  setPin,
  onClick,
  collapse,
  className,
  isActive,
}) => {
  const [dropdown, setDropdown] = useState(false);
  const { pathname } = useLocation();

  const handleDropdown = () => {
    setDropdown(!dropdown);
  };

  // Check if item is active (handles query parameters)
  const isItemActive = () => {
    if (isActive !== undefined) {
      return isActive;
    }
    // Fallback to pathname comparison
    return (
      pathname === to ||
      item?.matches?.some((match) => pathname.includes(match))
    );
  };

  useEffect(() => {
    if (
      child?.some((data) => pathname.includes(data.to)) ||
      child?.some((item) =>
        item?.matches?.some((match) => pathname.includes(match))
      )
    ) {
      setDropdown(true);
    } else {
      setDropdown(false);
    }
  }, [pathname, child]);

  const isMatching = child?.some((item) => {
    return item?.matches?.some((match) => {
      return pathname === match || pathname.startsWith(match);
    });
  });

  const currentItemActive = isItemActive();

  return (
    <>
      {to ? (
        <Link
          to={to}
          className={`${className} px-2 py-2.5 ${
            currentItemActive
              ? "!bg-orange-50 dark:bg-orange-50 border-r-4 border-[#EF9E33]"
              : ""
          } relative flex items-center gap-4 text-black dark:text-white hover:!bg-orange-50 dark:hover:bg-orange-50 rounded`}
          onClick={onClick}
          data-tooltip-id={collapse ? "my-tooltip" : ""}
          data-tooltip-content={item.title}
        >
          <span
            className={`${
              currentItemActive
                ? "!text-[#EF9E33] dark:text-[#EF9E33]"
                : "text-black dark:text-white"
            } `}
          >
            {icon && icon}
          </span>
          {title && (
            <span
              className={`${
                currentItemActive
                  ? "!text-[#EF9E33] dark:text-[#EF9E33]"
                  : "text-black dark:text-white"
              } text-base flex items-center`}
            >
              {title}
            </span>
          )}
          {child && (
            <FaAngleRight
              className={`absolute right-2 ml-2 transform transition-transform ${
                currentItemActive ? "rotate-90" : "rotate-0"
              }`}
            />
          )}
        </Link>
      ) : (
        <button
          data-tooltip-id={collapse ? "my-tooltip" : ""}
          data-tooltip-content={item.title}
          onClick={handleDropdown}
          className={`${className} ${
            isMatching || dropdown ? "!bg-[#FBF5FF] dark:bg-[#392347]" : ""
          } w-full px-2 py-2.5 flex items-center justify-between gap-2 hover:!bg-[#EF9E33] dark:hover:bg-[#EF9E33] rounded`}
        >
          <p className="flex gap-4 dark:text-white">
            <span
              className={`${
                isMatching || dropdown
                  ? "!text-[#884EA7] dark:text-white"
                  : "text-black dark:text-white"
              }`}
            >
              {icon && icon}
            </span>
            {title && (
              <span
                className={`${
                  isMatching || dropdown
                    ? "!text-[#884EA7] dark:text-white"
                    : "text-black dark:text-white"
                } text-base`}
              >
                {title}
              </span>
            )}
          </p>
          {!collapse && (
            <span className="flex items-center gap-2">
              <IoIosArrowForward
                className={`${dropdown && "rotate-90"} ${
                  isMatching ? "!text-[#884EA7]" : "dark:text-white"
                }`}
              />
            </span>
          )}
        </button>
      )}
      {dropdown && (
        <>
          {child && (
            <>
              <ul className={`mt-2.5 space-y-0.5 ${!collapse && "mb-3"}`}>
                {child.map((data, index) => {
                  const isChildActive =
                    pathname.includes(data.to) ||
                    data?.matches?.some((match) => pathname.includes(match));

                  return (
                    <li
                      data-tooltip-id={collapse ? "my-tooltip" : ""}
                      data-tooltip-content={data.title}
                      className={`${data.className} ${
                        collapse ? "px-0" : "px-4"
                      } group`}
                      key={index}
                    >
                      <Link
                        to={data.to}
                        className={`${
                          isChildActive ? "bg-orange-100 dark:bg-orange-900/30" : ""
                        } ${
                          collapse ? "px-2 py-2.5" : "py-1 pl-2 pr-1"
                        } rounded-xl flex items-center gap-2`}
                      >
                        <span className="flex items-center gap-2">
                          {data.icon ? (
                            <span
                              className={`${
                                isChildActive
                                  ? "fill-primaryText !text-[#884EA7]"
                                  : "text-black dark:text-white group-hover:!text-[#884EA7]"
                              } `}
                            >
                              {data.icon}
                            </span>
                          ) : (
                            <IoIosArrowRoundForward
                              className={`${
                                isChildActive
                                  ? "fill-primaryText !fill-[#884EA7]"
                                  : "fill-black dark:fill-white group-hover:fill-[#884EA7]"
                              }`}
                              size={iconSize}
                            />
                          )}
                          {!collapse && data.title && (
                            <span
                              className={`${
                                isChildActive
                                  ? "!text-[#884EA7]"
                                  : "text-black dark:text-white group-hover:!text-[#884EA7]"
                              } text-sm`}
                            >
                              {data.title}
                            </span>
                          )}
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </>
          )}
        </>
      )}
    </>
  );
};