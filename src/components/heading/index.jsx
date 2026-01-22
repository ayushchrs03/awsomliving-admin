import { Link } from "react-router-dom";
import { CrossButton } from "../buttons/crossButton";
import { SVG } from "../svg";
// import { FaArdivLeftLong } from "react-icons/fa6";

export const Heading = ({ parent, mainTitle, className, sectionLink }) => {
  return (
    <div className="page-title py-[25px] flex flex-col items-start md:gap-2">
      <nav class="flex md:justify-start items-center" aria-label="breadcrumb">
        <ol class="breadcrumb flex flex-wrap items-center">
          <li class="breadcrumb-item font-semibold text-[#884EA7]">
            <Link to={`/dashboard`}>
              <img className="w-4" src="/icons/home-color.svg" alt="" />
              {/* <SVG iconId="Home" className="svg-divor" /> */}
            </Link>
          </li>
          <li class="breadcrumb-item !pl-[5px] sm:!text-base text-xs font-medium text-[#884EA7]">
            <Link to={sectionLink}>{parent}</Link>
          </li>
          <li class="active breadcrumb-item pl-[5px] text-black dark:text-white text-xs sm:!text-base font-medium">{mainTitle}</li>
        </ol>
      </nav>
      <h3 className={`${className} !text-2xl font-medium text-[#3D3D47] dark:text-white `}> {mainTitle}</h3>
    </div>
  );
};

export const PageHeading = ({ children, divClassName, className, disable }) => {
  return (
    <div className={`${divClassName} flex items-center gap-2 `}>
      {/* <CrossButton
        className={"p-0"}
        icon={<FaArdivLeftLong className="text-black" />}
        iconClassName={"text-xl"}
        disable={disable}
      /> */}
      <Heading className={className}>{children}</Heading>
    </div>
  );
};
