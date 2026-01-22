import { Link } from "react-router-dom";

export const NoInternet = ({ containerClassName, imageClassName }) => {
  return (
    <div
      className={`${containerClassName} dark:text-white px-2 w-full min-h-screen flex flex-col justify-center items-center text-center gap-4`}
    >
      <img
        className={`${imageClassName} w-96`}
        src={"/images/404-img.svg"}
        alt="404-image"
      />
      <h1 className="font-bold text-4xl !dark:text-white">Oh no. We lost this page</h1>
      <p className="!dark:text-white">
        We searched everywhere but couldn’t find what you’re looking for.
        <br /> Let’s find a better place for you to go.
      </p>
      <Link to={"/"} v2={true}>
        Back to Homepage
      </Link>
    </div>
  );
};
