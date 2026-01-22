import { lazy } from "react";

// Lazy load each page
const SignIn = lazy(() => import("./auth/sign-in"));
const Verify = lazy(() => import("./auth/verify"));
const ForgotPassword = lazy(() => import("./auth/forgot-password"));
const ChangePassword = lazy(() => import("./auth/change-password"));
const Dashboard = lazy(() => import("./dashboard"));

// Export each page as default export
export { SignIn, Verify, Dashboard, ForgotPassword, ChangePassword };