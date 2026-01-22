// import React, { useEffect, useState } from "react";
// import { RxCross2 } from "react-icons/rx";
// import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
// import { LuSearch } from "react-icons/lu";
// // import { decrypt, encrypt } from "../../functions";

// export const Search = (props) => {
//   const [searchParams, setSearchParams] = useSearchParams();
//   const [query, setQuery] = useState(searchParams.get("search") || ""); // Decrypt the search query

//   useEffect(() => {
//   }, [query]);

//   const navigate = useNavigate();
//   const location = useLocation();

//   const handleInputChange = (e) => {
//     const value = e.target.value;

//     if (/\s/.test(value)) {
//     return;
//   }
//     if (props?.numberOnly) {
//       if (/^\d*$/.test(value)) {
//         setQuery(value);
//       }
//     } else if (value.length < 31) {
//       setQuery(value);
//     } else {
//       return;
//     }
//   };

//   const handleSearch = () => {
//     const params = new URLSearchParams(location.search);
//     if (query) {
//       params.set("search", query); // Encrypt the query before setting it
//     } else {
//       params.delete("search");
//     }
//     navigate({ search: params.toString() });
//   };

//   const handleClearSearch = () => {
//     setQuery("");
//     searchParams.set("search", "");
//     const params = new URLSearchParams(location.search);
//     params.delete("search");
//     navigate({ search: params.toString() });
//   };

//   const handleKeyPress = (e) => {
//     if (e.key === "Enter") {
//       handleSearch();
//     }
//   };

//   return (
//     <div
//       className={`${
//         props.containerClassName
//           ? props.containerClassName
//           : "hidden lg:flex items-center gap-2 my-3"
//       }`}
//     >
//       <div className="relative shadow-sm">
//         <LuSearch
//           size={18}
//           className="absolute top-1/2 -translate-y-1/2 left-2 dark:text-white text-gray-400"
//         />
//         <input
//           className={`${
//             props?.inputClassName
//               ? props.inputClassName
//               : "lg:min-w-[20rem] p-4"
//           } bg-[#F4F5F8] dark:bg-gray-900 dark:text-white rounded-md pl-8`}
//           type="text"
//           value={query}
//           onChange={handleInputChange}
//           onKeyDown={handleKeyPress}
//           placeholder={props?.placeholder}
//         />
//         {
//           // searchParams.get("search")
//           query !== "" && (
//             <button
//               className={`${
//                 props.filter ? "right-6" : "right-2"
//               } absolute top-1/2 -translate-y-1/2 dark:text-white`}
//               onClick={handleClearSearch}
//             >
//               <RxCross2 size={18} />
//             </button>
//           )
//         }
//         {props.filter && (
//           <>{props.filter}</>
//         )}
//       </div>
//     </div>
//   );
// };

import React, { useEffect, useState } from "react";
import { RxCross2 } from "react-icons/rx";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { LuSearch } from "react-icons/lu";

export const Search = (props) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("search") || "");
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ Keep query in sync if user navigates or params change
  useEffect(() => {
    const currentSearch = searchParams.get("search") || "";
    setQuery(currentSearch);
  }, [searchParams]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    if (props?.numberOnly) {
      if (/^\d*$/.test(value)) setQuery(value);
    } else if (value.length <= 30) {
      setQuery(value);
    }
  };

  const handleSearch = () => {
    const params = new URLSearchParams(location.search);
    if (query.trim()) {
      params.set("search", query.trim());
    } else {
      params.delete("search");
    }
    navigate({ search: params.toString() });
  };

  const handleClearSearch = () => {
    setQuery("");
    const params = new URLSearchParams(location.search);
    params.delete("search");
    navigate({ search: params.toString() });
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch();
    }
  };

  return (
    <div
      className={`${
        props.containerClassName
          ? props.containerClassName
          : "flex items-center gap-2 my-3"
      }`}
    >
      <div className="relative shadow-sm rounded-md">
        <LuSearch
          size={18}
          className="absolute top-1/2 -translate-y-1/2 left-2 dark:text-white text-gray-400"
        />
        <input
          className={`${
            props?.inputClassName
              ? props.inputClassName
              : "lg:min-w-[20rem] p-4"
          } bg-[#F4F5F8] dark:bg-gray-900 dark:text-white rounded-md !pl-8`}
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyPress}
          placeholder={props?.placeholder || "Search..."}
        />
        {query !== "" && (
          <button
            className={`${
              props.filter ? "right-6" : "right-2"
            } absolute top-1/2 -translate-y-1/2 dark:text-white`}
            onClick={handleClearSearch}
          >
            <RxCross2 size={18} />
          </button>
        )}
        {props.filter && props.filter}
      </div>
    </div>
  );
};
