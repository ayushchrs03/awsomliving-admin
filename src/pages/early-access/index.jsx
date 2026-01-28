import React, { useEffect, useState } from "react";
import DataTable from "../../components/table/dataTable";
import Breadcrumb from "../../components/formField/breadcrumb";
import { toast } from "react-hot-toast";
import client from "../../redux/axios-baseurl";
import { useDebouncedEffect } from "../../components/formField/capitalizer";

export const headers = [
  { fieldName: "email", headerName: "Email" },
  { fieldName: "time", headerName: "Time" },
  { fieldName: "date", headerName: "Date" },
];

function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [nextCursor, setNextCursor] = useState(null);
  const [hasNextPage, setHasNextPage] = useState(false);

  const fetchUsers = async ({ search, cursor } = {}) => {
    try {
      setLoading(true);

      const response = await client.get("/user/registered-users", {
        params: {
          limit: 10,
          search: search || undefined,
          cursor: cursor || undefined,
        },
      });

      const apiData = response.data?.data;

      setUsers((prev) =>
        cursor ? [...prev, ...apiData.data] : apiData.data
      );

      setNextCursor(apiData.pagination.next_cursor);
      setHasNextPage(apiData.pagination.has_next_page);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  // Debounced search
  useDebouncedEffect(() => {
    setUsers([]);
    setNextCursor(null);
    fetchUsers({ search: searchText });
  }, [searchText], 500);

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleLoadMore = () => {
    if (!loading && hasNextPage) {
      fetchUsers({ cursor: nextCursor });
    }
  };

const tableData = users.map((item) => ({
  _id: item._id,
  email: item.email,

  time: new Date(item.createdAt).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }),

  date: new Date(item.createdAt).toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }),
}));

  return (
    <>
      <Breadcrumb items={[{ label: "Early Access" }]} />

      <DataTable
        loading={loading}
        headers={headers}
        data={tableData}
        title="Early Access Users"
        showLoadMore={hasNextPage}
        onLoadMore={handleLoadMore}
        showSearch={false}
        showFilter={false}
        selectable={false}
        showAddButton={false}
      />
    </>
  );
}

export default Users;
