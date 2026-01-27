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
import Breadcrumb from "../../components/formField/breadcrumb";

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
  <div>
    <Breadcrumb
      items={[
        { label: "Home", path: "/home" },
        { label: title },
      ]}
    />

    {isView ? (
      <div>
        <p className="text-[28px] leading-[32px] text-[#121212] font-medium px-2 mb-6">
          Home Details
        </p>
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-[#EF9421] flex items-center justify-center text-white uppercase font-bold text-lg">
                {formData.home_name?.charAt(0) || "H"}
              </div>

              <div>
                <h2 className="text-[28px] leading-[32px] mb-2 font-semibold text-gray-900">
                  {formData.home_name || "—"}
                </h2>
                <p className="text-[14px] leading-[14px] text-gray-500">
                  Assigned User: {selectedUserLabel || "—"}
                </p>
              </div>
            </div>

            {/* Status */}
            <span className="text-sm text-green-600 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500" />
              Active
            </span>
          </div>
        </div>

        {/* Resident Details */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
          <h3 className="text-base font-semibold text-gray-900 mb-4">
            Resident Details
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center text-orange-600 font-bold">
                R
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">
                  Resident Name
                </p>
                <p className="text-sm text-gray-900">
                  {formData.residentName || "—"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                @
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">Email</p>
                <p className="text-sm text-gray-900">
                  {formData.email || "—"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center text-green-600 font-bold">
                ☎
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">Phone</p>
                <p className="text-sm text-gray-900">
                  {formData.phone || "—"}
                </p>
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
                <p className="text-sm text-gray-900">
                  {formData.gender || "—"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center text-yellow-600 font-bold">
                E
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">
                  Emergency Contact
                </p>
                <p className="text-sm text-gray-900">
                  {formData.emergency_con_name || "—"}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {formData.emergency_con_num || "—"}
                </p>
              </div>
            </div>
          </div>
        </div>

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
                <p className="text-sm text-gray-900">
                  {formData.deviceType || "—"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="w-10 h-10 rounded-lg bg-gray-200 flex items-center justify-center text-gray-700 font-bold">
                #
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">
                  {formData.deviceType === "Emfit"
                    ? "SR Number"
                    : formData.deviceType === "Eltum"
                    ? "Camera ID"
                    : "Device Value"}
                </p>
                <p className="text-sm text-gray-900">
                  {formData.deviceValue || "—"}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <button
            onClick={() => navigate(-1)}
            className="px-5 py-2 border border-gray-300 rounded-md hover:bg-gray-100 transition"
          >
            Back
          </button>
        </div>
      </div>
    ) : (
      <div>
        <p className="text-[28px] leading-[32px] text-[#121212] font-medium px-2 mb-6">
          {isAdd ? "Add New Home" : "Edit Home"}
        </p>

        <div className="bg-[#ffffff]">
          <h3 className="text-lg font-semibold text-gray-800 mb-2 px-2">
            Basic Information
          </h3>

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
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2 px-2">
            Resident Details
          </h3>

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
              onChange={(e) => onChangeField("emergency_con_name", e.target.value)}
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
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4 px-2">
            Device Setup
          </h3>

          <div className="w-full md:w-1/2">
            <div className="flex gap-6 mb-4 px-2">
              <label className="flex items-center gap-2 text-black">
                <input
                  type="checkbox"
                  className="accent-orange-500 scale-150"
                  checked={formData.deviceType === "Emfit"}
                  onChange={() => handleDeviceSelect("Emfit")}
                />
                Emfit
              </label>

              <label className="flex items-center gap-2 text-black">
                <input
                  type="checkbox"
                  className="accent-orange-500 scale-150"
                  checked={formData.deviceType === "Eltum"}
                  onChange={() => handleDeviceSelect("Eltum")}
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
        </div>

        <div className="flex justify-end gap-3 pt-4">
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
    )}
  </div>
);

};

export default HomeForm;
