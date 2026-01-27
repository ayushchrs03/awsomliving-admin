import React, { useState } from "react";
import DataTable from "../../components/table/dataTable";
import { useDispatch, useSelector } from "react-redux";
import {
  getDeviceDetails,
  updateDeviceStatus,
  createDeviceToken,
} from "../../redux/actions/device-action";
import { clearDeviceState } from "../../redux/slices/deviceSlice";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";
import { FiCopy } from "react-icons/fi";
import { toast } from "react-hot-toast";
import Breadcrumb from "../../components/formField/breadcrumb";
import {useDebouncedEffect} from "../../components/formField/capitalizer"

export const headers = [
  { fieldName: "deviceName", headerName: "Device Name" },
  { fieldName: "deviceNo", headerName: "Device No" },
  { fieldName: "resident", headerName: "Resident" },
  { fieldName: "user", headerName: "User" },
  { fieldName: "generateToken", headerName: "Generate Token" },
  { fieldName: "status", headerName: "Status" },
];

function Devices() {
  const dispatch = useDispatch();
  const { data = [], loading, hasNextPage, nextCursor, token } = useSelector((state) => state.device);

  const [searchText, setSearchText] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);
  const [tokenModalOpen, setTokenModalOpen] = useState(false);
  const [selectedDeviceId, setSelectedDeviceId] = useState(null);
  const [copied, setCopied] = useState(false);

  useDebouncedEffect(() => {
    dispatch(clearDeviceState());
    dispatch(
      getDeviceDetails({
        limit: 10,
        search: searchText || undefined,
      })
    );
  }, [searchText, dispatch], 500);

  const tableData = data?.map((item) => ({
    _id: item._id,
    deviceName: item.type || "-",
    deviceNo: item.sr_num || item.camera_id || "-",
    resident: item.resident?.name || "-",
    user: item.resident?.user
      ? `${item.resident.user.first_name} ${item.resident.user.last_name || ""}`
      : "-",
    status: item.status === "active",
  }));

  const handleStatusToggle = async (id, currentStatus) => {
    try {
      await dispatch(
        updateDeviceStatus({
          id,
          status: currentStatus ? "inactive" : "active",
        })
      ).unwrap();
      toast.success(`Device ${currentStatus ? "deactivated" : "activated"} successfully`);
    } catch (error) {
      toast.error(error?.message || "Failed to update device status");
    }
  };

  const handleGenerateToken = async (device) => {
    setSelectedDeviceId(device.deviceNo);
    setTokenModalOpen(true);
    await dispatch(createDeviceToken(device._id));
  };

  const handleCopyToken = async () => {
    if (!token) return;
    await navigator.clipboard.writeText(token);
    setCopied(true);
  };

  const handleCloseModal = () => {
    setTokenModalOpen(false);
    setCopied(false);
  };

  const handleLoadMore = () => {
    if (!loading && hasNextPage) {
      dispatch(getDeviceDetails({ limit: 10, cursor: nextCursor }));
    }
  };

  const handleBulkView = (ids) => {
    console.log("View Selected Devices:", ids);
    toast.success(`${ids.length} devices selected`);
  };

  const handleBulkDelete = (ids) => {
    console.log("Delete Selected Devices:", ids);
    toast.success(`${ids.length} devices selected for delete`);
  };

  return (
    <>
     <Breadcrumb items={[{ label: "Device" }]} />

      <DataTable
        loading={loading}
        headers={headers}
        data={tableData}
        title="Device Listing"
        addButtonLabel="Add Device"
        addLink="/device/add"
        editLink="/device/edit"
        viewLink="/device/view"
        statusToggle
        onStatusToggle={handleStatusToggle}
        onGenerateToken={handleGenerateToken}
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

      <Dialog
        open={tokenModalOpen}
        onClose={handleCloseModal}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Token Generated</DialogTitle>

        <DialogContent dividers>
          <p className="text-sm text-gray-700 mb-2">
            Your token has been successfully generated for the device{" "}
            {selectedDeviceId}.
          </p>

          <p className="text-sm font-semibold text-gray-900 mt-3">Token</p>

          <div className="relative mt-1 bg-gray-100 p-3 rounded text-xs break-all">
            {token || "Generating..."}

            {token && (
              <button
                onClick={handleCopyToken}
                className="absolute bottom-2 right-2 text-gray-600 hover:text-black"
                title="Copy token"
              >
                <FiCopy size={16} />
              </button>
            )}
          </div>

          {copied && (
            <p className="mt-1 text-orange-400 text-xs">
              Token copied successfully
            </p>
          )}
        </DialogContent>

        <DialogActions>
          <Button
            onClick={() => {
              handleCloseModal();
            }}
            variant="contained"
            sx={{ backgroundColor: "#EF9421" }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default Devices;
