import { BadgeWrapper } from "../icon-wrapper";

export const CardWrapper = ({ title, children, className, titleClassName }) => {
  return (
    <div
      class={`${
        className && className
      } break-inside-avoid  !mb-[24px] border-2 border-[#F4F5F8] !rounded-[5px] shadow-[0_3px_18px_rgb(244_245_248)] relative flex flex-col min-w-0 !bg-white dark:bg-gray-800 p-4`}
    >
      {title && (
        <p
          class={`${titleClassName} dark:text-gray-200 font-semibold text-lg mb-4 transition-all duration-300`}
        >
          {title}
        </p>
      )}
      <div class="!text-[#6C6C6C] dark:text-gray-300">{children}</div>
    </div>
  );
};

export const CardWrapperChild = ({ title, children, className }) => {
  return (
    <div
      class={`${
        className && className
      } mb-4 break-inside-avoid card-child bg-white dark:bg-slate-800 p-4`}
    >
      {title && (
        <p class="dark:text-gray-200 font-semibold text-lg mb-4">{title}</p>
      )}
      <div class="text-[#6C6C6C] dark:text-gray-300">{children}</div>
    </div>
  );
};
