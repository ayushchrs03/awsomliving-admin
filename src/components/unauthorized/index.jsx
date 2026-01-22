export const Unauthorized = (containerClassName, imageClassName) => {
  return (
    <div
      className={`${containerClassName} fixed inset-0 size-full px-4 bg-white dark:bg-slate-800 flex flex-col justify-center items-center text-center gap-6`}
    >
      <img
        className={`${imageClassName} w-80`}
        src={"/no-data-img.svg"}
        alt="No data available"
      />
      <div>
        {" "}
        <h1 className="font-extrabold text-3xl  text-gray-600">
          🚫 Unauthorized Access
        </h1>
        <p className="text-lg text-gray-500">
          You do not have permission to view this page.
        </p>
      </div>
      {/* <Link to={"/"} className="mt-4 text-primaryText hover:underline">
        Back to Homepage
      </Link> */}
    </div>
  );
};
