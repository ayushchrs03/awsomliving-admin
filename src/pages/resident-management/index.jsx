import React, { useEffect } from "react";
import DataTable from "../../components/table/dataTable";
import {
  getResidentDetails,
  updateResidentStatus,
} from "../../redux/actions/resident-action";
import { resetResidentList } from "../../redux/slices/residentSlice";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";

export const headers = [
  { fieldName: "#", headerName: "#" },
  { fieldName: "name", headerName: "Resident Name" },
  { fieldName: "home", headerName: "Home" },
  { fieldName: "device", headerName: "Device Serial No" },
  { fieldName: "devicename", headerName: "Device" },
  { fieldName: "emergencyName", headerName: "Emergency Contact Name" },
  { fieldName: "emergencyNumber", headerName: "Emergency Contact Number" },
  { fieldName: "status", headerName: "Status" },
  { fieldName: "", headerName: "Action" },
];

function Resident() {
  const dispatch = useDispatch();

  const { data, loading, hasNextPage, nextCursor } = useSelector(
    (state) => state.resident
  );

  useEffect(() => {
    dispatch(getResidentDetails({ limit: 10 }));

    return () => {
      dispatch(resetResidentList());
    };
  }, [dispatch]);

  const residents = Array.isArray(data) ? data : [];

  const tableData = residents.map((item, index) => ({
    _id: item._id,
    "#": index + 1,
    name: item.name,
    home: item.home?.name || "-",
    device: item.device?.sr_num || "-",
    devicename: item.resident?.type || "-",
    emergencyName: item.emergency_con_name || "-",
    emergencyNumber: item.emergency_con_num || "-",
    status: item.status === "active",
  }));

 const handleStatusToggle = async (id, currentStatus) => {
  try {
    await dispatch(
      updateResidentStatus({
        id,
        status: currentStatus ? "inactive" : "active",
      })
    ).unwrap();

    toast.success(
      `Resident ${currentStatus ? "deactivated" : "activated"} successfully`
    );
  } catch (error) {
    toast.error(
      error?.message || "Failed to update resident status"
    );
  }
};

  const handleLoadMore = () => {
    if (!loading && hasNextPage) {
      dispatch(
        getResidentDetails({
          limit: 10,
          cursor: nextCursor,
        })
      );
    }
  };

  return (
    <DataTable
      loading={loading}
      headers={headers}
      data={tableData}
      onStatusToggle={handleStatusToggle}
      statusToggle
      title="Resident Listing"
      addButtonLabel="Add Resident"
      addLink="/resident/add"
      editLink="/resident/edit"
      viewLink="/resident/view"
      showLoadMore
      hasNextPage={hasNextPage}
      onLoadMore={handleLoadMore}
    />
  );
}

export default Resident;
