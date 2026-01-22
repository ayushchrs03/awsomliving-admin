import { RxCross2 } from "react-icons/rx";
import { Link } from "react-router-dom";
import { useRef, useState } from "react";
import { useOutsideClick } from "../../functions";
import { IoMdNotificationsOutline } from "react-icons/io";

import { iconSize } from "../../utils";
import { IconWrapper } from "../wrappers/icon-wrapper";
import { motion, AnimatePresence } from "framer-motion";

export const Notification = ({ closeButton }) => {
  const [notification, setNotification] = useState(false);
  const [read, setRead] = useState("");
  const [markAsReadClicked, setMarkAsReadClicked] = useState(false);

  const notificationData = [
    { notificationTitle: "sdfasd", notification: "dsafasd", is_read: 0 },
  ];

  const handleMarkAsRead = () => {};

  // Outside click

  const notificationPopupRef = useRef();
  const handleNotification = () => {
    setNotification(!notification);
  };
  useOutsideClick(notificationPopupRef, handleNotification);

  return (
    <>
      <IconWrapper className={"cursor-pointer"} onClick={handleNotification}>
        <button className="header-icon">
          <IoMdNotificationsOutline size={iconSize} className="text-xl" />
        </button>
      </IconWrapper>
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            ref={notificationPopupRef}
            className={`absolute right-0 lg:right-40 top-12 z-10 md:min-w-[20rem] max-w-[20rem] max-h-[80vh] bg-gray-50 border rounded-lg shadow divide-y divide-gray-100 dark:divide-gray-600`}
          >
            <div className="px-2 py-3">
              <div className="flex justify-between">
                <h1 className="text-base sm:text-lg md:text-xl lg:text-2xl font-semibold">
                  Notifications
                </h1>
                <button onClick={handleNotification}>
                  <RxCross2 className="font-bold text-xl" />
                </button>
              </div>
            </div>
            {notificationData?.slice(0, 3)?.map((data, i) => {
              return (
                <div
                  className={`${
                    data.is_read === 0 ? "bg-[#e3e2e2] text-white" : ""
                  } p-2 border-t`}
                  key={i}
                >
                  <div className="flex justify-between items-center">
                    <h1
                      className={`text-lg text-gray-950 ${
                        data.is_read === 0 ? "text-black" : "dark:text-gray-300"
                      }`}
                    >
                      {data.notificationTitle}
                    </h1>
                    {/* <span className="w-2 h-2 rounded-full bg-[#FBB03B]"></span> */}
                  </div>
                  <p
                    className={`text-xs text-gray-950  ${
                      data.is_read === 0 ? "text-white" : "dark:text-gray-500"
                    }`}
                  >
                    {data.notification}
                  </p>
                  <div className="py-2 flex justify-between">
                    <p className="font-normal text-xs text-[#888]">
                      {data.updated_at}
                    </p>
                    {data.is_read === 0 ? (
                      <span className="w-2 h-2 rounded-full bg-[#FBB03B]"></span>
                    ) : (
                      <></>
                    )}
                  </div>
                </div>
              );
            })}
            {notificationData?.length === 0 ? (
              <div className="bg-[#FFF3E0] p-2">
                <div className="flex justify-between items-center">
                  <h1 className="font-bold text-xl dark:text-black">
                    Hi {"Mehul"},
                  </h1>
                </div>
                <p className="text-sm  dark:text-black">Welcome to Anarock!</p>
                <div className="py-2 flex justify-between">
                  <p className="font-normal text-xs text-[#888]"></p>
                  <p className="font-normal text-xs text-[#888]"></p>
                </div>
              </div>
            ) : (
              <div className="p-2 flex justify-between gap-4 font-smibold text-sm bg-primary text-white">
                <div className="flex justify-center items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="15"
                    height="15"
                    viewBox="0 0 15 15"
                    fill="none"
                  >
                    <path
                      d="M5.00032 9.84457C4.8938 9.84467 4.79044 9.80839 4.70735 9.74173L1.58235 7.24173C1.53387 7.2034 1.49344 7.15587 1.4634 7.10186C1.43336 7.04785 1.4143 6.98843 1.40731 6.92703C1.40031 6.86562 1.40554 6.80344 1.42267 6.74406C1.4398 6.68468 1.46851 6.62927 1.50713 6.58103C1.54576 6.53278 1.59355 6.49266 1.64774 6.46295C1.70194 6.43324 1.76147 6.41455 1.82292 6.40794C1.88437 6.40133 1.94652 6.40694 2.00579 6.42444C2.06506 6.44194 2.12029 6.47099 2.16829 6.50992L4.9521 8.73707L12.1561 0.93283C12.1978 0.887432 12.2481 0.850709 12.304 0.824765C12.3599 0.798822 12.4204 0.784168 12.482 0.781643C12.5436 0.779118 12.6051 0.788772 12.6629 0.810051C12.7208 0.83133 12.7739 0.863816 12.8192 0.905649C12.8645 0.947481 12.9011 0.997838 12.9268 1.05383C12.9526 1.10983 12.9671 1.17036 12.9695 1.23197C12.9718 1.29357 12.962 1.35504 12.9406 1.41284C12.9191 1.47064 12.8865 1.52365 12.8446 1.56882L5.34456 9.69382C5.30077 9.74145 5.24756 9.77945 5.1883 9.8054C5.12903 9.83135 5.06502 9.84469 5.00032 9.84457ZM6.25032 14.2196C6.1438 14.2197 6.04044 14.1834 5.95735 14.1167L2.83235 11.6167C2.78387 11.5784 2.74344 11.5309 2.7134 11.4769C2.68336 11.4228 2.6643 11.3634 2.65731 11.302C2.65031 11.2406 2.65554 11.1784 2.67267 11.1191C2.6898 11.0597 2.71851 11.0043 2.75713 10.956C2.79576 10.9078 2.84355 10.8677 2.89774 10.8379C2.95194 10.8082 3.01147 10.7895 3.07292 10.7829C3.13437 10.7763 3.19652 10.7819 3.25579 10.7994C3.31506 10.8169 3.37029 10.846 3.41829 10.8849L6.21553 13.1228L12.7939 6.5444C12.8819 6.45704 13.001 6.40811 13.125 6.40833C13.249 6.40856 13.3678 6.45792 13.4555 6.54561C13.5432 6.6333 13.5926 6.75217 13.5928 6.87618C13.593 7.00019 13.5441 7.11923 13.4567 7.20724L6.58174 14.0822C6.53824 14.1258 6.48657 14.1603 6.42971 14.1839C6.37284 14.2075 6.31188 14.2196 6.25032 14.2196Z"
                      fill="#fff"
                    />
                  </svg>
                  <button className="text-sm" onClick={handleMarkAsRead}>
                    Mark as read
                  </button>
                </div>
                <Link
                  className="text-sm"
                  onClick={closeButton}
                  to={`notifications`}
                >
                  View All Notification
                </Link>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};