import React from "react";
import { FaSpinner } from "react-icons/fa";

const Loading = ({
  size = "text-6xl",
  color = "text-white",
  overlay = true,
}) => {
  return (
    <div
      className={`fixed inset-0 flex items-center justify-center z-[99999] ${
        overlay
          ? "before:content-[''] before:absolute before:inset-0 before:bg-black before:opacity-50 before:z-[-1]"
          : ""
      }`}
    >
      <FaSpinner className={`animate-spin ${size} ${color}`} />
    </div>
  );
};

export default Loading;
