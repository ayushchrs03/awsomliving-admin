import React, { useEffect, useState } from "react";
import { IoIosArrowBack } from "react-icons/io";

import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import FormField from "../../components/formField";
import InfoTile from "../../components/formField/infoTile";
import Breadcrumb from "../../components/formField/breadcrumb";
import {
  addResidentDetails,
  editResidentDetails,
  viewResidentDetails,
} from "../../redux/actions/resident-action";
import { getUserDetails } from "../../redux/actions/user-action";
import { getHomeDetails } from "../../redux/actions/home-action";

import { toast } from "react-hot-toast";

import { createFieldUpdater, validateForm, allowOnlyTenDigits } from "../../utils/formUtils";
import { clearFormStatus } from "../../redux/slices/residentSlice";

const ResidentForm = ({ mode }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { id: paramId } = useParams();
  const [searchParams] = useSearchParams();
  const queryId = searchParams.get("id");
  const residentId = paramId || queryId;

  const isView = mode === "view";
  const isEdit = mode === "edit";
  const isAdd = mode === "add";

  const title = isAdd ? "Add Resident" : isEdit ? "Edit Resident" : "Resident Details";
  const buttonLabel = isAdd ? "Add Resident" : "Save";

  const { details, loading, error, formStatus } = useSelector(
    (state) => state.resident
  );

  useEffect(() => {
    dispatch(getUserDetails({ limit: 100 }));
    dispatch(getHomeDetails({ limit: 100 }));
  }, [dispatch]);

  const users = useSelector((state) => state.user?.data);
  const homes = useSelector((state) => state.home?.data);

  const userOptions = users?.map((user) => ({
    label: `${user.first_name} ${user.last_name || ""}`,
    value: user._id,
  }));

  const homeOptions = homes?.map((home) => ({
    label: home.name,
    value: home._id,
  }));

  const [formData, setFormData] = useState({
    name: "",
    emergency_con_num: "",
    emergency_con_name: "",
    email: "",
    age: "",
    gender: "",
    medicalCondition: "",
    medication: "",
    userId: "",
    home: "",
    roomId: "",
    phone: "",
    deviceType: "",
    deviceValue: "",
  });

  const [errors, setErrors] = useState({});
  const onChangeField = createFieldUpdater(setFormData, setErrors);

  const handleDeviceSelect = (type) => {
    setFormData((prev) => ({
      ...prev,
      deviceType: prev.deviceType === type ? "" : type,
      deviceValue: "",
    }));
  };

  useEffect(() => {
    if ((isView || isEdit) && residentId) {
      dispatch(viewResidentDetails(residentId));
    }
  }, [dispatch, isView, isEdit, residentId]);

 useEffect(() => {
  if (details && (isView || isEdit)) {
    const deviceType =
      details.devices?.type === "Eltum"
        ? "altum"
        : details.devices?.type === "Emfit"
        ? "emfit"
        : "";

    const deviceValue =
      deviceType === "altum"
        ? details.devices?.camera_id || ""
        : deviceType === "emfit"
        ? details.devices?.sr_num || ""
        : "";

    setFormData({
      name: details.name || "",
      emergency_con_num: details.emergency_con_num || "",
      phone: details.phone || "",
      emergency_con_name: details.emergency_con_name || "",
      email: details.email || "",
      age: details.age || "",
      gender: details.gender || "",
      medicalCondition: details.emergency_condition || "",
      medication: details.medication || "",
      userId: details.creator?._id || "",
      home: details.home?._id || "",
      roomId: "",
      deviceType,
      deviceValue,
    });
  }
}, [details, isView, isEdit]);


useEffect(() => {
  if (formStatus && (isAdd || isEdit)) {
    toast.success(
      isAdd ? "Resident added successfully" : "Resident updated successfully"
    );

    dispatch(clearFormStatus()); 
    navigate("/resident");
  }
}, [formStatus, navigate, isAdd, isEdit, dispatch]);

  useEffect(() => {
    if (error && (isAdd || isEdit)) {
      toast.error(error);
    }
  }, [error, isAdd, isEdit]);

  const handleSubmit = () => {
    const isValid = validateForm(formData, setErrors);
    if (!isValid) return;

    const payload = {
      name: formData.name,
      phone: formData.phone,
      age: Number(formData.age),
      gender: formData.gender,
      medication: formData.medication,
      home: formData.home,
      email: formData.email,

      emergency_condition: formData.medicalCondition,
      emergency_con_name: formData.emergency_con_name,
      emergency_con_num: Number(formData.emergency_con_num),

      creator: formData.userId,
      type: formData.deviceType === "altum" ? "Eltum" : "Emfit",
    };

    if (formData.deviceType === "altum") {
      payload.camera_id = formData.deviceValue;
    }

    if (formData.deviceType === "emfit") {
      payload.sr_num = formData.deviceValue;
    }

    if (isAdd) {
      dispatch(addResidentDetails(payload));
    }

    if (isEdit) {
      dispatch(editResidentDetails({ _id: residentId, ...payload }));
    }
  };

  const selectedUserLabel =
    userOptions?.find((u) => u.value === formData.userId)?.label || "";

  const selectedHomeLabel =
    homeOptions?.find((h) => h.value === formData.home)?.label || "";

  const deviceTypeLabel =
    formData.deviceType === "emfit"
      ? "Emfit"
      : formData.deviceType === "altum"
      ? "Eltum"
      : formData.deviceType || "-";

 return (
  <div >
   <Breadcrumb
  items={[
    { label: "Resident", path: "/resident" },
    { label: title },
  ]}
/>

    <div>

      <div>
        {isView ? (
       <div>
    <p className="text-[28px] leading-[32px] text-[#121212] font-medium px-2 mb-6">
      Resident Details
    </p>

    {/* Resident Main Card */}
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          {/* Resident Avatar */}
          <div className="w-12 h-12 rounded-lg bg-[#EF9421] flex items-center justify-center text-white uppercase font-bold text-lg">
            {formData.name?.charAt(0) || "R"}
          </div>

          {/* Name + Email */}
          <div>
            <h2 className="text-[28px] leading-[32px] mb-2 font-semibold text-gray-900">
              {formData.name || "—"}
            </h2>
            <p className="text-[14px] leading-[14px] text-gray-500">
              {formData.email || "—"}
            </p>
          </div>
        </div>

        {/* Status */}
        <span className="text-sm text-green-600 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-500" />
          Active
        </span>
      </div>

      {/* Quick Info */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-4 border border-gray-200">
          <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center text-green-600 font-bold">
            ☎
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">Contact Number</p>
            <p className="text-sm text-gray-900">{formData.phone || "—"}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-4 border border-gray-200">
          <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center text-purple-600 font-bold">
            A
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">Age</p>
            <p className="text-sm text-gray-900">{formData.age || "—"}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-4 border border-gray-200">
          <div className="w-10 h-10 rounded-lg bg-pink-100 flex items-center justify-center text-pink-600 font-bold">
            G
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">Gender</p>
            <p className="text-sm text-gray-900">{formData.gender || "—"}</p>
          </div>
        </div>
      </div>
    </div>

    {/* Emergency Contact */}
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
      <h3 className="text-base font-semibold text-gray-900 mb-4">
        Emergency Contact
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-4 border border-gray-200">
          <div className="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center text-yellow-600 font-bold">
            E
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">
              Emergency Contact Name
            </p>
            <p className="text-sm text-gray-900">
              {formData.emergency_con_name || "—"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-4 border border-gray-200">
          <div className="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center text-yellow-600 font-bold">
            ☎
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">
              Emergency Contact Number
            </p>
            <p className="text-sm text-gray-900">
              {formData.emergency_con_num || "—"}
            </p>
          </div>
        </div>

      </div>
    </div>

    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
      <h3 className="text-base font-semibold text-gray-900 mb-4">
        Assignment
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-4 border border-gray-200">
          <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center text-orange-600 font-bold">
            U
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">User</p>
            <p className="text-sm text-gray-900">{selectedUserLabel || "—"}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-4 border border-gray-200">
          <div className="w-10 h-10 rounded-lg bg-gray-200 flex items-center justify-center text-gray-700 font-bold">
            H
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">Home</p>
            <p className="text-sm text-gray-900">{selectedHomeLabel || "—"}</p>
          </div>
        </div>
      </div>
    </div>

    {/* Device Setup */}
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
      <h3 className="text-base font-semibold text-gray-900 mb-4">
        Device Setup
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-4 border border-gray-200">
          <div className="w-10 h-10 rounded-lg bg-gray-200 flex items-center justify-center text-gray-700 font-bold">
            D
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">Device Type</p>
            <p className="text-sm text-gray-900">{deviceTypeLabel || "—"}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-4 border border-gray-200">
          <div className="w-10 h-10 rounded-lg bg-gray-200 flex items-center justify-center text-gray-700 font-bold">
            #
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">Device Value</p>
            <p className="text-sm text-gray-900">
              {formData.deviceValue || "—"}
            </p>
          </div>
        </div>
      </div>
    </div>


  </div>
        ) : (
          <>
            <p className="text-[28px] leading-[32px] text-[#121212] font-medium px-2 mb-6">  {isAdd ? "Add New Resident " : "Edit Resident "}
</p>
          <div className="space-y-10 w-full md:w-1/2">
            <div>
              <h3 className="font-medium mb-4 px-2">Basic Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <FormField
                  label="Resident Name"
                  name="name"
                  value={formData.name}
                  onChange={(e) => onChangeField("name", e.target.value)}
                  rules={[{ type: "required" }]}
                  error={errors.name}
                />

                <FormField
                  label="Resident Age"
                  name="age"
                  type="number"
                  value={formData.age}
                  onChange={(e) => onChangeField("age", e.target.value)}
                  rules={[{ type: "required" }]}
                  error={errors.age}
                />

                <FormField
                  label="Resident contact number"
                  name="phone"
                  type="number"
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

                <FormField
                  label="Resident Gender"
                  name="gender"
                  type="select"
                  value={formData.gender}
                  options={[
                    { label: "Male", value: "male" },
                    { label: "Female", value: "female" },
                  ]}
                  onChange={(e) => onChangeField("gender", e.target.value)}
                  rules={[{ type: "required" }]}
                  error={errors.gender}
                />

                <FormField
                  label="Emergency Contact Name"
                  name="emergency_con_name"
                  value={formData.emergency_con_name}
                  onChange={(e) =>
                    onChangeField("emergency_con_name", e.target.value)
                  }
                  rules={[{ type: "required" }]}
                  error={errors.emergency_con_name}
                />

                <FormField
                  label="Emergency Contact Number"
                  name="emergency_con_num"
                  value={formData.emergency_con_num}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (allowOnlyTenDigits(value)) {
                      onChangeField("emergency_con_num", value);
                    }
                  }}
                  rules={[
                    { type: "required" },
                    { type: "length", value: 10, message: "Must be 10 digits" },
                  ]}
                  error={errors.emergency_con_num}
                />

                <FormField
                  label="Email"
                  name="email"
                  value={formData.email}
                  onChange={(e) => onChangeField("email", e.target.value)}
                  rules={[{ type: "required" }, { type: "email" }]}
                  error={errors.email}
                />
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-4 px-2">Assignment</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <FormField
                  label="Select User"
                  name="userId"
                  type="select"
                  value={formData.userId}
                  options={userOptions}
                  onChange={(e) => onChangeField("userId", e.target.value)}
                  rules={[{ type: "required" }]}
                  error={errors.userId}
                />

                <FormField
                  label="Select Home"
                  name="home"
                  type="select"
                  value={formData.home}
                  options={homeOptions}
                  onChange={(e) => onChangeField("home", e.target.value)}
                  rules={[{ type: "required" }]}
                  error={errors.home}
                />
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-4">Device Setup</h3>

              <div className="flex gap-6 mb-4 px-2">
                <label className="flex items-center gap-2 text-black">
                  <input
                    type="checkbox"
                    className="accent-orange-500 scale-150"
                    checked={formData.deviceType === "emfit"}
                    onChange={() => handleDeviceSelect("emfit")}
                    disabled={isView}
                  />
                  Emfit
                </label>

                <label className="flex items-center gap-2 text-black">
                  <input
                    type="checkbox"
                    className="accent-orange-500 scale-150"
                    checked={formData.deviceType === "altum"}
                    onChange={() => handleDeviceSelect("altum")}
                    disabled={isView}
                  />
                  Altum
                </label>
              </div>

              {formData.deviceType && (
                <FormField
                  label={
                    formData.deviceType === "emfit"
                      ? "Enter SR Number"
                      : "Enter Camera ID"
                  }
                  name="deviceValue"
                  value={formData.deviceValue}
                  onChange={(e) => onChangeField("deviceValue", e.target.value)}
                  rules={[{ type: "required" }]}
                  error={errors.deviceValue}
                />
              )}
            </div>
          </div>
          </>
        )}

        <div className="flex justify-end gap-3 pt-6">
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

export default ResidentForm;
