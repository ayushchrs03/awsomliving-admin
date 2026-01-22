import { MetaTitle } from "../../components/metaTitle";
import { Home } from "../home";


const HomePage = () => {
  return (
    <>
      <MetaTitle title={"Home | Anarock"} />
      {/* <div className="dark:text-white ">HomePage</div> */}
      <Home />
    </>
  );
};

export default HomePage;
