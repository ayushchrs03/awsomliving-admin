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
import DashboardSkeleton from "./dashboardSkeleton";

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
 
  const STAT_UI_CONFIG = {
  "Total Users": {
    icon: FaUsers,
    bg: "bg-green-100",
    border: "border-green-200",
    iconBg: "bg-green-50",
    iconColor: "text-green-600",
    changeColor: "text-green-600",
  },
  "Total Homes": {
    icon: FaHome,
    bg: "bg-blue-100",
    border: "border-blue-200",
    iconBg: "bg-blue-50",
    iconColor: "text-blue-600",
    changeColor: "text-blue-600",
  },
  "Total Devices": {
    icon: FaMicrochip,
    bg: "bg-purple-100",
    border: "border-purple-200",
    iconBg: "bg-purple-50",
    iconColor: "text-purple-600",
    changeColor: "text-green-600",
  },
  "Active Alerts": {
    icon: FaBell,
    bg: "bg-orange-100",
    border: "border-orange-200",
    iconBg: "bg-orange-50",
    iconColor: "text-orange-600",
    changeColor: "text-green-600",
  },
  "Active Residents": {
    icon: FaHome,
    bg: "bg-blue-100",
    border: "border-blue-200",
    iconBg: "bg-blue-50",
    iconColor: "text-blue-600",
    changeColor: "text-green-600",
  },
  "Daily Active Users": {
    icon: FaUsers,
    bg: "bg-green-100",
    border: "border-green-200",
    iconBg: "bg-green-50",
    iconColor: "text-green-600",
    changeColor: "text-gray-400",
  },
  "Conversion Rate": {
    icon: FaUsers,
    bg: "bg-indigo-100",
    border: "border-indigo-200",
    iconBg: "bg-indigo-50",
    iconColor: "text-indigo-600",
    changeColor: "text-gray-400",
  },
  "Avg Session Duration": {
    icon: FaBell,
    bg: "bg-orange-100",
    border: "border-orange-200",
    iconBg: "bg-orange-50",
    iconColor: "text-orange-600",
    changeColor: "text-gray-400",
  },
};


    const [open, setOpen] = useState(false);
    const [funnelData, setFunnelData] = useState([]);
    const [userGrowthData, setUserGrowthData] = useState([]);
    const [activeInactiveData, setActiveInactiveData] = useState([]);
    const [noResidentData, setNoResidentData] = useState([]);
    const [onlineOfflineData, setOnlineOfflineData] = useState([]);
    const [ackResolvedTrend, setAckResolvedTrend] = useState([]);
    const [stats, setStats] = useState([]);
    const [responseTimeData, setResponseTimeData] = useState([]);
    const [residentPerHomeData, setResidentPerHomeData] = useState([]);
    const [ageGroupData, setAgeGroupData] = useState([]);
    const [rulesByType, setRulesByType] = useState([]);
    const [rulesByStatus, setRulesByStatus] = useState([]);
    const [homeGrowthData, setHomeGrowthData] = useState([]);
    const [activeInactiveHomes, setActiveInactiveHomes] = useState([]);
const [statsLoading, setStatsLoading] = useState(true);
const runDashboardStatsApi = async () => {
  try {
    setStatsLoading(true);

    const { data } = await client.get("dashboard/get-count");

    const formatted = data.data.map(item => ({
      label: item.label,
      value: item.value,
      change: item.change,
      ...STAT_UI_CONFIG[item.label],
    }));

    setStats(formatted);
  } catch (error) {
    console.error("Dashboard stats API error:", error);
  } finally {
    setStatsLoading(false);
  }
};



const runUserFunnelPageApi = async () => {
  try {
    console.log("Running UserFunnelPage API...");
    const { data } = await client.get("user/funnel-dropoff");
    console.log("UserFunnelPage API Response:", data);
    setFunnelData(data.data);
    runUserModuleApi()
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

    const [growthRes, statusRes] = await Promise.all([
      client.get("home/monthly-home-growth"),
      client.get("home/active-inactive-homes-count"),
    ]);

    setHomeGrowthData(
      growthRes.data.data.map(item => ({
        date: `${item.month} ${item.year}`,
        users: item.homes,  
      }))
    );

    setActiveInactiveHomes(
      statusRes.data.data.map(item => ({
        name:
          item.name === "active" ? "Active" : "Inactive",
        value: item.value,
        color: item.name === "active" ? "#22c55e" : "orange",
      }))
    );

    return true;
  } catch (error) {
    console.error("HomeModule API Error:", error);
  }
};


const runResidentModuleApi = async () => {
  try {
    console.log("Running ResidentModule API...");

    const { data } = await client.get("dashboard/resident-analytics");

    setResidentPerHomeData(
      data.data.resident_per_home_data.map(item => ({
        range: item.range,
        count: item.count,
        color:
          item.range === "1" ? "#3b82f6" :
          item.range === "2" ? "#22c55e" :
          item.range === "3" ? "#f59e0b" :
          item.range === "4" ? "#a855f7" :
          "#ef4444",
      }))
    );

    setAgeGroupData(
      data.data.age_group_data.map(item => ({
        age: item.age,
        count: item.count,
        color:
          item.age === "18-59" ? "#0ea5e9" :
          item.age === "60-65" ? "#22c55e" :
          item.age === "66-70" ? "#22c55e" :
          item.age === "71-75" ? "#6366f1" :
          item.age === "76-80" ? "#f97316" :
          item.age === "81-85" ? "#a855f7" :
          "#ef4444",
      }))
    );

    return true;
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

    const { data } = await client.get(
      "dashboard/alert-analytics"
    );

    setRulesByType(
      data.data.rules_by_type.map((item, index) => ({
        type: item.type,
        count: item.count,
        color: [
          "#3b82f6",
          "#22c55e",
          "#f59e0b",
          "#a855f7",
          "#ef4444",
          "#0ea5e9",
          "#6366f1",
        ][index % 7],
      }))
    );

    setRulesByStatus(
      data.data.rules_by_status.map(item => ({
        name: item.name,
        value: item.value,
        color: item.name === "Active" ? "#22c55e" : "orange",
      }))
    );

    return true;
  } catch (error) {
    console.error("AlertModule API Error:", error);
  }
};


const runAlertLogModuleApi = async () => {
  try {
    console.log("Running AlertLogModule API...");

    const [ackRes, responseTimeRes] = await Promise.all([
      client.get("alert-logs/ack-resolved-trend"),
      client.get("alert-logs/response-time"),
    ]);

    setAckResolvedTrend(
      ackRes.data.data.map(item => ({
        date: item.date,
        acknowledged: item.acknowledged,
        resolved: item.resolved,
      }))
    );

    setResponseTimeData(
      responseTimeRes.data.data.map(item => ({
        range: item.range,
        count: item.count,
        color:
          item.range === "<5 min" ? "#22c55e" :
          item.range === "5-15 min" ? "#84cc16" :
          item.range === "15-30 min" ? "#f59e0b" :
          item.range === "30-60 min" ? "#f97316" :
          "#ef4444",
      }))
    );

    return true;
  } catch (error) {
    console.error("AlertLogModule API Error:", error);
  }
};



useEffect(() => {
  runDashboardStatsApi();
}, []);

  const funnelRef = useInViewLogger("UserFunnelPage", runUserFunnelPageApi);
  const userModuleRef = useInViewLogger("UserModule", runUserModuleApi);
  const homeModuleRef = useInViewLogger("HomeModule", runHomeModuleApi);
  const residentModuleRef = useInViewLogger("ResidentModule", runResidentModuleApi);
  const deviceModuleRef = useInViewLogger("DeviceModule", runDeviceModuleApi);
  const alertModuleRef = useInViewLogger("AlertModule", runAlertModuleApi);
  const alertLogModuleRef = useInViewLogger("AlertLogModule", runAlertLogModuleApi);


    return (
  <>
    {statsLoading ? (
      <DashboardSkeleton />
    ) : (
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
       <HomeModule
  homeGrowthData={homeGrowthData}
  activeInactiveData={activeInactiveHomes}
/>
      </div>
      <div ref={residentModuleRef}>
        <ResidentModule 
          residentPerHomeData={residentPerHomeData}
  ageGroupData={ageGroupData}/>
      </div>
      <div ref={deviceModuleRef}>
  <DeviceModule onlineOfflineData={onlineOfflineData} />
      </div>
      <div ref={alertModuleRef}>
       <AlertModule
  rulesByType={rulesByType}
  rulesByStatus={rulesByStatus}
/>
      </div>
      <div ref={alertLogModuleRef}>
        <AlertLogModule ackResolvedTrend={ackResolvedTrend}
  responseTimeData={responseTimeData} />
      </div>
       {open && <SetupWizardModal onClose={() => setOpen(false)} />}
    </div>
    )}
  </>
);

}

export default Dashboard;
