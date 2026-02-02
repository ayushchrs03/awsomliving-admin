import React, { useState } from "react";
import DataTable from "../../components/table/dataTable";
import { useDispatch, useSelector } from "react-redux";
import { getHomeDetails, updateHomeStatus } from "../../redux/actions/home-action";
import { clearHomeState } from "../../redux/slices/homeSlice";
import { toast } from "react-hot-toast";
import Breadcrumb from "../../components/formField/breadcrumb";
import {useDebouncedEffect} from "../../components/formField/capitalizer"

export const headers = [
  { fieldName: "name", headerName: "Home Name" },
  { fieldName: "userName", headerName: "User Name" },
  { fieldName: "userEmail", headerName: "User Email" },
  { fieldName: "residentName", headerName: "Resident Name" },
  { fieldName: "residentPhone", headerName: "Resident Phone" },
  { fieldName: "status", headerName: "Status" },
];

function Home() {
  const dispatch = useDispatch();
  const { data, loading, hasNextPage, nextCursor,counts } = useSelector((state) => state.home);
  const [selectedIds, setSelectedIds] = useState([]);
  const [searchText, setSearchText] = useState("");


  console.log()
  useDebouncedEffect(() => {
    dispatch(clearHomeState());
    dispatch(
      getHomeDetails({
        limit: 10,
        search: searchText || undefined,
      })
    );
  }, [searchText, dispatch], 500);

  const tableData = data.map((item) => {
    const resident = item.resident || {};
    return {
      _id: item._id,
      name: item.name || "-",
      status: item.status,
      userName: item.user?.first_name || "-",
      userEmail: item.user?.email || "-",
      residentName: resident.name || "-",
      residentEmail: resident.email || "-",
      residentPhone: resident.phone || "-",
      residentAge: resident.age || "-",
      residentGender: resident.gender || "-",
      emergencyContactName: resident.emergency_con_name || "-",
      emergencyContactNumber: resident.emergency_con_num || "-",
    };
  });

  const handleStatusToggle = async (id, currentStatus) => {
    try {
      await dispatch(
        updateHomeStatus({
          id,
          status: currentStatus ? "inactive" : "active",
        })
      ).unwrap();

      toast.success(`Home ${currentStatus ? "deactivated" : "activated"} successfully`);
    } catch (error) {
      toast.error(error?.message || "Failed to update home status");
    }
  };

  const handleLoadMore = () => {
    if (!loading && hasNextPage) {
      dispatch(getHomeDetails({ limit: 10, cursor: nextCursor }));
    }
  };

  const handleBulkView = (ids) => {
    console.log("View Selected Homes:", ids);
    toast.success(`${ids.length} homes selected for viewing`);
  };

  const handleBulkDelete = (ids) => {
    console.log("Delete Selected Homes:", ids);
    toast.success(`${ids.length} homes selected for delete`);
  };

  return (
    <>
      <Breadcrumb items={[{ label: "Home" }]} />
      <DataTable
        loading={loading}
        headers={headers}
        data={tableData}
        onStatusToggle={handleStatusToggle}
        statusToggle={true}
        title="Home Listing"
        addButtonLabel="Add Home"
        addLink="/home/add"
        editLink="/home/edit"
        viewLink="/home/view"
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
         showStats={true}
        stats={{
    total: counts?.total || 0,
    active: counts?.active || 0,
    inactive: counts?.inactive || 0,
  }}
      />
    </>
  );
}

export default Home;
