import { IconBox } from "../iconBox";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import {
  LuHouse,
  LuUserRound,
  LuCircleAlert,
  LuListTodo,
  LuLayoutDashboard,
  LuLogOut
} from "react-icons/lu";
import { FaRegUserCircle } from "react-icons/fa";
import { MdOutlineDevices } from "react-icons/md";
import { FaPeopleRoof } from "react-icons/fa6";
import { iconSize } from "../../utils";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "../buttons";

export const Sidebar = ({ className, collapse }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const initialSidebarItems = [
    {
      id: 0,
      title: "Dashboard",
      icon: <LuLayoutDashboard size={iconSize} />,
      to: "/dashboard",
      isPinned: false,
    },
    {
      id: 1,
      title: "User",
      icon: <LuUserRound size={iconSize} />,
      to: "/user",
      isPinned: false,
    },
    {
      id: 2,
      title: "Home",
      icon: <LuHouse size={iconSize} />,
      to: "/home",
      isPinned: false,
    },
    {
      id: 3,
      title: "Devices",
      icon: <MdOutlineDevices size={iconSize} />,
      to: "/device",
      isPinned: false,
    },
    {
      id: 4,
      title: "Alerts",
      icon: <LuCircleAlert size={iconSize} />,
      to: "/alert",
      isPinned: false,
    },
    {
      id: 5,
      title: "Alert Logs",
      icon: <LuListTodo size={iconSize} />,
      to: "/alert-logs",
      isPinned: false,
    },
    {
      id: 6,
      title: "Resident Management",
      icon: <FaPeopleRoof size={iconSize} />,
      to: "/resident",
      isPinned: false,
    },
    {
      id: 7,
      title: "Early Access Users",
      icon: <FaRegUserCircle  size={iconSize} />,
      to: "/early-access",
      isPinned: false,
    },
  ];

  const [items, setItems] = useState(initialSidebarItems);
  const [signOutModalOpen, setSignOutModalOpen] = useState(false);

 const isRouteActive = (itemPath) => {
    const currentPath = location.pathname;
    return currentPath === itemPath || currentPath.startsWith(itemPath + "/");
  };

  const handlePinToggle = (title) => {
    setItems((prevItems) => {
      const updatedItems = prevItems.map((item) =>
        item.title === title ? { ...item, isPinned: !item.isPinned } : item
      );

      const pinnedItems = updatedItems.filter((item) => item.isPinned);
      const nonPinnedItems = updatedItems.filter((item) => !item.isPinned);

      nonPinnedItems.sort((a, b) => a.id - b.id);

      return [...pinnedItems, ...nonPinnedItems];
    });
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <>
      <AnimatePresence>
        <motion.div
          initial={{ left: "-50%" }}
          animate={{ left: 0, transition: { duration: 0.3 } }}
          exit={{ left: "-50%", transition: { duration: 0.3 } }}
          className={`${
            className ? className : ""
          } shadow-sm dark:dark:bg-slate-900 flex flex-col h-[calc(100vh-80px)]`}
        >
          {/* Sidebar Items */}
          <div className="flex-1 overflow-hidden">
            {items?.map((item, index) => (
              <IconBox
                containerClassName="px-4 py-2"
                titleClassName={
                  item.to == null && "font-semibold !text-[#884ea7] uppercase "
                }
                className={item.className}
                item={item}
                key={index}
                to={item.to}
                icon={item.icon}
                title={!collapse ? item.title : ""}
                child={item.child}
                setPin={() => handlePinToggle(item.title)}
                collapse={collapse}
                isActive={isRouteActive(item.to)}
              />
            ))}
          </div>

          {/* Logout Button */}
          <div className="border-t border-gray-200 dark:border-slate-700 pt-2 mt-4">
            <button
              onClick={() => setSignOutModalOpen(true)}
              className="w-full flex items-center gap-3 p-2 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200 font-medium"
            >
              <LuLogOut size={iconSize} />
              {!collapse && <span>Logout</span>}
            </button>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* ✅ Sign Out Modal */}
      <AnimatePresence>
        {signOutModalOpen && (
          <motion.div
            initial={{ scale: 0, translateY: 500 }}
            animate={{ scale: 1, translateY: 0 }}
            exit={{ scale: 0, translateY: 500 }}
            onClick={() => setSignOutModalOpen(false)}
            className="w-full h-full inset-0 bg-black/10 fixed top-0 bottom-0 left-0 right-0 z-[1005]"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="w-11/12 sm:w-8/12 lg:w-1/3 h-40 flex flex-col justify-center items-center gap-6 bg-white dark:bg-[#171717] p-1 overflow-hidden rounded-lg shadow-2xl absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            >
              <div className="flex items-center justify-center text-base md:text-xl dark:text-white">
                <div>Are you sure you want to signout?</div>
              </div>

              <div className="flex items-center justify-center gap-4">
                <Button onClick={handleLogout} mainPrimary={true}>
                  Sign Out
                </Button>
                <Button
                  onClick={() => setSignOutModalOpen(false)}
                  outLine={true}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
