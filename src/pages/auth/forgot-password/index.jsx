import { Input } from "../../../components/inputs";
import { Button } from "../../../components/buttons";
import { CustomAuthLayout } from "../components/layout";
import { MetaTitle } from "../../../components/metaTitle";
import { DualHeadingTwo } from "../components/dualHeading/dualHeadingTwo";
import { CrossButton } from "../../../components/buttons/crossButton";

export const ForgotPassword = () => {
  return (
    <>
      <MetaTitle title={"Forget Password | Anarock"} />
      <CustomAuthLayout subContainerClassName={"max-w-[40rem]"}>
        <div className="relative w-full p-6 flex flex-col justify-center items-center">
          <DualHeadingTwo
            containerClassName={"text-center"}
            heading={"Forgot Password"}
            subHeading={"Enter Your Email id to receive OTP for verification."}
          />
          <CrossButton />
          <form className="w-full sm:w-[50%] mt-12 flex flex-col gap-2">
            <Input
              label={"Email Id"}
              placeholder={"Enter your email id"}
              type={"email"}
              infoContent={"Your email Id"}
            />
            <Button
              v1={true}
              type="submit"
              className={
                "font-bold w-full mt-4 mb-2 py-3 rounded-lg flex items-center justify-center"
              }
            >
              Continue
            </Button>
          </form>
        </div>
      </CustomAuthLayout>
    </>
  );
};
