export const LeaseDetailShimmer = () => {
  return (
    <div className="my-4 flex flex-col gap-4">
      <div className="w-full h-full flex flex-col md:flex-row gap-4">
        <div className="md:w-[24.5%] bg-white dark:bg-slate-800 p-2">
          <div className="w-full h-5 flex justify-center items-center bg-gray-200 animate-pulse"></div>
        </div>
      </div>
      <div className="w-full h-full flex flex-col md:flex-row gap-4">
        <div className="w-full md:w-[25%] flex flex-col gap-4">
          <div className="min-h-20 bg-white dark:bg-slate-800 p-2 space-y-2">
            {Array.from({ length: 4 }, (_, i) => (
              <div
                className={`${
                  i == 0 ? "w-2/5" : i === 1 ? "w-2/4" : i === 2 ? "w-3/4" : ""
                } h-5 flex justify-center items-center bg-gray-200 animate-pulse`}
              ></div>
            ))}
          </div>
          <div className="min-h-60 bg-white dark:bg-slate-800 p-2 space-y-2">
            {Array.from({ length: 6 }, (_, i) => (
              <div className="w-full h-10 flex justify-center items-center bg-gray-200 animate-pulse"></div>
            ))}
          </div>
        </div>
        <div className="w-full md:w-[75%] flex flex-col gap-4">
          <div className="min-h-32 bg-white dark:bg-slate-800 p-2 space-y-2">
            {Array.from({ length: 1 }, (_, i) => (
              <div className="w-[24.2%] h-10 flex justify-center items-center bg-gray-200 animate-pulse"></div>
            ))}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
              {Array.from({ length: 8 }, (_, i) => (
                <div className="h-10 flex justify-center items-center bg-gray-200 animate-pulse"></div>
              ))}
            </div>
          </div>
          <div className="min-h-52 bg-white dark:bg-slate-800 p-2 space-y-2">
            {Array.from({ length: 1 }, (_, i) => (
              <div className="w-full h-6 flex justify-center items-center bg-gray-200 animate-pulse"></div>
            ))}
            {Array.from({ length: 4 }, (_, i) => (
              <div
                className={`${
                  i % 2 !== 0 ? "w-32" : "w-24"
                } h-10 flex justify-center items-center bg-gray-200 animate-pulse`}
              ></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
