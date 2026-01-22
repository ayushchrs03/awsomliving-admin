import React, { useEffect, useState } from "react";
import { IoIosArrowBack } from "react-icons/io";

import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import FormField from "../../components/formField";
import InfoTile from "../../components/formField/infoTile";
import {
  addDeviceDetails,
  editDeviceDetails,
  viewDeviceDetails,
} from "../../redux/actions/device-action";
import { getResidentDetails } from "../../redux/actions/resident-action";
import { toast } from "react-hot-toast";
import { createFieldUpdater, validateForm } from "../../utils/formUtils";

const DeviceForm = ({ mode }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { id: paramId } = useParams();
  const [searchParams] = useSearchParams();
  const queryId = searchParams.get("id");
  const deviceId = paramId || queryId;

  const isView = mode === "view";
  const isEdit = mode === "edit";
  const isAdd = mode === "add";

  const title = isAdd ? "Add Device" : isEdit ? "Edit Device" : "Device Details";
  const buttonLabel = isAdd ? "Add Device" : "Save";

  const { details, loading, error, formStatues } = useSelector(
    (state) => state.device
  );

  const [formData, setFormData] = useState({
    type: "",
    camera_id: "",
    sr_num: "",
    resident: "",
  });

  const [residentOptions, setResidentOptions] = useState([]);
  const [errors, setErrors] = useState({});
  const onChangeField = createFieldUpdater(setFormData, setErrors);

  useEffect(() => {
    dispatch(getResidentDetails({ limit: 100 }))
      .then((res) => {
        const options = res?.payload?.data?.map((resident) => ({
          label: resident.name,
          value: resident._id,
        }));
        setResidentOptions(options || []);
      })
      .catch(() => setResidentOptions([]));
  }, [dispatch]);

  useEffect(() => {
    if ((isView || isEdit) && deviceId) {
      dispatch(viewDeviceDetails(deviceId));
    }
  }, [dispatch, isView, isEdit, deviceId]);

  useEffect(() => {
    if (details && (isView || isEdit) && residentOptions.length > 0) {
      setFormData((prev) => ({
        ...prev,
        type: details.type || "",
        camera_id: details.camera_id || "",
        sr_num: details.sr_num || "",
        resident:
          typeof details.resident === "object"
            ? details.resident._id
            : details.resident || "",
      }));
    }
  }, [details, residentOptions, isView, isEdit]);

  const selectedResidentLabel =
    residentOptions?.find((r) => r.value === formData.resident)?.label || "";

  useEffect(() => {
    if (formStatues) {
      toast.success(isAdd ? "Device added successfully" : "Device updated successfully");
      navigate("/devices");
    }
  }, [formStatues, navigate, isAdd, isEdit]);

  useEffect(() => {
    if (error && (isAdd || isEdit)) {
      toast.error("Something went wrong. Please try again.");
    }
  }, [error, isAdd, isEdit]);

  const handleSubmit = () => {
    const isValid = validateForm(formData, setErrors);
    if (!isValid) return;

    const payload = {
      type: formData.type,
      camera_id: formData.type === "Eltum" ? formData.camera_id : "",
      sr_num: formData.type === "Emfit" ? formData.sr_num : "",
      resident: formData.resident,
    };

    if (isAdd) {
      dispatch(addDeviceDetails(payload));
    }

    if (isEdit) {
      dispatch(
        editDeviceDetails({
          _id: deviceId,
          ...payload,
        })
      );
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
      <div className="flex items-center gap-3 px-6 pt-4">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-full border hover:bg-gray-100"
        >
          <IoIosArrowBack size={18} />
        </button>
        <h1 className="text-xl font-semibold">{title}</h1>
      </div>

      <div className="p-8 space-y-10 w-full">
        {isView ? (
          <>
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Device Information
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <InfoTile label="Resident" value={selectedResidentLabel || "-"} />
              <InfoTile label="Device Type" value={formData.type || "-"} />

              {formData.type === "Eltum" && (
                <InfoTile label="Camera ID" value={formData.camera_id || "-"} />
              )}

              {formData.type === "Emfit" && (
                <InfoTile label="SR Number" value={formData.sr_num || "-"} />
              )}
            </div>
          </>
        ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <FormField
              label="Resident"
              name="resident"
              type="select"
              value={formData.resident}
              options={residentOptions}
              onChange={(e) => onChangeField("resident", e.target.value)}
              rules={[{ type: "required" }]}
              error={errors.resident}
            />
            <FormField
              label="Device Type"
              name="type"
              type="select"
              value={formData.type}
              options={[
                { label: "Emfit", value: "Emfit" },
                { label: "Eltum", value: "Eltum" },
              ]}
              onChange={(e) => onChangeField("type", e.target.value)}
              rules={[{ type: "required" }]}
              error={errors.type}
            />

            {formData.type === "Eltum" && (
              <FormField
                label="Camera ID"
                name="camera_id"
                value={formData.camera_id}
                onChange={(e) => onChangeField("camera_id", e.target.value)}
                rules={[{ type: "required" }]}
                error={errors.camera_id}
              />
            )}

            {formData.type === "Emfit" && (
              <FormField
                label="SR Number"
                name="sr_num"
                value={formData.sr_num}
                onChange={(e) => onChangeField("sr_num", e.target.value)}
                rules={[{ type: "required" }]}
                error={errors.sr_num}
              />
            )}
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
  );
};

export default DeviceForm;
