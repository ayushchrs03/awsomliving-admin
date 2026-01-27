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
import { CiMail } from "react-icons/ci";
import { FiHome } from "react-icons/fi";
import { HiDotsVertical } from "react-icons/hi";
import { FaMicrochip } from "react-icons/fa";
import {capitalizer} from "../../components/formField/capitalizer"
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
      toast.error(error);
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
           <div >
  
      <p className="text-[28px] leading-[32px] text-[#121212] font-medium px-2 mb-6"> User Details
</p>
    {/* Main Card */}

     <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
      <div className="flex items-start justify-between ">
        <div className="flex items-center gap-4">
          {/* Avatar */}
          <div className="w-12 h-12 rounded-lg bg-[#EF9421] flex items-center justify-center text-[#FFFFFF] uppercase font-bold text-lg">
            {formData.first_name?.charAt(0) || "U"}
          </div>

          {/* Name + Email */}
          <div>
            <h2 className="text-[28px] leading-[32px] mb-2 font-semibold text-gray-900">
              {capitalizer(`${formData.first_name} ${formData.last_name}`)}

            </h2>
            <p className="text-[14px] leading-[14px] text-gray-500">{formData.email || "—"}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-sm text-green-600 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500" />
            Active
          </span>

          <button
            onClick={(e) => {
              e.stopPropagation();
            }}
            className="text-[#EF9421] text-xl font-bold"
          >
            <HiDotsVertical />
          </button>
        </div>
      </div>


      <div className="grid grid-cols-3 sm:grid-cols-3 gap-4 mt-6">
        <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-4 border border-gray-200">
          <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center text-green-600">
            <FaPhoneAlt size={16} />
          </div>

          <div>
            <p className="text-xs text-gray-500 font-medium">Contact Number</p>
            <p className="text-sm  text-gray-900">
              {formData.phone || "—"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-4 border border-gray-200">
          <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center text-orange-600">
            <CiMail  />
          </div>

          <div>
            <p className="text-xs text-gray-500 font-medium">Email</p>
            <p className="text-sm  text-gray-900">
              {formData.email || "—"}
            </p>
          </div>
        </div>

        {/* Last Login */}
        {/* <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-4 border border-gray-200">
          <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
            🕒
          </div>

          <div>
            <p className="text-xs text-gray-500 font-medium">Last Login</p>
            <p className="text-sm font-semibold text-gray-900">
              {details?.last_login || "—"}
            </p>
          </div>
        </div> */}
      </div>
      </div>

    
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">

      <div>
        <h3 className="text-base font-semibold text-gray-900 mb-3">
          Home Details
        </h3>

       {homes.length > 0 ? (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
    {homes.map((home) => (
      <div
        key={home._id}
        onClick={() => handleHomeView(home._id)}
        className="rounded-lg border border-gray-200 bg-white p-4 hover:shadow-sm cursor-pointer transition"
      >
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center uppercase font-bold text-orange-600">
            {home?.name?.charAt(0) || "H"}
          </div>

          <div className="flex-1">
            <p className="text-sm font-semibold text-gray-900">
              {capitalizer(home?.name) || "Home"}
            </p>

            <p className="text-xs text-gray-500">
              {home?.connected_devices
                ? `${home.connected_devices} Devices`
                : "—"}
            </p>
          </div>
        </div>
        <div className="mt-4 space-y-2 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <FiHome className="text-[#4D4D4D]" size={12} />
            <p className="text-xs">
              {home?.connected_devices
                ? `${home.connected_devices} Connected Devices`
                : "—"}
            </p>
          </div>
        </div>
      </div>
    ))}
  </div>
) : (
  <p className="text-sm text-gray-500">No homes assigned.</p>
)}


      </div>
      </div>

    
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">

      <div>
        <h3 className="text-base font-semibold text-gray-900 mb-3">
          Resident Details
        </h3>

        {residents.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {residents.map((resident) => (
              <div
                key={resident._id}
                onClick={() => handleResidentView(resident._id)}
                className="rounded-lg border border-gray-200 bg-white p-4 hover:shadow-sm cursor-pointer transition"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#F0FFF7] flex items-center justify-center uppercase font-bold text-[#000000]">
                    {resident?.name?.charAt(0) || "R"}
                  </div>

                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-900">
                      {capitalizer(resident?.name) || "Resident"}
                    </p>

                    <p className="text-xs text-gray-500">
                      {resident?.age ? `${resident.age} Year` : "—"}
                      {resident?.gender ? `, ${resident.gender}` : ""}
                    </p>
                  </div>
                </div>

                {/* Resident Contact */}
                <div className="mt-4 space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <span className="text-[#4D4D4D]"><CiMail/></span>
                    <p className="text-xs">{resident?.email || "—"}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <FaPhoneAlt className="text-[#4D4D4D]" size={12} />
                    <p className="text-xs">{resident?.phone || "—"}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">No residents found.</p>
        )}
      </div>
      </div>
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
