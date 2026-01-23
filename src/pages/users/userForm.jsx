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
import { FaPhoneAlt } from "react-icons/fa";

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
  <div>
    <Breadcrumb
      items={[
        { label: "User", path: "/user" },
        { label: title },
      ]}
    />

    <div>
      <div >
    
        {isView ? (
          <div className="space-y-4">
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm px-6 py-5 flex items-center justify-between">
              
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center text-orange-500">
                  <FaUser size={18} />
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-semibold text-gray-900">
                      {formData.first_name} {formData.last_name}
                    </h2>

                    <span className="text-xs font-semibold px-2 py-1 rounded-full bg-green-100 text-green-700">
                      ACTIVE
                    </span>
                  </div>

                  <p className="text-sm text-gray-500 mt-1">
                    {homes.length} Homes • {residents.length} Residents
                  </p>
                </div>
              </div>

              <div className="text-right">
                <p className="text-xs text-gray-400 font-semibold uppercase">
                  Primary Email
                </p>
                <p className="text-sm font-semibold text-gray-900">
                  {formData.email} 
                </p>
              </div>
            </div>

            {homes.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-700">Homes</h2>
                  <p className="text-sm text-gray-500">
                    Total: {homes.length}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {homes.map((home, index) => (
                    <div
                      key={home._id}
                      onClick={() => handleHomeView(home._id)}
                      className="bg-white border border-gray-200 rounded-xl shadow-sm p-5 cursor-pointer hover:shadow-md transition"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center">
                            <FaHome size={16} />
                          </div>

                          <div>
                            <p className="text-sm font-semibold text-gray-900">
                              {home.name || `Home ${index + 1}`}
                            </p>
                            <p className="text-xs text-gray-500">
                              Home {index + 1}
                            </p>
                          </div>
                        </div>

                        <button className="text-gray-400 hover:text-gray-600">
                          ⋮
                        </button>
                      </div>

                      <p className="text-sm font-medium text-orange-600 mt-4">
                        View →
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Residents Section */}
            {residents.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-700">
                    Residents
                  </h2>
                  <p className="text-sm text-gray-500">
                    Total: {residents.length}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {residents.map((resident) => (
                    <div
                      key={resident._id}
                      onClick={() => handleResidentView(resident._id)}
                      className="bg-white border border-gray-200 rounded-xl shadow-sm p-5 cursor-pointer hover:shadow-md transition"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-semibold">
                              {resident?.name?.charAt(0) || "R"}
                            </div>

                            <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
                          </div>

                          <div>
                            <p className="text-sm font-semibold text-gray-900">
                              {resident.name}
                            </p>

                            <p className="text-xs text-gray-500">
                              {/* {resident.age || "--"} Years •{" "} */}
                              {/* {resident.gender || "--"} */}
                            </p>
                          </div>
                        </div>

                        <button className="text-gray-400 hover:text-gray-600">
                          ⋮
                        </button>
                      </div>

                      <div className="mt-4 space-y-2 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          {/* <span className="text-gray-400">📞</span> */}
                          <FaPhoneAlt/>
                          <p>{resident.phone || "—"}</p>
                        </div>

                        <div className="flex items-center gap-2">
                          {/* <span className="text-gray-400">✉️</span> */}
                          {/* <p>{resident.email || "—"}</p> */}
                        </div>
                      </div>

                      <p className="text-sm font-medium text-blue-600 mt-4">
                        View →
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <>
          <p className="text-[28px] leading-[32px] text-[#121212] font-medium px-2 mb-6">  {isAdd ? "Add New User" : "Edit User"}
</p>
          <div className="bg-[#ffffff]">
  <div className="grid grid-cols-2 md:grid-cols-2 gap-5">
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
  </div>

  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
    <FormField
      label="User Email"
      name="email"
      type="email"
      value={formData.email}
      onChange={(e) => onChangeField("email", e.target.value)}
      rules={[{ type: "required" }, { type: "email" }]}
      error={errors.email}
    />

    <FormField
      label="Contact Number"
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

  {/* ✅ Buttons now inside card */}
  <div className="flex justify-end gap-3 pt-6 px-2 pb-6">
    <button
      onClick={() => navigate(-1)}
      className="px-5 py-2 border border-gray-300 rounded-md hover:bg-gray-100 transition"
    >
      Cancel
    </button>

    <button
      onClick={handleSubmit}
      disabled={loading}
      className="px-6 py-2 rounded-md bg-[#EF9421] text-white hover:opacity-90 transition"
    >
      {loading ? "Saving..." : buttonLabel}
    </button>
  </div>
</div>

          </>
        )}
      </div>
    </div>
  </div>
);

};

export default UserForm;
