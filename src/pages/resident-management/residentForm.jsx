import React, { useEffect, useState } from "react";
import { IoIosArrowBack } from "react-icons/io";

import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import FormField from "../../components/formField";
import InfoTile from "../../components/formField/infoTile";
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
      toast.error("Something went wrong. Please try again.");
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
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
      <div className="flex items-center gap-3 px-6 pt-4">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-full border border-gray-300 hover:bg-gray-100"
        >
          <IoIosArrowBack size={18} />
        </button>
        <h1 className="text-xl font-semibold">{title}</h1>
      </div>

      <div className="p-8 space-y-12 w-full">
        {isView ? (
          <>
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Basic Information
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <InfoTile label="Resident Name" value={formData.name || "-"} />
                <InfoTile label="Resident Age" value={formData.age || "-"} />
                <InfoTile label="Resident Contact Number" value={formData.phone || "-"} />
                <InfoTile label="Resident Gender" value={formData.gender || "-"} />
                <InfoTile label="Emergency Contact Name" value={formData.emergency_con_name || "-"} />
                <InfoTile label="Emergency Contact Number" value={formData.emergency_con_num || "-"} />
                <InfoTile label="Email" value={formData.email || "-"} />
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Assignment
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <InfoTile label="User" value={selectedUserLabel || "-"} />
                <InfoTile label="Home" value={selectedHomeLabel || "-"} />
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Device Setup
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <InfoTile label="Device Type" value={deviceTypeLabel || "-"} />
                <InfoTile label="Device Value" value={formData.deviceValue || "-"} />
              </div>
            </div>
          </>
        ) : (
          <div className="space-y-10 w-full md:w-1/2">
            <div>
              <h3 className="font-medium mb-4">Basic Information</h3>
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
                  onChange={(e) => onChangeField("emergency_con_name", e.target.value)}
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
              <h3 className="font-medium mb-4">Assignment</h3>
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

              <div className="flex gap-6 mb-4">
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
                  label={formData.deviceType === "emfit" ? "Enter SR Number" : "Enter Camera ID"}
                  name="deviceValue"
                  value={formData.deviceValue}
                  onChange={(e) => onChangeField("deviceValue", e.target.value)}
                  rules={[{ type: "required" }]}
                  error={errors.deviceValue}
                />
              )}
            </div>
          </div>
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
  );
};

export default ResidentForm;
