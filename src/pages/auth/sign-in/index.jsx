import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Input } from "../../../components/inputs";
import { Button } from "../../../components/buttons";
import { Heading } from "../../../components/heading";
import { MetaTitle } from "../../../components/metaTitle";
import { signinValidator } from "../../../validation/auth-validator";
import { yupResolver } from "@hookform/resolvers/yup";

export const SignIn = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    trigger,
  } = useForm({
    resolver: yupResolver(signinValidator), // Use yupResolver to integrate Yup validation
    mode: "onBlur", // Validate on change
  });

  // Trigger validation onBlur
  const handleBlur = async (field) => {
    await trigger(field);
  };

  return (
    <>
      <MetaTitle title={"Sign in | Anarock"} />
      <section className="w-full min-h-screen flex items-center">
        <div className="hidden md:flex flex-col items-center gap-4 w-full md:w-2/6">
          <img className="w-52" src="/anarock.svg" alt="" />
          <h1 className="font-bold text-2xl">Welcome back!</h1>
          <img className="w-52" src="/auth/sign-in.svg" alt="" />
        </div>
        <div className="w-full md:w-4/6 h-screen bg-[#EFEFF3] flex justify-center items-center">
          <div className="w-[20rem] flex flex-col gap-4">
            <Heading>Sign in</Heading>
            <form
              onSubmit={handleSubmit()}
              className="flex flex-col gap-1"
            >
              <Input
                {...register("email", {
                  required: "Email Address is required",
                })}
                label={"Email"}
                type={"email"}
                placeholder={"Enter your email e.g. johndoe@gmail.com"}
                errorContent={errors.email}
                onBlur={() => handleBlur("email")}
              />
              <Input
                {...register("password", {
                  required: "Password is required",
                })}
                label={"Password"}
                type={"password"}
                placeholder={"Enter your password e.g. Johndoe@564"}
                errorContent={errors.password}
                onBlur={() => handleBlur("password")}
              />
              <Link
                to={"/forgot-password"}
                className="text-right text-sm hover:text-primary"
              >
                Forgot Password?
              </Link>
              <Button
                type={"submit"}
                v2={true}
                className={"mt-2 py-2 w-full rounded-lg"}
              >
                Submit
              </Button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
};
