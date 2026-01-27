import React, { useEffect, useState } from "react";
import DataTable from "../../components/table/dataTable";
import { getAlertDetails, updateAlertStatus } from "../../redux/actions/alert-action";
import { clearAlertState } from "../../redux/slices/alertSlice";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import Breadcrumb from "../../components/formField/breadcrumb";

export const headers = [
  { fieldName: "name", headerName: "Alert Name" },
  { fieldName: "device", headerName: "Device" },
  { fieldName: "threshold", headerName: "Threshold" },
  { fieldName: "message", headerName: "Message" },
  { fieldName: "type", headerName: "Type" },
  { fieldName: "status", headerName: "Status" },
];

function Alerts() {
  const dispatch = useDispatch();

  const { data, loading, hasNextPage, nextCursor } = useSelector(
    (state) => state.alert
  );

  const [selectedIds, setSelectedIds] = useState([]);

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

  const tableData = data.map((item) => ({
    _id: item._id,
    name: item.name || "-",
    device: item.device || "-",
    threshold: item.threshold || "-",
    message: item.msg || "-",
    type: item.notification_type || "-",
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
      toast.error(error?.message || "Failed to update alert status");
    }
  };

  const handleBulkView = (ids) => {
    console.log("View Selected Alerts:", ids);
    toast.success(`${ids.length} alerts selected`);
  };

  const handleBulkDelete = (ids) => {
    console.log("Delete Selected Alerts:", ids);
    toast.success(`${ids.length} alerts selected for delete`);
  };

  const [searchText, setSearchText] = useState("");
  
  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(clearAlertState());
      dispatch(
        getAlertDetails({
          limit: 10,
          search: searchText,
        })
      );
    }, 500);
  
    return () => clearTimeout(timer);
  }, [searchText, dispatch]);



  return (
    <>
         <Breadcrumb items={[{ label: "Alert" }]} />
    
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
      showLoadMore={true}
      hasNextPage={hasNextPage}
      onLoadMore={handleLoadMore}

      showCheckboxSelection={true}
      selectedIds={selectedIds}
      onSelectionChange={setSelectedIds}

      showBulkActions={true}
      onBulkView={handleBulkView}
      onBulkDelete={handleBulkDelete}
        showSearch={true}
  searchValue={searchText}
  onSearchChange={setSearchText}
    />
    </>

  );
}

export default Alerts;
