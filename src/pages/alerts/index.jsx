import React, { useEffect } from "react";
import DataTable from "../../components/table/dataTable";
import { getAlertDetails,updateAlertStatus } from "../../redux/actions/alert-action";
import { clearAlertState } from "../../redux/slices/alertSlice";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";

export const headers = [
  { fieldName: "#", headerName: "#" },
  { fieldName: "name", headerName: "Alert Name" },
  { fieldName: "device", headerName: "Device" },
  { fieldName: "threshold", headerName: "Threshold" },
  { fieldName: "message", headerName: "Message" },
  { fieldName: "type", headerName: "Type" },
  { fieldName: "status", headerName: "Status" },
  { fieldName: "", headerName: "Action" }
];

function Users() {
  const dispatch = useDispatch();
  const {
    data,
    loading,
    hasNextPage,
    nextCursor
  } = useSelector((state) => state.alert);

  useEffect(() => {
    dispatch(clearAlertState());
    dispatch(getAlertDetails({ limit: 10 }));
  }, [dispatch]);

  const handleLoadMore = () => {
    if (!loading && hasNextPage) {
      dispatch(
        getAlertDetails({
          limit: 10,
          cursor: nextCursor,
        })
      );
    }
  };

  const tableData = data.map((item, index) => ({
  _id: item._id,
  "#": index + 1,
  name: item.name,
  device: item.device,
  threshold: item.threshold,
  message: item.msg,
  type: item.notification_type,
  status: item.status === "active",
}));

const handleStatusToggle = async (id, currentStatus) => {
  try {
    await dispatch(
      updateAlertStatus({
        id,
        status: currentStatus ? "inactive" : "active",
      })
    ).unwrap();

    toast.success(
      `Alert ${currentStatus ? "deactivated" : "activated"} successfully`
    );
  } catch (error) {
    toast.error(
      error?.message || "Failed to update alert status"
    );
  }
};


  return (
    <DataTable
      loading={loading}
      headers={headers}
      data={tableData}
       onStatusToggle={handleStatusToggle}
      statusToggle={true}
      title="Alert Listing"
      addButtonLabel="Add Alert"
      addLink="/alert/add"
      editLink="/alert/edit"
      viewLink="/alert/view"
      showLoadMore
      hasNextPage={hasNextPage}
      onLoadMore={handleLoadMore}
    />
  );
}

export default Users;
