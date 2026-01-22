import React, { useEffect } from "react";
import DataTable from "../../components/table/dataTable";
import { getUserDetails,updateUserStatus } from "../../redux/actions/user-action";
import { useDispatch, useSelector } from "react-redux";
import { clearUserState } from "../../redux/slices/userSlice";
import { toast } from "react-hot-toast";

export const headers = [
  { fieldName: "#", headerName: "#" },
  { fieldName: "name", headerName: "Name" },
  { fieldName: "email", headerName: "Email" },
  { fieldName: "home", headerName: "Home" },
  { fieldName: "resident", headerName: "Resident" },
  { fieldName: "status", headerName: "Status" },
  { fieldName: "", headerName: "Action" },
];

function Users() {
  const dispatch = useDispatch();
  const {
  data,
  loading,
  hasNextPage,
  nextCursor
} = useSelector((state) => state.user);
  useEffect(() => {
  dispatch(clearUserState());
  dispatch(getUserDetails({ limit: 10 }));
}, [dispatch]);

  const tableData = data.map((item, index) => ({
    _id: item._id,
    "#": index + 1,
    name: `${item.first_name} ${item.last_name || ""}`,
    email: item.email,
     home: item.homes?.length
    ? item.homes.map(home => home.name).join("\n")
    : "-",
     resident: item.residents?.length
    ? item.residents.map(residents => residents.name).join("\n")
    : "-",
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
    toast.error(
      error?.message || "Failed to update user status"
    );
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
    <DataTable
      loading={loading}
      headers={headers}
      data={tableData}
      statusToggle={true}
      onStatusToggle={handleStatusToggle}
      title="User Listing"
      addButtonLabel="Add User"
      addLink="/user/add"
      editLink="/user/edit"
      viewLink="/user/view"
      showLoadMore
      hasNextPage={hasNextPage}
      onLoadMore={handleLoadMore}
    />
  );
}

export default Users;
