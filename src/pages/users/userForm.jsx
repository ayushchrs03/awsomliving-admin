import React, { useEffect, useState } from "react";
import { IoIosArrowBack } from "react-icons/io";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import FormField from "../../components/formField";
import {
  addUserDetails,
  editUserDetails,
  viewUserDetails,
} from "../../redux/actions/user-action";
import { toast } from "react-hot-toast";
import { FaHome, FaUser } from "react-icons/fa";
import InfoTile from "../../components/formField/infoTile";
import Breadcrumb from "../../components/formField/breadcrumb";

import { clearDetails } from "../../redux/slices/userSlice";

import {
  createFieldUpdater,
  allowOnlyTenDigits,
  validateForm,
} from "../../utils/formUtils";

const UserForm = ({ mode }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { id: paramId } = useParams();
  const [searchParams] = useSearchParams();
  const queryId = searchParams.get("id");
  const userId = paramId || queryId;

  const isView = mode === "view";
  const isEdit = mode === "edit";
  const isAdd = mode === "add";

  const title = isAdd ? "Add User" : isEdit ? "Edit User" : "User Details";
  const buttonLabel = isAdd ? "Add User" : "Save";

  const { details, loading, error, formStatues } = useSelector(
    (state) => state.user
  );

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
  });
  const [homes, setHomes] = useState([]);
  const [residents, setResidents] = useState([]);
  const [errors, setErrors] = useState({});

  const onChangeField = createFieldUpdater(setFormData, setErrors);

  useEffect(() => {
    if ((isView || isEdit) && userId) {
      dispatch(viewUserDetails(userId));
    }
  }, [dispatch, isView, isEdit, userId]);

  useEffect(() => {
    if (details && (isView || isEdit)) {
      setFormData({
        first_name: details.first_name || "",
        last_name: details.last_name || "",
        email: details.email || "",
        phone: details.number || "",
      });
      setHomes(details.homes || []);
      setResidents(details.residents || []);
    }
  }, [details, isView, isEdit]);

  useEffect(() => {
    return () => {
      dispatch(clearDetails());
    };
  }, [dispatch]);

  useEffect(() => {
    if (formStatues && (isAdd || isEdit)) {
      toast.success(isAdd ? "User added successfully" : "User updated successfully");
      navigate("/user");
    }
  }, [formStatues, isAdd, isEdit, navigate]);

  useEffect(() => {
    if (error && (isAdd || isEdit)) {
      toast.error("Something went wrong. Please try again.");
    }
  }, [error, isAdd, isEdit]);

  useEffect(() => {
    if (!userId && !isAdd) {
      navigate(-1);
    }
  }, [userId, isAdd, navigate]);

  const handleSubmit = () => {
    const isValid = validateForm(formData, setErrors);
    if (!isValid) return;

    if (isAdd) {
      dispatch(addUserDetails(formData));
    }
    if (isEdit) {
      dispatch(editUserDetails({ _id: userId, ...formData }));
    }
  };

  const handleHomeView = (homeId) => {
    navigate(`/home/view?id=${homeId}`);
  };

  const handleHomeEdit = (homeId) => {
    navigate(`/home/edit?id=${homeId}`);
  };

  const handleResidentView = (residentId) => {
    navigate(`/resident/view?id=${residentId}`);
  };

  const handleResidentEdit = (residentId) => {
    navigate(`/resident/edit?id=${residentId}`);
  };

  return (
    <div className="space-y-4">
  <Breadcrumb
    items={[
      { label: "User", path: "/user" },
      { label: title },
    ]}
  />

    <div className="bg-white border border-gray-200 rounded-lg shadow-sm">

  <div className="p-8 space-y-12">
        {isView ? (
          <>
           <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Basic Information
            </h2>

         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
  <InfoTile label="First Name" value={formData.first_name} />
  <InfoTile label="Last Name" value={formData.last_name} />
  <InfoTile label="Email" value={formData.email} />
  <InfoTile label="Phone" value={formData.phone} />
</div>
          </>
        ) : (
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <FormField
              label="First Name"
              name="first_name"
              value={formData.first_name}
              onChange={(e) => onChangeField("first_name", e.target.value)}
              rules={[{ type: "required" }]}
              error={errors.first_name}
            />

            <FormField
              label="Last Name"
              name="last_name"
              value={formData.last_name}
              onChange={(e) => onChangeField("last_name", e.target.value)}
              rules={[{ type: "required" }]}
              error={errors.last_name}
            />

            <FormField
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={(e) => onChangeField("email", e.target.value)}
              rules={[{ type: "required" }, { type: "email" }]}
              error={errors.email}
            />

            <FormField
              label="Phone"
              name="phone"
              type="text"
              value={formData.phone}
              onChange={(e) => {
                const value = e.target.value;
                if (allowOnlyTenDigits(value)) {
                  onChangeField("phone", value);
                }
              }}
              rules={[{ type: "required" }, { type: "length", value: 10 }]}
              error={errors.phone}
            />
          </div>
        )}

        {(isView || isEdit) && homes.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Homes</h2>
              <span className="text-sm text-gray-500">Total: {homes.length}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {homes.map((home, index) => (
                <div
                  key={home._id}
                  onClick={() =>
                    isView ? handleHomeView(home._id) : handleHomeEdit(home._id)
                  }
                  className="p-5 border border-orange-200 bg-gradient-to-br from-orange-50 to-white rounded-xl flex items-center gap-4 cursor-pointer hover:bg-orange-100 hover:border-orange-300 hover:shadow-md transition"
                >
                  <div className="w-12 h-12 flex items-center justify-center rounded-full bg-orange-100 text-orange-600">
                    <FaHome size={18} />
                  </div>

                  <div className="flex-1">
                    <p className="text-sm text-gray-500">Home {index + 1}</p>
                    <p className="font-semibold text-gray-800">{home.name}</p>

                    <p className="text-sm font-medium text-orange-600 mt-1">
                      {isView ? "View →" : "Edit →"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {(isView || isEdit) && residents.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Residents</h2>
              <span className="text-sm text-gray-500">
                Total: {residents.length}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {residents.map((resident, index) => (
                <div
                  key={resident._id}
                  onClick={() =>
                    isView
                      ? handleResidentView(resident._id)
                      : handleResidentEdit(resident._id)
                  }
                  className="p-5 border border-blue-200 bg-gradient-to-br from-blue-50 to-white rounded-xl flex items-center gap-4 cursor-pointer hover:bg-blue-100 hover:border-blue-300 hover:shadow-md transition"
                >
                  <div className="w-12 h-12 flex items-center justify-center rounded-full bg-blue-100 text-blue-600">
                    <FaUser size={18} />
                  </div>

                  <div className="flex-1">
                    <p className="text-sm text-gray-500">Resident {index + 1}</p>
                    <p className="font-semibold text-gray-800">{resident.name}</p>
                    <p className="text-sm text-gray-500">{resident.phone}</p>

                    <p className="text-sm font-medium text-blue-600 mt-1">
                      {isView ? "View →" : "Edit →"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-end gap-3 pt-4">
          <button
            onClick={() => navigate(-1)}
            className="px-5 py-2 border border-gray-300 rounded-md hover:bg-gray-100 transition"
          >
            {isView ? "Back" : "Cancel"}
          </button>

          {!isView && (
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="px-6 py-2 rounded-md bg-[#EF9421] text-white hover:opacity-90 transition"
            >
              {loading ? "Saving..." : buttonLabel}
            </button>
          )}
        </div>
      </div>
    </div>
    </div>
  );
};

export default UserForm;
