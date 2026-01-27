import React, { useEffect, useState } from "react";
import { IoIosArrowBack } from "react-icons/io";

import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import FormField from "../../components/formField";
import InfoTile from "../../components/formField/infoTile";

import {
  addAlertDetails,
  editAlertDetails,
  viewAlertDetails,
} from "../../redux/actions/alert-action";
import { getDeviceDetails } from "../../redux/actions/device-action";
import { toast } from "react-hot-toast";

import { createFieldUpdater, validateForm } from "../../utils/formUtils";
import { clearAlertState } from "../../redux/slices/alertSlice";
import Breadcrumb from "../../components/formField/breadcrumb";

const AlertForm = ({ mode }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { id: paramId } = useParams();
  const [searchParams] = useSearchParams();
  const queryId = searchParams.get("id");
  const alertId = paramId || queryId;

  const isView = mode === "view";
  const isEdit = mode === "edit";
  const isAdd = mode === "add";

  const { data: devices = [], loading: deviceLoading } = useSelector(
    (state) => state.device
  );

  const { details, loading, error, formStatus } = useSelector(
    (state) => state.alert
  );
  useEffect(() => {
      dispatch(clearAlertState());
    dispatch(getDeviceDetails(100));
  }, [dispatch]);

  const title = isAdd ? "Add Alert" : isEdit ? "Edit Alert" : "Alert Details";
  const buttonLabel = isAdd ? "Add Alert" : "Save";

  const deviceOptions = devices.map((device) => ({
    label: `${device.type} - ${device.sr_num || device.camera_id || "N/A"} (${
      device.resident?.name || "Unknown"
    })`,
    value: device._id,
  }));

  const [formData, setFormData] = useState({
    name: "",
    device: "",
    threshold: "",
    msg: "",
    notification_type: [],
  });

  const [errors, setErrors] = useState({});
  const onChangeField = createFieldUpdater(setFormData, setErrors);

  useEffect(() => {
    if ((isView || isEdit) && alertId) {
      dispatch(viewAlertDetails(alertId));
    }
  }, [dispatch, isView, isEdit, alertId]);

  useEffect(() => {
    if (details && (isView || isEdit)) {
      setFormData({
        name: details.name || "",
        device: details.device?._id || "",
        threshold: details.threshold || "",
        msg: details.msg || "",
        notification_type: details.notification_type || [],
      });
    }
  }, [details, isView, isEdit]);

useEffect(() => {
  if (formStatus && (isAdd || isEdit)) {
    toast.success(isAdd ? "Alert added successfully" : "Alert updated successfully");
    navigate("/alerts");
  }
}, [formStatus, navigate, isAdd, isEdit]);

  useEffect(() => {
    if (error && (isAdd || isEdit)) {
      toast.error("Something went wrong. Please try again.");
    }
  }, [error, isAdd, isEdit]);

  const handleSubmit = () => {
    const isValid = validateForm(formData, setErrors);
    if (!isValid) return;

    if (isAdd) {
      dispatch(addAlertDetails(formData));
    }
    if (isEdit) {
      dispatch(editAlertDetails({ _id: alertId, ...formData }));
    }
  };

  useEffect(() => {
    if (!alertId && !isAdd) {
      navigate(-1);
    }
  }, [alertId, isAdd, navigate]);

  const handleNotificationToggle = (value) => {
    setFormData((prev) => {
      const exists = prev.notification_type.includes(value);

      return {
        ...prev,
        notification_type: exists
          ? prev.notification_type.filter((v) => v !== value)
          : [...prev.notification_type, value],
      };
    });
  };

  const selectedDeviceLabel =
    deviceOptions?.find((d) => d.value === formData.device)?.label || "";

  const notificationTypeLabel =
    formData.notification_type?.length > 0
      ? formData.notification_type
          .map((type) => {
            if (type === "in_app") return "In App Notification";
            if (type === "message") return "Text Message";
            if (type === "mail") return "Mail";
            return type;
          })
          .join(", ")
      : "-";

  return (
    <div>
  <Breadcrumb
    items={[
      { label: "Alert", path: "/alerts" },
      { label: title },
    ]}
  />

    <div>
    

      <div>
        {isView ? (
        <div>
    <p className="text-[28px] leading-[32px] text-[#121212] font-medium px-2 mb-6">
      Alert Details
    </p>

    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-[#EF9421] flex items-center justify-center text-white uppercase font-bold text-lg">
            {formData.name?.charAt(0) || "A"}
          </div>

          <div>
            <h2 className="text-[28px] leading-[32px] mb-2 font-semibold text-gray-900">
              {formData.name || "—"}
            </h2>
            <p className="text-[14px] leading-[14px] text-gray-500">
              Device: {selectedDeviceLabel || "—"}
            </p>
          </div>
        </div>

        <span className="text-sm text-green-600 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-500" />
          Active
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-4 border border-gray-200">
          <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center text-orange-600 font-bold">
            T
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">Threshold</p>
            <p className="text-sm text-gray-900">{formData.threshold || "—"}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-4 border border-gray-200">
          <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
            M
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">Message</p>
            <p className="text-sm text-gray-900">{formData.msg || "—"}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-4 border border-gray-200">
          <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center text-green-600 font-bold">
            N
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">
              Notification Type
            </p>
            <p className="text-sm text-gray-900">
              {notificationTypeLabel || "—"}
            </p>
          </div>
        </div>
      </div>
    </div>

  </div>
        ) : (
          <>
            <p className="text-[28px] leading-[32px] text-[#121212] font-medium px-2 mb-6">  {isAdd ? "Add New Alert" : "Edit Alert"}
</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <FormField
              label="Alert Name"
              name="name"
              value={formData.name}
              onChange={(e) => onChangeField("name", e.target.value)}
              rules={[{ type: "required" }]}
              error={errors.name}
            />

            <FormField
              label="Device"
              name="device"
              type="select"
              value={formData.device}
              options={deviceOptions}
              onChange={(e) => onChangeField("device", e.target.value)}
              disabled={deviceLoading}
              rules={[{ type: "required" }]}
              error={errors.device}
            />

            <FormField
              label="Threshold"
              name="threshold"
              type="number"
              value={formData.threshold}
              onChange={(e) => onChangeField("threshold", e.target.value)}
              rules={[{ type: "required" }]}
              error={errors.threshold}
            />

            <FormField
              label="Message"
              name="msg"
              value={formData.msg}
              onChange={(e) => onChangeField("msg", e.target.value)}
              rules={[{ type: "required" }]}
              error={errors.msg}
            />

            <FormField
              label="Notification Type"
              name="notification_type"
              type="checkbox-group"
              value={formData.notification_type}
              options={[
                { label: "In App Notification", value: "in_app" },
                { label: "Text Message", value: "message" },
                { label: "Mail", value: "mail" },
              ]}
              onChange={handleNotificationToggle}
              rules={[{ type: "required" }]}
              error={errors.notification_type}
            />
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

export default AlertForm;
