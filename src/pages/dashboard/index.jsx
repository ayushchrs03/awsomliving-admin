import React, { useState, useRef, useEffect } from "react";
import { FaUsers, FaHome, FaMicrochip, FaBell } from "react-icons/fa";
import SetupWizardModal from "../../components/stepForm";
import StatCard from "../../components/statCard";
import UserFunnelPage from "./charts/userFunnel";
import { UserModule } from "./charts/userAnalytics";
import { HomeModule } from "./charts/homeAnalytics";
import { ResidentModule } from "./charts/residentAnalytics";
import { DeviceModule } from "./charts/deviceAnalytics";
import { AlertModule } from "./charts/alertAnalytics";
import { AlertLogModule } from "./charts/alertLogAnalytics";
import client from "../../redux/axios-baseurl";
import { useCallback } from "react";

function useInViewLogger(componentName, apiFunction) {
  const ref = useRef(null);
  const hasLogged = useRef(false);

  useEffect(() => {
    if (!ref.current || !apiFunction) return;

    const observer = new IntersectionObserver(
      async ([entry]) => {
        if (entry.isIntersecting && !hasLogged.current) {
          console.log(`✅ Now viewing: ${componentName}`);

          hasLogged.current = true; 
          await apiFunction();
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(ref.current);

    return () => observer.disconnect();
  }, [componentName, apiFunction]);

  return ref;
}

function Dashboard() {
  const stats = [
    {
      label: "Total Users",
      value: "12,500",
      change: "↑ 12.5%",
      icon: FaUsers,
      bg: "bg-green-100",
      border: "border-green-200",
      iconBg: "bg-green-50",
      iconColor: "text-green-600",
      changeColor: "text-green-600",
    },
    {
      label: "Total Homes",
      value: "1,820",
      change: "↑ 8.2%",
      icon: FaHome,
      bg: "bg-blue-100",
      border: "border-blue-200",
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
      changeColor: "text-blue-600",
    },
    {
      label: "Total Devices",
      value: "5,340",
      change: "↓ 3.1%",
      icon: FaMicrochip,
      bg: "bg-purple-100",
      border: "border-purple-200",
      iconBg: "bg-purple-50",
      iconColor: "text-purple-600",
      changeColor: "text-red-600",
    },
    {
      label: "Active Alerts",
      value: "12",
      change: "↑ 1.4%",
      icon: FaBell,
      bg: "bg-orange-100",
      border: "border-orange-200",
      iconBg: "bg-orange-50",
      iconColor: "text-orange-600",
      changeColor: "text-green-600",
    },
    {
      label: "Daily Active Users",
      value: "12,500",
      change: "↑ 12.5%",
      icon: FaUsers,
      bg: "bg-green-100",
      border: "border-green-200",
      iconBg: "bg-green-50",
      iconColor: "text-green-600",
      changeColor: "text-green-600",
    },
    {
      label: "Active Residents",
      value: "1,820",
      change: "↑ 8.2%",
      icon: FaHome,
      bg: "bg-blue-100",
      border: "border-blue-200",
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
      changeColor: "text-blue-600",
    },
    {
      label: "Avg Session Duration",
      value: "12",
      change: "↑ 1.4%",
      icon: FaBell,
      bg: "bg-orange-100",
      border: "border-orange-200",
      iconBg: "bg-orange-50",
      iconColor: "text-orange-600",
      changeColor: "text-green-600",
    },
  ];

    const [open, setOpen] = useState(false);
    const [funnelData, setFunnelData] = useState([]);
    const [userGrowthData, setUserGrowthData] = useState([]);
    const [activeInactiveData, setActiveInactiveData] = useState([]);
    const [noResidentData, setNoResidentData] = useState([]);
    const [onlineOfflineData, setOnlineOfflineData] = useState([]);
    const [ackResolvedTrend, setAckResolvedTrend] = useState([]);

const runUserFunnelPageApi = async () => {
  try {
    console.log("Running UserFunnelPage API...");
    const { data } = await client.get("user/funnel-dropoff");
    console.log("UserFunnelPage API Response:", data);
    setFunnelData(data.data);
    return data;
  } catch (error) {
    console.error("UserFunnelPage API Error:", error);
  }
};

 const runUserModuleApi = useCallback(async () => {
  try {
    const [monthlyRes, activeInactiveRes, noResidentRes] =
      await Promise.all([
        client.get("user/get_monthly_user_growth"),
        client.get("user/active-inactive"),
        client.get("user/get_last_7_days_user_growth"),
      ]);

    setUserGrowthData(
      monthlyRes.data.data.map(item => ({
        date: `${item.month} ${item.year}`,
        users: item.users,
      }))
    );

    setActiveInactiveData(activeInactiveRes.data.data);
    setNoResidentData(noResidentRes.data.data);
  } catch (error) {
    console.error(error);
  }
}, []);

const runHomeModuleApi = async () => {
  try {
    console.log("Running HomeModule API...");
    const { data } = await client.get("/homes");
    console.log("HomeModule API Response:", data);
    return data;
  } catch (error) {
    console.error("HomeModule API Error:", error);
  }
};


const runResidentModuleApi = async () => {
  try {
    console.log("Running ResidentModule API...");
    const { data } = await client.get("/residents");
    console.log("ResidentModule API Response:", data);
    return data;
  } catch (error) {
    console.error("ResidentModule API Error:", error);
  }
};
const runDeviceModuleApi = async () => {
  try {
    console.log("Running DeviceModule API...");

    const { data } = await client.get(
      "user/get_online_offline_users_count"
    );

    const formatted = data?.data?.map(item => ({
      name: item.name,
      value: item.count,
      color: item.name === "Online" ? "#EF9A2F" : "#ef4444",
    }));

    setOnlineOfflineData(formatted);

    return data;
  } catch (error) {
    console.error("DeviceModule API Error:", error);
  }
};




const runAlertModuleApi = async () => {
  try {
    console.log("Running AlertModule API...");
    const { data } = await client.get("/alerts");
    console.log("AlertModule API Response:", data);
    return data;
  } catch (error) {
    console.error("AlertModule API Error:", error);
  }
};


const runAlertLogModuleApi = async () => {
  try {
    console.log("Running AlertLogModule API...");
    const { data } = await client.get("/alert-logs");
    console.log("AlertLogModule API Response:", data);
    return data;
  } catch (error) {
    console.error("AlertLogModule API Error:", error);
  }
};


  const funnelRef = useInViewLogger("UserFunnelPage", runUserFunnelPageApi);
  const userModuleRef = useInViewLogger("UserModule", runUserModuleApi);
  const homeModuleRef = useInViewLogger("HomeModule", runHomeModuleApi);
  const residentModuleRef = useInViewLogger("ResidentModule", runResidentModuleApi);
  const deviceModuleRef = useInViewLogger("DeviceModule", runDeviceModuleApi);
  const alertModuleRef = useInViewLogger("AlertModule", runAlertModuleApi);
  const alertLogModuleRef = useInViewLogger("AlertLogModule", runAlertLogModuleApi);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-2">
        <h1 className="text-xl sm:text-2xl font-semibold">Dashboard</h1>

        <button
          className="flex items-center justify-center gap-2 bg-[#EF9421] text-white px-5 py-2 rounded-md hover:bg-orange-400 w-full sm:w-auto"
          onClick={() => setOpen(true)}
        >
          <span className="text-lg">+</span>
          Quick Setup
        </button>
      </div>

      <div className="pt-4 overflow-x-auto scrollbar-hide">
        <div className="flex gap-4 w-max pb-2 snap-x snap-mandatory">
          {stats.map((item, index) => (
            <div key={index} className="snap-start shrink-0 gap-4">
              <StatCard {...item} />
            </div>
          ))}
        </div>
      </div>
      <div ref={funnelRef}>
        <UserFunnelPage data={funnelData}  />
      </div>
      <div ref={userModuleRef}>
       <UserModule
    userGrowthData={userGrowthData}
    activeInactiveData={activeInactiveData}
    noResidentData={noResidentData}
  />
      </div>
      <div ref={homeModuleRef}>
        <HomeModule />
      </div>
      <div ref={residentModuleRef}>
        <ResidentModule />
      </div>
      <div ref={deviceModuleRef}>
  <DeviceModule onlineOfflineData={onlineOfflineData} />
      </div>
      <div ref={alertModuleRef}>
        <AlertModule />
      </div>
      <div ref={alertLogModuleRef}>
        <AlertLogModule />
      </div>
       {open && <SetupWizardModal onClose={() => setOpen(false)} />}
    </div>
  );
}

export default Dashboard;
