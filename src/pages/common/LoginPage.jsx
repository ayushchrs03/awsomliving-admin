import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { MetaTitle } from "../../components/metaTitle";
import { Button } from "../../components/buttons/button";
import { signinValidator, otpValidator } from "../../validation/auth-validator";
import {
  compareOtp,
  loginUser,
  resendOtp,
} from "../../redux/actions/userAuth-action";
import { FiMail } from "react-icons/fi";
import { toast } from "react-hot-toast";
import Loading from "../../components/loader";
import { FaPencilAlt } from "react-icons/fa";

const LoginPage = () => {
  const dispatch = useDispatch();
  const { otpRequestId, loading, error } = useSelector((state) => state.auth);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isOtpMode, setIsOtpMode] = useState(false);
  const [authToken, setAuthToken] = useState("");
  const [loginEmail, setLoginEmail] = useState("");


  console.log(loading,"loadingloadingloading")
  console.log(isOtpMode);
  useEffect(() => {
    console.log(error, "error from login page");
  }, [error]);

  const inputRefs = useRef([]);

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    watch,
    setValue,
  } = useForm({
    resolver: isOtpMode ? yupResolver(otpValidator) : undefined,
    mode: "onChange",
    defaultValues: {},
  });

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      navigate("/dashboard", { replace: true });
    }
  }, [navigate]);

  const onSubmit = async (data) => {
    console.log("click click click");
    console.log(data);
    try {
      if (!isOtpMode) {
        const action = await dispatch(loginUser(data));
        if (action.meta.requestStatus === "fulfilled") {
          const token = action.payload?.token || action.payload?.data?.token;
          setAuthToken(token);
          setLoginEmail(data.email);
          setOtp(["", "", "", "", "", ""]);
          setIsOtpMode(true);
           toast.success(action?.payload?.message + " " + action?.payload?.data?.otp );
        }
      } else {
        const otpNumber = otp.join("");
        console.log("OTP:", otpNumber);
        
        const action = await dispatch(
          compareOtp({ otp: otpNumber })
        );

        if (action.meta.requestStatus === "fulfilled") {
          navigate("/dashboard");
        } else {
          console.error("OTP verification failed:", action.error);
        }
      }
    } catch (error) {
      console.error("Submission error:", error);
    }
  };

  const handleVerifyOtp = async () => {
    console.log("click click click");
    const otpNumber = otp.join("");
    console.log("OTP:", otpNumber);
    console.log("Token:", authToken);
    
    try {
      const action = await dispatch(
        compareOtp({ otp: otpNumber, token: authToken })
      );

      if (action.meta.requestStatus === "fulfilled") {
         toast.success(
        action?.payload?.message
      );
        navigate("/dashboard");
      } else {
        console.error("OTP verification failed:", action.error);
      }
    } catch (error) {
      console.error("Submission error:", error);
    }
  };

  const handleResendOtp = async () => {
  const email = watch("email");
  const action = await dispatch(resendOtp({ email }));
  if (action.meta.requestStatus === "fulfilled") {
    const token =
      action.payload?.data?.token || action.payload?.token;
      toast.success(action?.payload?.message + " " + action?.payload?.data?.otp );
    setAuthToken(token);
  }
};

useEffect(() => {
  if (isOtpMode && inputRefs.current[0]) {
    inputRefs.current[0].focus();
  }
}, [isOtpMode]);

  const handlePaste = (e) => {
    const paste = e.clipboardData.getData("text");
    if (/^\d{6}$/.test(paste)) {
      const newOtp = paste.split("");
      setOtp(newOtp);

      setTimeout(() => {
        newOtp.forEach((_, index) => {
          inputRefs.current[index].focus();
          inputRefs.current[index].blur();
        });

        inputRefs.current[5].focus(); 
      }, 0);
    }
    e.preventDefault();
  };

  const handleChange = (index, value) => {
    if (/^\d$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      if (value !== "" && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleBackspace = (index, e) => {
    if (e.key === "Backspace" && index >= 0) {
      const newOtp = [...otp];
      newOtp[index] = ""; 
      setOtp(newOtp);

      if (index > 0) {
        inputRefs.current[index - 1].focus();
      }
    }
  };
return (
  <>
    <MetaTitle title="AwesomeLiving" />
    {/* {loading && <Loading />} */}
 
    <div className="relative min-h-screen w-full overflow-hidden bg-white flex items-center justify-center px-4">
      
      <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-blue-400 rounded-full blur-[120px] opacity-25"></div>
      <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] bg-orange-400 rounded-full blur-[120px] opacity-25"></div>

      <div className="absolute top-6 left-6 z-20">
        <img
          src="/icons/ALlogo.png"
          alt="AwesomeLiving Logo"
          className="w-40 sm:w-[300px] object-contain"
        />
      </div>

      <div
        className="absolute bottom-0 left-0 w-full h-[75vh] bg-[#5B52C6]"
        style={{
          clipPath: "ellipse(75% 75% at 50% 100%)",
        }}
      ></div>

      <div className="relative z-10 w-full max-w-md">
        <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-xl border border-white/60 px-7 py-10">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900">
              {isOtpMode ? "Verify OTP" : "Welcome Back"}
            </h1>

            {isOtpMode ? (
              <div className="mt-3 space-y-2">
                <p className="text-sm text-gray-600">
                  Enter the 6-digit code sent to your email
                </p>
 
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-gray-100 border border-gray-200 text-gray-800 text-sm font-medium">
                  <span className="max-w-[220px] truncate">{loginEmail}</span>

                  <button
                    type="button"
                    onClick={() => {
                      setIsOtpMode(false);
                      setOtp(["", "", "", "", "", ""]);
                    }}
                    className="w-6 h-6 flex items-center justify-center rounded-md bg-white border border-gray-200 hover:bg-gray-50 transition"
                    title="Edit email"
                  >
                    <FaPencilAlt size={12} className="text-gray-700" />
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-600 mt-2">
                Sign in to your admin account
              </p>
            )}
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {!isOtpMode && (
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>

                    <div className="relative">
                      <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-lg" />

                      <input
                        {...field}
                        type="email"
                        placeholder="admin@example.com"
                        className="w-full pl-12 pr-4 py-3 rounded-xl bg-white border border-gray-200 text-gray-900 outline-none focus:ring-2 focus:ring-[#EF9421]/40 focus:border-[#EF9421] transition"
                      />
                    </div>
                  </div>
                )}
              />
            )}

            {isOtpMode && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3 text-center">
                  Enter OTP Code
                </label>

                <div className="flex justify-center gap-2 sm:gap-3">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      ref={(ref) => (inputRefs.current[index] = ref)}
                      value={digit}
                      maxLength="1"
                      onChange={(e) => handleChange(index, e.target.value)}
                      onKeyDown={(e) => handleBackspace(index, e)}
                      onPaste={index === 0 ? handlePaste : undefined}
                      className="w-11 h-12 sm:w-12 sm:h-12 rounded-xl border border-gray-200 bg-white text-center text-xl font-semibold text-gray-900 outline-none focus:ring-2 focus:ring-[#EF9421]/40 focus:border-[#EF9421] transition"
                    />
                  ))}
                </div>
              </div>
            )}

            {error && (
              <p className="text-sm text-red-500 text-center">{error}</p>
            )}

         <Button
  type={isOtpMode ? "button" : "submit"}
  onClick={!loading && isOtpMode ? handleVerifyOtp : undefined}
  disabled={
    loading ||
    (!isOtpMode && !watch("email")) ||
    (isOtpMode && otp.join("").length !== 6)
  }
  className={`w-full bg-[#EF9421] hover:bg-[#e18618] transition py-3 rounded-xl text-white font-semibold shadow-md ${
    loading ? "opacity-60 cursor-not-allowed" : ""
  }`}
>
  {loading
    ? isOtpMode
      ? "Verifying..."
      : "Sending OTP..."
    : isOtpMode
    ? "Verify OTP"
    : "Send OTP"}
</Button>


            {isOtpMode && (
              <div className="text-center">
                <button
                  type="button"
                  onClick={handleResendOtp}
                  className="text-sm font-medium text-gray-700 hover:text-[#EF9421] transition"
                >
                  Resend OTP
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  </>
);



};

export default LoginPage;