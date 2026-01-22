export const FormWrapper = ({header, children, containerClassName, ...props }) => {
  return (
    <div
      {...props}
      className={`${
        containerClassName && containerClassName
      } !mb-[24px] border-2 border-[#F4F5F8] !rounded-[5px] shadow-[0_3px_18px_rgb(244_245_248)] relative flex flex-col min-w-0 !bg-white dark:bg-gray-800`}
    >
      {header && <div className="card-header">{header}</div>}
      <div className="card-body p-[18px]">{children}</div>
    </div>
  );
};
