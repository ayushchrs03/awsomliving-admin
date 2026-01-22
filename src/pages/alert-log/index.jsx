import React, { useState } from "react";
import DataTable from "../../components/table/dataTable";

export const headers = [
  { fieldName: "#", headerName: "#" },
  { fieldName: "userName", headerName: "User Name" },
  { fieldName: "home", headerName: "Home" },
  { fieldName: "resident", headerName: "Resident" },
  { fieldName: "emergencyName", headerName: "Emergency Contact Name" },
  { fieldName: "emergencyNumber", headerName: "Emergency Contact Number" },
  { fieldName: "alertMessage", headerName: "Alert Message" },
  { fieldName: "alertType", headerName: "Alert Type" },
  { fieldName: "alertStatus", headerName: "Alert Status" },
  { fieldName: "", headerName: "Action" }
];

const tableData = [
  {
    id: 1,
    userName: "Ramesh Kumar",
    home: "Green Villa",
    resident: "Self",
    emergencyName: "Suresh Kumar",
    emergencyNumber: "9876543210",
    alertMessage: "Fall detected in living room",
    alertType: "Emergency",
    alertStatus: "Active"
  },
  {
    id: 2,
    userName: "Anita Sharma",
    home: "Sunrise Apartments",
    resident: "Mother",
    emergencyName: "Rahul Sharma",
    emergencyNumber: "9123456789",
    alertMessage: "No movement detected for 6 hours",
    alertType: "Warning",
    alertStatus: "Inactive"
  },
  {
    id: 3,
    userName: "Vijay Singh",
    home: "Palm Residency",
    resident: "Father",
    emergencyName: "Neha Singh",
    emergencyNumber: "9988776655",
    alertMessage: "Heart rate above safe limit",
    alertType: "Health",
    alertStatus: "Active"
  },
  {
    id: 4,
    userName: "Priya Mehta",
    home: "Lake View Homes",
    resident: "Grandmother",
    emergencyName: "Amit Mehta",
    emergencyNumber: "9090909090",
    alertMessage: "Oxygen level dropped below 90%",
    alertType: "Critical",
    alertStatus: "Active"
  }
];


function Index() {
  
  return (
    <DataTable
      loading={false}
      headers={headers}
      data={tableData}
      statusToggle={true}
      showAddButton={false}
      title="Alert Tracker"
       showActionType="resolve"
    />
  );
}

export default Index;
