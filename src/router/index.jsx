import App from "../App";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { ErrorComponent } from "../components/error";
import LoginPage from "../pages/common/LoginPage";
import { PrimaryLayout } from "../components/layout/primary";
import Dashboard from "../pages/dashboard";
import User from "../pages/users";
import Alhome from "../pages/alhome";
import Alerts from "../pages/alerts";
import Alertlog from "../pages/alert-log";
import Device from "../pages/devices";
import Resident from "../pages/resident-management";
import { AuthWrapper } from "./authWrapper";
import DeviceForm from "../pages/devices/DeviceForm";
import AlertForm from "../pages/alerts/AlertForm";
import UserForm from "../pages/users/userForm";
import ResidentForm from "../pages/resident-management/residentForm";
import HomeForm from "../pages/alhome/HomeForm";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorComponent />,
    children: [
      {
        path: "login",
        element: <LoginPage />,
      },
      {
        element: <AuthWrapper />,
        children: [
          {
            element: <PrimaryLayout />,
            children: [
              { index: true, element: <Dashboard /> },
              { path: "dashboard", element: <Dashboard /> },
        
              { path: "home", element: <Alhome /> },
              { path: "home/add", element: <HomeForm mode="add" /> },
              { path: "home/edit", element: <HomeForm mode="edit" /> },
              { path: "home/view", element: <HomeForm mode="view" /> },

              { path: "resident", element: <Resident />},
              { path: "resident/add", element: <ResidentForm mode="add" /> },
              { path: "resident/edit", element: <ResidentForm mode="edit" /> },
              { path: "resident/view", element: <ResidentForm mode="view" /> },
              
              { path: "user", element: <User /> },
              { path: "user/add", element: <UserForm mode="add" /> },
              { path: "user/edit", element: <UserForm mode="edit" /> },
              { path: "user/view", element: <UserForm mode="view" /> },

              { path: "devices", element: <Device /> },
              { path: "device/add", element: <DeviceForm mode="add" /> },
              { path: "device/edit", element: <DeviceForm mode="edit" /> },
              { path: "device/view", element: <DeviceForm mode="view" /> },

              { path: "alerts", element: <Alerts /> },
              { path: "alert/add", element: <AlertForm mode="add" /> },
              { path: "alert/edit", element: <AlertForm mode="edit" /> },
              { path: "alert/view", element: <AlertForm mode="view" /> },
              { path: "alert-logs", element: <Alertlog /> },
              { path: "*", element: <ErrorComponent /> },
            ],
          },
        ],
      },
    ],
  },
]);

export const RouterConfigration = () => {
  return <RouterProvider router={router} />;
};
