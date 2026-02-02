import React, { useState } from "react";
import DataTable from "../../components/table/dataTable";
import { getUserDetails, updateUserStatus } from "../../redux/actions/user-action";
import { useDispatch, useSelector } from "react-redux";
import { clearUserState } from "../../redux/slices/userSlice";
import { toast } from "react-hot-toast";
import Breadcrumb from "../../components/formField/breadcrumb";
import {useDebouncedEffect} from "../../components/formField/capitalizer"
export const headers = [
  { fieldName: "name", headerName: "Name" },
  { fieldName: "email", headerName: "Email" },
  { fieldName: "home", headerName: "Home" },
  { fieldName: "resident", headerName: "Resident" },
  { fieldName: "status", headerName: "Status" },
];

function Users() {
  const dispatch = useDispatch();
  const { data, loading, hasNextPage, nextCursor,counts } = useSelector((state) => state.user);
  const [searchText, setSearchText] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);


  useDebouncedEffect(() => {
    dispatch(clearUserState());
    dispatch(
      getUserDetails({
        limit: 10,
        search: searchText || undefined,
      })
    );
  }, [searchText, dispatch], 500);

  const formatNames = (list = []) => {
  if (!list || list.length === 0) return "-";

  if (list.length <= 2) {
    return list.map((item) => item.name).join(", ");
  }

  const firstTwo = list.slice(0, 2).map((item) => item.name).join(", ");
  const remaining = list.length - 2;

  return `${firstTwo} +${remaining}`;
};

  const tableData = data.map((item) => ({
  _id: item._id,
  name: `${item.first_name} ${item.last_name || ""}`,
  email: item.email,

  home: formatNames(item.homes),
  resident: formatNames(item.residents),

  status: item.status,
}));

  const handleStatusToggle = async (id, currentStatus) => {
    try {
      await dispatch(
        updateUserStatus({
          id,
          status: currentStatus ? "inactive" : "active",
        })
      ).unwrap();

      toast.success(`User ${currentStatus ? "deactivated" : "activated"} successfully`);
    } catch (error) {
      toast.error(error?.message || "Failed to update user status");
    }
  };

  const handleLoadMore = () => {
    if (!loading && hasNextPage) {
      dispatch(getUserDetails({ limit: 10, cursor: nextCursor }));
    }
  };

  return (
    <>
      <Breadcrumb items={[{ label: "User" }]} />

    <DataTable
      loading={loading}
      headers={headers}
      data={tableData}
  
      title="User Listing"
      addButtonLabel="Add New User"
      addLink="/user/add"
      editLink="/user/edit"
      viewLink="/user/view"
  showLoadMore={true}
  hasNextPage={hasNextPage}
  onLoadMore={handleLoadMore}

  showCheckboxSelection={true}
  selectedIds={selectedIds}
  onSelectionChange={setSelectedIds}

  showBulkActions={true}

  showSearch={true}
  searchValue={searchText}
  onSearchChange={setSearchText}

  statusToggle={true}
  onStatusToggle={handleStatusToggle}
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

export default Users;
