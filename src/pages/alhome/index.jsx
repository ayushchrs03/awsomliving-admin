import React, { useEffect } from "react";
import DataTable from "../../components/table/dataTable";
import { useDispatch, useSelector } from "react-redux";
import { getHomeDetails, updateHomeStatus } from "../../redux/actions/home-action";
import { clearHomeState } from "../../redux/slices/homeSlice";
import { toast } from "react-hot-toast";

export const headers = [
  { fieldName: "#", headerName: "#" },
  { fieldName: "name", headerName: "Home Name" },
  { fieldName: "userName", headerName: "User Name" },
  { fieldName: "userEmail", headerName: "User Email" },
  { fieldName: "residentName", headerName: "Resident Name" },
  { fieldName: "residentPhone", headerName: "Resident Phone" },
  {  fieldName: "status", headerName: "Home Status" },
  { fieldName: "", headerName: "Action" }
];

function Home() {
  const dispatch = useDispatch();
  const { data, loading, hasNextPage, nextCursor } = useSelector(
    (state) => state.home
  );

  useEffect(() => {
    dispatch(clearHomeState());
    dispatch(getHomeDetails({ limit: 10 }));
  }, [dispatch]);

  const tableData = data.map((item, index) => {
    const resident = item.resident || {};

    return {
      _id: item._id,
      "#": index + 1,

      name: item.name || "-",
      status: item.status === "active",

      userName: item.user?.first_name || "-",
      userEmail: item.user?.email || "-",

      residentName: resident.name || "-",
      residentEmail: resident.email || "-",
      residentPhone: resident.phone || "-",
      residentAge: resident.age || "-",
      residentGender: resident.gender || "-",

      emergencyContactName: resident.emergency_con_name || "-",
      emergencyContactNumber: resident.emergency_con_num || "-"
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

    toast.success(
      `Home ${currentStatus ? "deactivated" : "activated"} successfully`
    );
  } catch (error) {
    toast.error(
      error?.message || "Failed to update home status"
    );
  }
};


  const handleLoadMore = () => {
    if (!loading) {
      dispatch(
        getHomeDetails({
          limit: 10,
          cursor: nextCursor
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
      statusToggle={true}
      title="Home Listing"
      addButtonLabel="Add Home"
      addLink="/home/add"
      editLink="/home/edit"
      viewLink="/home/view"
      showLoadMore
      hasNextPage={hasNextPage}
      onLoadMore={handleLoadMore}
    />
  );
}

export default Home;
