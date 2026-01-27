import React, { useState } from "react";
import DataTable from "../../components/table/dataTable";
import { useDispatch, useSelector } from "react-redux";
import { getAlertDetails, updateAlertStatus } from "../../redux/actions/alert-action";
import { clearAlertState } from "../../redux/slices/alertSlice";
import { toast } from "react-hot-toast";
import Breadcrumb from "../../components/formField/breadcrumb";
import {useDebouncedEffect} from "../../components/formField/capitalizer"

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
  const { data = [], loading, hasNextPage, nextCursor } = useSelector((state) => state.alert);

  const [selectedIds, setSelectedIds] = useState([]);
  const [searchText, setSearchText] = useState("");

  useDebouncedEffect(() => {
    dispatch(clearAlertState());
    dispatch(
      getAlertDetails({
        limit: 10,
        search: searchText || undefined,
      })
    );
  }, [searchText, dispatch], 500);

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

      toast.success(`Alert ${currentStatus ? "deactivated" : "activated"} successfully`);
    } catch (error) {
      toast.error(error?.message || "Failed to update alert status");
    }
  };

  const handleLoadMore = () => {
    if (!loading && hasNextPage) {
      dispatch(getAlertDetails({ limit: 10, cursor: nextCursor }));
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

  return (
    <>
      <Breadcrumb items={[{ label: "Alert" }]} />

      <DataTable
        loading={loading}
        headers={headers}
        data={tableData}
        onStatusToggle={handleStatusToggle}
        statusToggle
        title="Alert Listing"
        addButtonLabel="Add Alert"
        addLink="/alert/add"
        editLink="/alert/edit"
        viewLink="/alert/view"
        showLoadMore
        hasNextPage={hasNextPage}
        onLoadMore={handleLoadMore}
        showCheckboxSelection
        selectedIds={selectedIds}
        onSelectionChange={setSelectedIds}
        showBulkActions
        onBulkView={handleBulkView}
        onBulkDelete={handleBulkDelete}
        showSearch
        searchValue={searchText}
        onSearchChange={setSearchText}
      />
    </>
  );
}

export default Alerts;
