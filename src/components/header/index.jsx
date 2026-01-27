import { Button } from "../buttons";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { FiLogOut } from "react-icons/fi";
import { headerLinks } from "../../database";
import { HiOutlineUser } from "react-icons/hi";
import { GiHamburgerMenu } from "react-icons/gi";
import { CrossButton } from "../buttons/crossButton";
import { IoIosArrowDown } from "react-icons/io";
import { AnimatePresence, motion } from "framer-motion";
import { IoSettingsOutline } from "react-icons/io5";
import { useOutsideClick } from "../../functions";
import { iconSize } from "../../utils";
import SearchIcon from "@mui/icons-material/Search";
import { useLocation } from "react-router-dom";

import {
  LuAlignJustify,
  LuPanelLeftClose,
  LuUser
} from "react-icons/lu";
import { useDispatch } from "react-redux";
import { getUserDetails } from "../../redux/actions/user-action";
import { getHomeDetails } from "../../redux/actions/home-action";
import { getAlertDetails } from "../../redux/actions/alert-action";
import { getDeviceDetails } from "../../redux/actions/device-action";
import { getResidentDetails } from "../../redux/actions/resident-action";
import { IoMdLogOut } from "react-icons/io";

export const Header = ({ className, collapse, setCollapse }) => {
  const [hamburgerOpen, setHamburgerOpen] = useState(false);
  const [signedInMenuPopup, setSignedInMenuPopup] = useState(false);
  const [signOutModalOpen, setSignOutModalOpen] = useState(false);
  const navigate = useNavigate();
  // To close when someone clicks outside

  const signedInMenuPopupRef = useRef();

  const handleSignInMenuPopup = () => {
    setSignedInMenuPopup(!signedInMenuPopup);
  };

  useOutsideClick(signedInMenuPopupRef, handleSignInMenuPopup);

  // Dummy variables

  const signedIn = true;
  const profile = false;

  // Handle sidebar collapse

  const handleSidebar = () => {
    setCollapse(!collapse);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const location = useLocation();
  const pathname = location.pathname;

  const getRouteName = () => {
    const path = pathname.split("/").filter(Boolean);

    if (path.length === 0) return "Search";

    return path[path.length - 1]
      .replace(/-/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const isDashboard = pathname.startsWith("/dashboard") || pathname === "/";

  const dispatch = useDispatch();
  const [searchText, setSearchText] = useState("");

  const searchRoutes = [
    { path: "/user", action: getUserDetails },
    { path: "/home", action: getHomeDetails },
    { path: "/devices", action: getDeviceDetails },
    { path: "/alerts", action: getAlertDetails },
    { path: "/resident", action: getResidentDetails },
  ];

  const activeSearchRoute = searchRoutes.find((item) =>
    pathname.startsWith(item.path)
  );
  const isFirstRender = useRef(true);
  const prevSearchText = useRef("");

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      prevSearchText.current = searchText;
      return;
    }

    if (!activeSearchRoute) return;
    if (searchText === "" && prevSearchText.current === "") return;

    const timer = setTimeout(() => {
      dispatch(
        activeSearchRoute.action({
          limit: 10,
          cursor: null,
          search: searchText,
        })
      );
    }, 500);

    prevSearchText.current = searchText;

    return () => clearTimeout(timer);
  }, [searchText, dispatch, activeSearchRoute]);

  useEffect(() => {
    setSearchText("");
  }, [location.pathname]);

  return (
    <header
      className={`${className && className
        } bg-headerBg bg-white dark:bg-slate-900 px-2 lg:!px-4 py-4 z-[1000]`}
    >
      <div className="relative flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Link to={"/"} className="flex items-center">
            <img
              className="block dark:hidden w-36 h-auto"
              src="/icons/ALlogo.png"
              alt="anacity-logo"
            />
            <img
              className="hidden dark:block w-36 h-auto"
              src="/icons/ALlogo.png"
              alt="anacity-logo"
            />
          </Link>
          <button
            onClick={handleSidebar}
            className="flex items-center justify-center"
          >
            {!collapse ? (
              <LuPanelLeftClose
                className="text-black dark:text-white"
                size={iconSize}
              />
            ) : (
              <LuAlignJustify
                className="text-black dark:text-white"
                size={iconSize}
              />
            )}
          </button>
        </div>

        <div className="hidden lg:flex items-center gap-4">
          {headerLinks?.map((data, index) => (
            <Link
              className={`${window.location.pathname.includes(data.url) && "text-primary"
                } hover:text-primary`}
              to={data.url}
              key={index}
            >
              {data.label}
            </Link>
          ))}
        </div>
        {signedIn ? (
          <div className="flex items-center gap-4">
            {/* <ThemeSwitch /> */}
            {/* <FullScreenButton /> */}
            {/* <Notification /> */}
            <div className="hidden sm:!flex relative gap-2">

              {/* {activeSearchRoute && (
                <div className="flex justify-end">
                  <div className="relative w-64">
                    <SearchIcon
                      fontSize="small"
                      className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <input
                      type="text"
                      value={searchText}
                      onChange={(e) => setSearchText(e.target.value)}
                      placeholder={`Search ${getRouteName()}...`}
                      className="w-full pl-8 pr-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#EF9421]"
                    />
                  </div>
                </div>
              )} */}

              <button
                onClick={() => setSignedInMenuPopup(!signedInMenuPopup)}
                className="flex items-center gap-2"
              >
              <div
  className="rounded-md  flex items-center gap-1 cursor-pointer"
>
  <div className="w-[25px] h-[25px] rounded-full bg-gray-700 flex items-center justify-center">
    <LuUser  className="text-white w-[18px] h-[18px]" />
  </div>
  <span className="text-black text-sm font-medium">Admin</span>
</div>

              </button>
            </div>
          
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-2">
              <Link v3={true} to={"/sign-in"}>
                Sign in
              </Link>
            </div>
            <button
              className="block lg:hidden"
              onClick={() => setHamburgerOpen(!hamburgerOpen)}
            >
              <GiHamburgerMenu className="text-xl" />
            </button>
          </div>
        )}
        {/* Mobile Hamburger Menu */}
        <AnimatePresence>
          {hamburgerOpen && (
            <motion.div
              initial={{ scale: 0, translateX: 500 }}
              animate={{ scale: 1, translateX: 0 }}
              exit={{ scale: 0, translateX: 500 }}
              className="lg:hidden absolute top-0 left-0 p-4 w-full h-screen bg-white dark:bg-darkPrimary flex flex-col justify-center items-center gap-4 z-[999]"
            >
              <CrossButton onClick={() => setHamburgerOpen(!hamburgerOpen)} />
              <div className="flex flex-col items-center gap-4">
                {headerLinks?.map((data, index) => (
                  <Link
                    className="w-fit hover:text-primary"
                    to={data.url}
                    key={index}
                  >
                    {data.label}
                  </Link>
                ))}
              </div>
              {signedIn ? (
                <div className="relative sm:hidden">
                  <button
                    onClick={() => setSignedInMenu(!signedInMenu)}
                    className="flex items-center gap-2"
                  >
                    <HiOutlineUser className="text-lg" />
                    <p>My Account</p>
                    <IoIosArrowDown />
                  </button>
                  <div className="p-4 w-full absolute top-8 left-1/2 -translate-x-1/2 bg-white dark:bg-darkPrimary border border-[#C6C6C6] shadow rounded-md z-10 flex flex-col items-start justify-start gap-2">
                    <Link to={"/"} className="flex items-center gap-2">
                      <HiOutlineUser />
                      <p className="text-sm">My Profile</p>
                    </Link>
                    <Link to={"/"} className="flex items-center gap-2">
                      <IoSettingsOutline />
                      <p className="text-sm">Settings</p>
                    </Link>
                    <Link to={"/"} className="flex items-center gap-2">
                      <FiLogOut />
                      <p className="text-sm">Sign out</p>
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link v3={true} className="w-fit" to={"/signin"}>
                    Sign in
                  </Link>
                  <Link
                    v2={true}
                    className="w-fit px-2 py-1 rounded-lg"
                    to={"/forgot-password"}
                  >
                    Forgot Password
                  </Link>
                </div>
              )}
            </motion.div> 
          )}
        </AnimatePresence>

        {/* Sign Out Modal */}
        <AnimatePresence>
          {signOutModalOpen && (
            <motion.div
              initial={{ scale: 0, translateY: 500 }}
              animate={{ scale: 1, translateY: 0 }}
              exit={{ scale: 0, translateY: 500 }}
              onClick={() => setSignOutModalOpen(!signOutModalOpen)}
              className="w-full h-full inset-0 bg-black/10 bg-opacity-50 fixed top-0 bottom-0 left-0 right-0 z-[1005]"
            >
              <div
                className={`w-11/12 sm:w-8/12 lg:w-1/3 h-40 flex flex-col justify-center items-center gap-6 bg-white dark:bg-[#171717] p-1 overflow-hidden rounded-lg shadow-2xl absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2`}
              >
                <div className="flex items-center justify-center text-base md:text-xl dark:text-white ">
                  <div>Are you sure you want to signout?</div>
                </div>
                <div className="flex items-center justify-center gap-4">
                  <Button
                    // disabled={isLoggingOut}
                    // isLoading={isLoggingOut}
                    onClick={handleLogout}
                    mainPrimary={true}
                  >
                    Sign Out
                  </Button>
                  <Button
                    onClick={() => setSignOutModalOpen(!signOutModalOpen)}
                    outLine={true}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};
