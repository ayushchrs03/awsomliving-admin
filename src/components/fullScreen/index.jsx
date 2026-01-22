import { RxEnterFullScreen } from "react-icons/rx";
import { iconSize } from "../../utils";
import { IconWrapper } from "../wrappers/icon-wrapper";

export const FullScreenButton = () => {
  const handleFullscreen = () => {
    // Check if the document is already in fullscreen mode
    if (!document.fullscreenElement) {
      // Enter fullscreen mode
      document.documentElement.requestFullscreen().catch((err) => {
        console.error("Error attempting to enable fullscreen mode:", err);
      });
    } else {
      // Exit fullscreen mode
      document.exitFullscreen().catch((err) => {
        console.error("Error attempting to exit fullscreen mode:", err);
      });
    }
  };

  return (
    <IconWrapper className={"cursor-pointer"} onClick={handleFullscreen}>
      <button className="header-icon">
        {document.fullscreenElement ? (
          <RxEnterFullScreen size={iconSize} />
        ) : (
          <RxEnterFullScreen size={iconSize} />
        )}
      </button>
    </IconWrapper>
  );
};
