import React, { useEffect, useState } from "react";
import { IoIosArrowBack } from "react-icons/io";

import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import FormField from "../../components/formField";
import InfoTile from "../../components/formField/infoTile";
import {
  addHomeDetails,
  editHomeDetails,
  viewHomeDetails,
} from "../../redux/actions/home-action";
import { getUserDetails } from "../../redux/actions/user-action";
import { toast } from "react-hot-toast";
import {
  createFieldUpdater,
  validateForm,
  allowOnlyTenDigits,
} from "../../utils/formUtils";

const HomeForm = ({ mode }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { id: paramId } = useParams();
  const [searchParams] = useSearchParams();
  const queryId = searchParams.get("id");
  const homeId = paramId || queryId;

  const isView = mode === "view";
  const isEdit = mode === "edit";
  const isAdd = mode === "add";

  const title = isAdd ? "Add Home" : isEdit ? "Edit Home" : "Home Details";
  const buttonLabel = isAdd ? "Add Home" : "Save";

  const { details, loading, error, formStatus } = useSelector(
    (state) => state.home
  );

  const users = useSelector((state) => state.user?.data);

  useEffect(() => {
    dispatch(getUserDetails({ limit: 100 }));
  }, [dispatch]);

  const userOptions = users?.map((user) => ({
    label: `${user.first_name} ${user.last_name || ""}`,
    value: user._id,
  }));

  const GenderOptions = [
    { label: "Male", value: "male" },
    { label: "Female", value: "female" },
  ];

  const [formData, setFormData] = useState({
    userId: "",
    residentId: "",
    deviceId: "",
    homeId: "",
    homeName: "",
    residentName: "",
    email: "",
    home_name: "",
    phone: "",
    age: "",
    gender: "",
    emergency_con_name: "",
    emergency_con_num: "",
    deviceType: "",
    deviceValue: "",
  });

  const [errors, setErrors] = useState({});
  const onChangeField = createFieldUpdater(setFormData, setErrors);

  useEffect(() => {
    if ((isView || isEdit) && homeId) {
      dispatch(viewHomeDetails(homeId));
    }
  }, [dispatch, isView, isEdit, homeId]);

  useEffect(() => {
    if (details && (isView || isEdit)) {
      const hasCameraId = !!details.devices?.camera_id;
      const hasSrNum = !!details.devices?.sr_num;
      setFormData({
        userId: details.user_id || "",
        homeId: details._id || "",
        residentId: details.resident?._id || "",
        deviceId: details.device?._id || "",

        residentName: details.resident?.name || "",
        email: details.resident?.email || "",
        phone: details.resident?.phone || "",
        age: details.resident?.age || "",
        gender: details.resident?.gender || "",
        emergency_con_name: details.resident?.emergency_con_name || "",
        emergency_con_num: details.resident?.emergency_con_num || "",
        home_name: details.name || "",

        deviceType: hasCameraId ? "Eltum" : hasSrNum ? "Emfit" : "",
        deviceValue: hasCameraId
          ? details.devices.camera_id
          : hasSrNum
          ? details.devices.sr_num
          : "",
      });
    }
  }, [details, isView, isEdit]);

  useEffect(() => {
    if (formStatus) {
      toast.success(
        isAdd ? "Resident added successfully" : "Resident updated successfully"
      );
      navigate("/home");
    }
  }, [formStatus, navigate, isAdd]);

  useEffect(() => {
    if (error && (isAdd || isEdit)) {
      toast.error("Something went wrong. Please try again.");
    }
  }, [error, isAdd, isEdit]);

  const handleSubmit = () => {
    const isValid = validateForm(formData, setErrors);
    if (!isValid) return;

    const payload = {
      name: formData.residentName,
      user_id: formData.userId,

      resident_name: formData.residentName,
      resident_email: formData.email,
      resident_phone: formData.phone,
      resident_age: Number(formData.age),
      resident_gender: formData.gender,

      resident_medication: "",
      resident_emergency_condition: "",
      resident_emergency_con_name: formData.emergency_con_name,
      resident_emergency_con_num: Number(formData.emergency_con_num),

      home_name: formData.home_name,
      creator: formData.userId,
      device_type: formData.deviceType,
      camera_id: formData.deviceType === "Eltum" ? formData.deviceValue : "",
      device_sr_num: formData.deviceType === "Emfit" ? formData.deviceValue : "",
    };

    if (isAdd) {
      dispatch(addHomeDetails(payload));
    }

    if (isEdit) {
      dispatch(
    editHomeDetails({
      _id: homeId,
      resident_id: formData.residentId,
      device_id: formData.deviceId,
      ...payload,
    })
  );
}
  };
  const selectedUserLabel =
    userOptions?.find((u) => u.value === formData.userId)?.label || "";

  const handleDeviceSelect = (type) => {
    setFormData((prev) => ({
      ...prev,
      deviceType: prev.deviceType === type ? "" : type,
      deviceValue: "",
    }));
  };

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
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Basic Information
          </h3>

          {isView ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <InfoTile label="User" value={selectedUserLabel || "-"} />
              <InfoTile label="Home Name" value={formData.home_name || "-"} />
            </div>
          ) : (
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
                label="Add Home Name"
                name="home_name"
                value={formData.home_name}
                onChange={(e) => onChangeField("home_name", e.target.value)}
                rules={[{ type: "required" }]}
                error={errors.home_name}
              />
            </div>
          )}
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Resident Details
          </h3>

          {isView ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <InfoTile label="Resident Name" value={formData.residentName || "-"} />
              <InfoTile label="Resident Email" value={formData.email || "-"} />
              <InfoTile label="Resident Number" value={formData.phone || "-"} />
              <InfoTile label="Resident Age" value={formData.age || "-"} />
              <InfoTile label="Resident Gender" value={formData.gender || "-"} />
              <InfoTile
                label="Emergency Contact Name"
                value={formData.emergency_con_name || "-"}
              />
              <InfoTile
                label="Emergency Contact Number"
                value={formData.emergency_con_num || "-"}
              />
            </div>
          ) : (
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <FormField
                label="Resident Name"
                name="residentName"
                value={formData.residentName}
                onChange={(e) => onChangeField("residentName", e.target.value)}
                rules={[{ type: "required" }]}
                error={errors.residentName}
              />

              <FormField
                label="Resident Email"
                name="email"
                value={formData.email}
                onChange={(e) => onChangeField("email", e.target.value)}
                rules={[{ type: "required" }, { type: "email" }]}
                error={errors.email}
              />

              <FormField
                label="Resident Number"
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
                label="Resident Gender"
                name="gender"
                type="select"
                value={formData.gender}
                options={GenderOptions}
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
                type="text"
                value={formData.emergency_con_num}
                onChange={(e) => {
                  const value = e.target.value;
                  if (allowOnlyTenDigits(value)) {
                    onChangeField("emergency_con_num", value);
                  }
                }}
                rules={[{ type: "required" }, { type: "length", value: 10 }]}
                error={errors.emergency_con_num}
              />
            </div>
          )}
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Device Setup</h3>

          {isView ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <InfoTile label="Device Type" value={formData.deviceType || "-"} />
              <InfoTile
                label={
                  formData.deviceType === "Emfit"
                    ? "SR Number"
                    : formData.deviceType === "Eltum"
                    ? "Camera ID"
                    : "Device Value"
                }
                value={formData.deviceValue || "-"}
              />
            </div>
          ) : (
            <div className="w-full md:w-1/2">
              <div className="flex gap-6 mb-4">
                <label className="flex items-center gap-2 text-black">
                  <input
                    type="checkbox"
                    className="accent-orange-500 scale-150"
                    checked={formData.deviceType === "Emfit"}
                    onChange={() => handleDeviceSelect("Emfit")}
                    disabled={isView}
                  />
                  Emfit
                </label>

                <label className="flex items-center gap-2 text-black">
                  <input
                    type="checkbox"
                    className="accent-orange-500 scale-150"
                    checked={formData.deviceType === "Eltum"}
                    onChange={() => handleDeviceSelect("Eltum")}
                    disabled={isView}
                  />
                  Altum
                </label>
              </div>

              {formData.deviceType && (
                <FormField
                  label={
                    formData.deviceType === "Emfit"
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
          )}
        </div>

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
  );
};

export default HomeForm;
