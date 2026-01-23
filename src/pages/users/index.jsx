import React, { useEffect, useState } from "react";
import DataTable from "../../components/table/dataTable";
import { getUserDetails, updateUserStatus } from "../../redux/actions/user-action";
import { useDispatch, useSelector } from "react-redux";
import { clearUserState } from "../../redux/slices/userSlice";
import { toast } from "react-hot-toast";
import Breadcrumb from "../../components/formField/breadcrumb";

export const headers = [
  { fieldName: "name", headerName: "Name" },
  { fieldName: "email", headerName: "Email" },
  { fieldName: "home", headerName: "Home" },
  { fieldName: "resident", headerName: "Resident" },
  { fieldName: "status", headerName: "Status" },
];

function Users() {
  const dispatch = useDispatch();

  const { data, loading, hasNextPage, nextCursor } = useSelector(
    (state) => state.user
  );
  const [selectedIds, setSelectedIds] = useState([]);

  useEffect(() => {
    dispatch(clearUserState());
    dispatch(getUserDetails({ limit: 10 }));
  }, [dispatch]);


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

  status: item.status === "active",
}));


  const handleStatusToggle = async (id, currentStatus) => {
    try {
      await dispatch(
        updateUserStatus({
          id,
          status: currentStatus ? "inactive" : "active",
        })
      ).unwrap();

      toast.success(
        `User ${currentStatus ? "deactivated" : "activated"} successfully`
      );
    } catch (error) {
      toast.error(error?.message || "Failed to update user status");
    }
  };

  const handleLoadMore = () => {
    if (!loading && hasNextPage) {
      dispatch(
        getUserDetails({
          limit: 10,
          cursor: nextCursor,
        })
      );
    }
  };

  return (
    <>
      <Breadcrumb items={[{ label: "User" }]} />

    <DataTable
      loading={loading}
      headers={headers}
      data={tableData}
      statusToggle={true}
      onStatusToggle={handleStatusToggle}
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
        onBulkView={(ids) => console.log("View Selected:", ids)}
        onBulkDelete={(ids) => console.log("Delete Selected:", ids)}
      />
    </>
  );
}

export default Users;
