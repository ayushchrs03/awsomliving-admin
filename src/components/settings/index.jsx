import { useRef, useState } from "react";
import { IoSettingsOutline } from "react-icons/io5";
import { ThemeChange } from "../theme";
import { RxCross2 } from "react-icons/rx";
import { useDispatch, useSelector } from "react-redux";
import { setSidebarClassName } from "../../redux/slices/themeSlice";
import { AnimatePresence, motion } from "framer-motion";
import { useOutsideClick } from "../../functions";

export const Settings = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = () => {
    setIsOpen(!isOpen);
  };
  const dispatch = useDispatch();
  const sidebarClassName = useSelector((state) => state.theme.sidebarClassName);

  const handleSidebar = (type) => () => {
    if (type == "v") {
      dispatch(setSidebarClassName("flex flex-col 1"));
    } else if (type == "h") {
      dispatch(setSidebarClassName("flex flex-wrap 2"));
    }
  };

  // Closing outside clicks
  const settingsRef = useRef();
  useOutsideClick(settingsRef, handleClick);

  return (
    <>
      <button
        onClick={handleClick}
        className="p-2 rounded-full fixed bottom-2 right-2 bg-primaryBg z-50 group "
      >
        <IoSettingsOutline className="text-2xl group-hover:animate-spin stroke-white " />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={settingsRef}
            initial={{ right: "-50%" }}
            animate={{ right: 0, transition: { duration: 0.3 } }}
            exit={{ right: "-50%", transition: { duration: 0.3 } }}
            className="fixed top-0 right-0 w-full sm:w-96 h-screen bg-pageBodyBg z-[1000] border shadow-lg flex flex-col"
          >
            {/* Heading */}
            <div className="flex justify-between items-center p-4 bg-primary text-white">
              <div>
                <h1 className="text-xl text-primaryText">Preview Settings</h1>
                <p className="text-sm text-primaryText">Try It Real Time</p>
              </div>
              <button
                className="p-2 rounded-full bg-primaryBg"
                onClick={handleClick}
              >
                <RxCross2 className="text-primary " />
              </button>
            </div>
            {/* Body */}
            <div className="p-4 flex flex-col gap-4 h-screen overflow-y-auto">
              <Card label={"Unlimited Color:"}>
                <ThemeChange />
              </Card>
              <Card
                label={"Sidebar type:"}
                description={"Choose between 2 different sidebar types."}
              >
                <button type="button" onClick={handleSidebar("v")}>
                  Vertical
                </button>
                <button type="button" onClick={handleSidebar("h")}>
                  Horizontal
                </button>
              </Card>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

const Card = ({ label, description, children }) => {
  return (
    <div className="p-2 border border-t-2 rounded-md border-t-primary border-gray-300">
      {label && <h4 className="font-bold text-xl">{label}</h4>}
      {description && <p>{description}</p>}
      {children}
    </div>
  );
};
