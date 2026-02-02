import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import FormField from "../../components/formField";
import Breadcrumb from "../../components/formField/breadcrumb";

import {
  addAlertDetails,
  editAlertDetails,
  viewAlertDetails,
} from "../../redux/actions/alert-action";
import { clearAlertState } from "../../redux/slices/alertSlice";
import AlertView from "./AlertView";

const DEVICE_CAPABILITIES = {
  altum: { vitalTracker: false, fallDetector: true },
  emfit: { vitalTracker: true, fallDetector: false },
};

const CheckBadge = () => (
  <div className="absolute top-3 right-3 h-5 w-5 rounded-full bg-[#EF9421] text-white flex items-center justify-center text-xs">
    ✓
  </div>
);

const AccordionBox = ({
  title,
  description,
  icon: Icon,
  active,
  onToggle,
  children,
}) => {
  return (
    <div className="mb-4">
      <div
        onClick={onToggle}
        className={`relative cursor-pointer rounded-lg border p-4 transition
          ${
            active
              ? "border-[#EF9421] bg-gradient-to-b from-[#FDF4E9] to-white"
              : "border-gray-200 hover:border-gray-300"
          }`}
      >
        {active && <CheckBadge />}

        <div className="flex items-start gap-3">
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium">{title}</p>
                {description && (
                  <p className="text-sm text-gray-500">{description}</p>
                )}
              </div>
              <span className="text-lg text-gray-400">
                {active ? "−" : "+"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {active && (
        <div className="mt-4 pl-4 border-l border-[#EF9421]">
          {children}
        </div>
      )}
    </div>
  );
};

const AlertForm = ({ mode }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { id: paramId } = useParams();
  const [searchParams] = useSearchParams();
  const alertId = paramId || searchParams.get("id");

  const isAdd = mode === "add";
  const isEdit = mode === "edit";
const isView = mode === "view";

  const { details, loading, error, formStatus } = useSelector(
    (state) => state.alert
  );

  const [formData, setFormData] = useState({
    name: "",
    device: "",

    fallDetector: {
      fallDetection: { enabled: false, type: "", description: "" },
      movementDetected: { enabled: false, type: "", description: "" },
    },

    vitalTracker: {
      sleepQuality: {
        enabled: false,
        infoHours: "",
        infoDesc: "",
        warningHours: "",
        warningDesc: "",
        criticalHours: "",
        criticalDesc: "",
      },

      sleepScore: {
        enabled: false,
        info: "",
        infoDesc: "",
        warning: "",
        warningDesc: "",
        critical: "",
        criticalDesc: "",
      },

      heartRate: {
        enabled: false,
        infoBpm: "",
        infoDesc: "",
        warningBpm: "",
        warningDesc: "",
        criticalBpm: "",
        criticalDesc: "",
      },

      breathingRate: {
        enabled: false,
        infoBpm: "",
        infoDesc: "",
        warningBpm: "",
        warningDesc: "",
        criticalBpm: "",
        criticalDesc: "",
      },

      movements: {
        enabled: false,
      },
    },

    notifications: {
      in_app: false,
      message: false,
      mail: false,
    },
  });

  const updateField = (path, value) => {
    setFormData((prev) => {
      const updated = { ...prev };
      let ref = updated;
      for (let i = 0; i < path.length - 1; i++) {
        ref[path[i]] = { ...ref[path[i]] };
        ref = ref[path[i]];
      }
      ref[path[path.length - 1]] = value;
      return updated;
    });
  };

  const capabilities = DEVICE_CAPABILITIES[formData.device] || {};
  const showFallDetector = capabilities.fallDetector;
  const showVitalTracker = capabilities.vitalTracker;

  useEffect(() => {
    dispatch(clearAlertState());
  }, [dispatch]);

  useEffect(() => {
  if ((isEdit || isView) && alertId) {
    dispatch(viewAlertDetails(alertId));
  }
}, [alertId, isEdit, isView, dispatch]);


  useEffect(() => {
    if (formStatus && (isAdd || isEdit)) {
      toast.success(
        isAdd ? "Alert added successfully" : "Alert updated successfully"
      );
      navigate("/alert");
    }
  }, [formStatus, navigate, isAdd, isEdit]);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      fallDetector: showFallDetector
        ? prev.fallDetector
        : {
            fallDetection: { enabled: false, type: "", description: "" },
            movementDetected: { enabled: false, type: "", description: "" },
          },

      vitalTracker: showVitalTracker
        ? prev.vitalTracker
        : {
            sleepQuality: {
              enabled: false,
              infoHours: "",
              infoDesc: "",
              warningHours: "",
              warningDesc: "",
              criticalHours: "",
              criticalDesc: "",
            },
            sleepScore: {
              enabled: false,
              info: "",
              infoDesc: "",
              warning: "",
              warningDesc: "",
              critical: "",
              criticalDesc: "",
            },
            heartRate: {
              enabled: false,
              infoBpm: "",
              infoDesc: "",
              warningBpm: "",
              warningDesc: "",
              criticalBpm: "",
              criticalDesc: "",
            },
            breathingRate: {
              enabled: false,
              infoBpm: "",
              infoDesc: "",
              warningBpm: "",
              warningDesc: "",
              criticalBpm: "",
              criticalDesc: "",
            },
            movements: { enabled: false },
          },
    }));
  }, [formData.device, showFallDetector, showVitalTracker]);

  const handleFallDetectionToggle = () => {
    updateField(
      ["fallDetector", "fallDetection", "enabled"],
      !formData.fallDetector.fallDetection.enabled
    );
  };

  const handleMovementToggle = () => {
    updateField(
      ["fallDetector", "movementDetected", "enabled"],
      !formData.fallDetector.movementDetected.enabled
    );
  };

  const isAnyAlertEnabled =
    (showFallDetector &&
      (formData.fallDetector.fallDetection.enabled ||
        formData.fallDetector.movementDetected.enabled)) ||
    (showVitalTracker &&
      Object.values(formData.vitalTracker).some((v) => v.enabled));


const buildLevels = (description) => ({
  critical: {
    enabled: true,
    description: description || "",
  },
  warning: {
    enabled: true,
    description: description || "",
  },
  info: {
    enabled: true,
    description: description || "",
  },
});

const buildAlertPayload = (formData) => {
  const isFallDetector = formData.device === "altum";
  const isVitalTracker = formData.device === "emfit";

  const payload = {
    name: formData.name,
    selected_device: isFallDetector ? "Fall Detector" : "Vital Tracker",
    status: "active",
  };

  if (isFallDetector) {
    payload.fall_detector = {
      events: {
        fall_detection: {
          enabled: formData.fallDetector.fallDetection.enabled,
          levels: buildLevels(
            formData.fallDetector.fallDetection.description
          ),
        },
        movement_detected: {
          enabled: formData.fallDetector.movementDetected.enabled,
          levels: buildLevels(
            formData.fallDetector.movementDetected.description
          ),
        },
      },
      notifications: {
        in_app: formData.notifications.in_app,
        text_message: formData.notifications.message,
        mail: formData.notifications.mail,
      },
    };
  }

  if (isVitalTracker) {
    payload.vital_tracker = {
      metrics: {
        sleep_quality: {
          enabled: formData.vitalTracker.sleepQuality.enabled,
          info_hours: {
            value: Number(formData.vitalTracker.sleepQuality.infoHours || 0),
            description: formData.vitalTracker.sleepQuality.infoDesc,
          },
          warning_hours: {
            value: Number(formData.vitalTracker.sleepQuality.warningHours || 0),
            description: formData.vitalTracker.sleepQuality.warningDesc,
          },
          critical_hours: {
            value: Number(formData.vitalTracker.sleepQuality.criticalHours || 0),
            description: formData.vitalTracker.sleepQuality.criticalDesc,
          },
        },

        sleep_score: {
          enabled: formData.vitalTracker.sleepScore.enabled,
          info: {
            value: Number(formData.vitalTracker.sleepScore.info || 0),
            description: formData.vitalTracker.sleepScore.infoDesc,
          },
          warning: {
            value: Number(formData.vitalTracker.sleepScore.warning || 0),
            description: formData.vitalTracker.sleepScore.warningDesc,
          },
          critical: {
            value: Number(formData.vitalTracker.sleepScore.critical || 0),
            description: formData.vitalTracker.sleepScore.criticalDesc,
          },
        },

        heart_rate: {
          enabled: formData.vitalTracker.heartRate.enabled,
          info_bpm: {
            value: Number(formData.vitalTracker.heartRate.infoBpm || 0),
            description: formData.vitalTracker.heartRate.infoDesc,
          },
          warning_bpm: {
            value: Number(formData.vitalTracker.heartRate.warningBpm || 0),
            description: formData.vitalTracker.heartRate.warningDesc,
          },
          critical_bpm: {
            value: Number(formData.vitalTracker.heartRate.criticalBpm || 0),
            description: formData.vitalTracker.heartRate.criticalDesc,
          },
        },

        breathing_rate: {
          enabled: formData.vitalTracker.breathingRate.enabled,
          info_bpm: {
            value: Number(formData.vitalTracker.breathingRate.infoBpm || 0),
            description: formData.vitalTracker.breathingRate.infoDesc,
          },
          warning_bpm: {
            value: Number(formData.vitalTracker.breathingRate.warningBpm || 0),
            description: formData.vitalTracker.breathingRate.warningDesc,
          },
          critical_bpm: {
            value: Number(formData.vitalTracker.breathingRate.criticalBpm || 0),
            description: formData.vitalTracker.breathingRate.criticalDesc,
          },
        },

        movements: {
          enabled: formData.vitalTracker.movements.enabled,
        },
      },

      notifications: {
        in_app: formData.notifications.in_app,
        text_message: formData.notifications.message,
        mail: formData.notifications.mail,
      },
    };
  }

  return payload;
};

const mapApiToFormData = (api) => {
  const isVital = api.selected_device === "Vital Tracker";
  const isFall = api.selected_device === "Fall Detector";
const notifications =
  api.selected_device === "Vital Tracker"
    ? api.vital_tracker?.notifications
    : api.fall_detector?.notifications;

  return {
    name: api.name || "",
    device: isVital ? "emfit" : "altum",

    fallDetector: {
      fallDetection: {
        enabled: api.fall_detector?.events?.fall_detection?.enabled || false,
        type: "critical", 
        description:
          api.fall_detector?.events?.fall_detection?.levels?.critical
            ?.description || "",
      },
      movementDetected: {
        enabled:
          api.fall_detector?.events?.movement_detected?.enabled || false,
        type: "critical",
        description:
          api.fall_detector?.events?.movement_detected?.levels?.critical
            ?.description || "",
      },
    },

    vitalTracker: {
      sleepQuality: {
        enabled: api.vital_tracker?.metrics?.sleep_quality?.enabled || false,
        infoHours:
          api.vital_tracker?.metrics?.sleep_quality?.info_hours?.value ?? "",
        infoDesc:
          api.vital_tracker?.metrics?.sleep_quality?.info_hours?.description ||
          "",
        warningHours:
          api.vital_tracker?.metrics?.sleep_quality?.warning_hours?.value ?? "",
        warningDesc:
          api.vital_tracker?.metrics?.sleep_quality?.warning_hours
            ?.description || "",
        criticalHours:
          api.vital_tracker?.metrics?.sleep_quality?.critical_hours?.value ??
          "",
        criticalDesc:
          api.vital_tracker?.metrics?.sleep_quality?.critical_hours
            ?.description || "",
      },

      sleepScore: {
        enabled: api.vital_tracker?.metrics?.sleep_score?.enabled || false,
        info:
          api.vital_tracker?.metrics?.sleep_score?.info?.value ?? "",
        infoDesc:
          api.vital_tracker?.metrics?.sleep_score?.info?.description || "",
        warning:
          api.vital_tracker?.metrics?.sleep_score?.warning?.value ?? "",
        warningDesc:
          api.vital_tracker?.metrics?.sleep_score?.warning?.description || "",
        critical:
          api.vital_tracker?.metrics?.sleep_score?.critical?.value ?? "",
        criticalDesc:
          api.vital_tracker?.metrics?.sleep_score?.critical?.description || "",
      },

      heartRate: {
        enabled: api.vital_tracker?.metrics?.heart_rate?.enabled || false,
        infoBpm:
          api.vital_tracker?.metrics?.heart_rate?.info_bpm?.value ?? "",
        infoDesc:
          api.vital_tracker?.metrics?.heart_rate?.info_bpm?.description || "",
        warningBpm:
          api.vital_tracker?.metrics?.heart_rate?.warning_bpm?.value ?? "",
        warningDesc:
          api.vital_tracker?.metrics?.heart_rate?.warning_bpm?.description ||
          "",
        criticalBpm:
          api.vital_tracker?.metrics?.heart_rate?.critical_bpm?.value ?? "",
        criticalDesc:
          api.vital_tracker?.metrics?.heart_rate?.critical_bpm?.description ||
          "",
      },

      breathingRate: {
        enabled:
          api.vital_tracker?.metrics?.breathing_rate?.enabled || false,
        infoBpm:
          api.vital_tracker?.metrics?.breathing_rate?.info_bpm?.value ?? "",
        infoDesc:
          api.vital_tracker?.metrics?.breathing_rate?.info_bpm?.description ||
          "",
        warningBpm:
          api.vital_tracker?.metrics?.breathing_rate?.warning_bpm?.value ?? "",
        warningDesc:
          api.vital_tracker?.metrics?.breathing_rate?.warning_bpm
            ?.description || "",
        criticalBpm:
          api.vital_tracker?.metrics?.breathing_rate?.critical_bpm?.value ??
          "",
        criticalDesc:
          api.vital_tracker?.metrics?.breathing_rate?.critical_bpm
            ?.description || "",
      },

      movements: {
        enabled:
          api.vital_tracker?.metrics?.movements?.enabled || false,
      },
    },

    notifications: {
  in_app: notifications?.in_app || false,
  message: notifications?.text_message || false,
  mail: notifications?.mail || false,
},
  };
};


  useEffect(() => {
  if (details && (isEdit || isView)) {
    setFormData(mapApiToFormData(details));
  }
}, [details, isEdit, isView]);

const handleSubmit = () => {
  const payload = buildAlertPayload(formData);

  console.log(payload)
  if (isAdd) dispatch(addAlertDetails(payload));
  if (isEdit) dispatch(editAlertDetails({ _id: alertId, ...payload }));
};



  return (
    <div>
      <Breadcrumb
  items={[
    { label: "Alert", path: "/alert" },
    {
      label: isView
        ? "Alert Details"
        : isAdd
        ? "Add Alert"
        : "Edit Alert",
    },
  ]}
/>
      
 {isView ? (
  <>
   <p className="text-[28px] px-2 font-medium mb-6">
        View Alert
      </p>

      <AlertView
        formData={formData}
        onEdit={() => navigate(`/alert/edit?id=${alertId}`)}
        />
        </>
    ) : (
<>

      <p className="text-[28px] px-2 font-medium mb-6">
        {isAdd ? "Add New Alert" : "Edit Alert"}
      </p>

        <div className="grid grid-cols-2 gap-5 mb-10">
          <FormField
            label="Alert Name"
            value={formData.name}
            onChange={(e) => updateField(["name"], e.target.value)}
          />

        <div className="col-span-2">
    <label className="block text-sm font-medium mb-2">Device</label>

    <div className="grid grid-cols-2 gap-4">
          <div
        onClick={() => updateField(["device"], "altum")}
        className={`relative cursor-pointer rounded-lg border p-4 transition
          ${
            formData.device === "altum"
              ? "border-[#EF9421] bg-gradient-to-b from-[#FDF4E9] to-white"
              : "border-gray-200 hover:border-gray-300"
          }`}
      >
        {formData.device === "altum" && <CheckBadge />}
        <p className="font-medium">Fall Detector</p>
        <p className="text-sm text-gray-500">
          Detect falls and movements
        </p>
      </div>
    <div
        onClick={() => updateField(["device"], "emfit")}
        className={`relative cursor-pointer rounded-lg border p-4 transition
          ${
            formData.device === "emfit"
              ? "border-[#EF9421] bg-gradient-to-b from-[#FDF4E9] to-white"
              : "border-gray-200 hover:border-gray-300"
          }`}
      >
        {formData.device === "emfit" && <CheckBadge />}

        <p className="font-medium">Vital Tracker</p>
        <p className="text-sm text-gray-500">
          Sleep, heart rate & vitals monitoring
              </p>
            </div>
          </div>
        </div>
      </div>

        {showFallDetector && (
          <div className="mb-10">
            <h3 className="text-lg font-medium mb-4">Fall Detector</h3>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div
                onClick={handleFallDetectionToggle}
                className={`relative cursor-pointer rounded-lg border p-4 transition ${
                  formData.fallDetector.fallDetection.enabled
                    ? "border-[#EF9421] bg-gradient-to-b from-[#FDF4E9] to-white"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
        {formData.fallDetector.fallDetection.enabled  && <CheckBadge />}
                <p className="font-medium">Fall Detection</p>
              </div>

              <div
                onClick={handleMovementToggle}
                className={`relative cursor-pointer rounded-lg border p-4 transition ${
                  formData.fallDetector.movementDetected.enabled
                    ? "border-[#EF9421] bg-gradient-to-b from-[#FDF4E9] to-white"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
        {formData.fallDetector.movementDetected.enabled  && <CheckBadge />}

                <p className="font-medium">Movement Detected</p>
              </div>
            </div>

           {/* Fall Detection Fields */}
{formData.fallDetector.fallDetection.enabled && (
  <div className="grid grid-cols-2 gap-4 mb-4">
    <FormField
      label="Fall Type"
      type="select"
      options={[
        { label: "Critical", value: "critical" },
        { label: "Warning", value: "warning" },
        { label: "Info", value: "info" },
      ]}
      value={formData.fallDetector.fallDetection.type}
      onChange={(e) =>
        updateField(
          ["fallDetector", "fallDetection", "type"],
          e.target.value
        )
      }
    />

    <FormField
      label="Fall Description"
      value={formData.fallDetector.fallDetection.description}
      onChange={(e) =>
        updateField(
          ["fallDetector", "fallDetection", "description"],
          e.target.value
        )
      }
    />
  </div>
)}

{/* Movement Detection Fields */}
{formData.fallDetector.movementDetected.enabled && (
  <div className="grid grid-cols-2 gap-4">
    <FormField
      label="Movement Type"
      type="select"
      options={[
        { label: "Critical", value: "critical" },
        { label: "Warning", value: "warning" },
        { label: "Info", value: "info" },
      ]}
      value={formData.fallDetector.movementDetected.type}
      onChange={(e) =>
        updateField(
          ["fallDetector", "movementDetected", "type"],
          e.target.value
        )
      }
    />

    <FormField
      label="Movement Description"
      value={formData.fallDetector.movementDetected.description}
      onChange={(e) =>
        updateField(
          ["fallDetector", "movementDetected", "description"],
          e.target.value
        )
      }
    />
  </div>
)}

          </div>
        )}

        {showVitalTracker && (
          <div className="mb-10">
            <h3 className="text-lg font-medium mb-4">Vital Tracker</h3>

            <AccordionBox
              title="Sleep Quality"
              active={formData.vitalTracker.sleepQuality.enabled}
              onToggle={() =>
                updateField(
                  ["vitalTracker", "sleepQuality", "enabled"],
                  !formData.vitalTracker.sleepQuality.enabled
                )
              }
            >
              <div className="grid grid-cols-3 gap-4">
                <FormField 
                  label="Info Hours" 
                  value={formData.vitalTracker.sleepQuality.infoHours}
                  onChange={(e) => updateField(["vitalTracker", "sleepQuality", "infoHours"], e.target.value)}
                />
                <FormField 
                  label="Warning Hours" 
                  value={formData.vitalTracker.sleepQuality.warningHours}
                  onChange={(e) => updateField(["vitalTracker", "sleepQuality", "warningHours"], e.target.value)}
                /> 
                <FormField 
                  label="Critical Hours" 
                  value={formData.vitalTracker.sleepQuality.criticalHours}
                  onChange={(e) => updateField(["vitalTracker", "sleepQuality", "criticalHours"], e.target.value)}
                />
                <FormField 
                  label="Info Description" 
                  value={formData.vitalTracker.sleepQuality.infoDesc}
                  onChange={(e) => updateField(["vitalTracker", "sleepQuality", "infoDesc"], e.target.value)}
                />
                <FormField 
                  label="Warning Description" 
                  value={formData.vitalTracker.sleepQuality.warningDesc}
                  onChange={(e) => updateField(["vitalTracker", "sleepQuality", "warningDesc"], e.target.value)}
                />
                <FormField 
                  label="Critical Description" 
                  value={formData.vitalTracker.sleepQuality.criticalDesc}
                  onChange={(e) => updateField(["vitalTracker", "sleepQuality", "criticalDesc"], e.target.value)}
                />
              </div>
            </AccordionBox>

            {/* Sleep Score */}
            <AccordionBox
              title="Sleep Score"
              active={formData.vitalTracker.sleepScore.enabled}
              onToggle={() =>
                updateField(
                  ["vitalTracker", "sleepScore", "enabled"],
                  !formData.vitalTracker.sleepScore.enabled
                )
              }
            >
              <div className="grid grid-cols-3 gap-4">
                <FormField 
                  label="Info" 
                  value={formData.vitalTracker.sleepScore.info}
                  onChange={(e) => updateField(["vitalTracker", "sleepScore", "info"], e.target.value)}
                />
                <FormField 
                  label="Warning" 
                  value={formData.vitalTracker.sleepScore.warning}
                  onChange={(e) => updateField(["vitalTracker", "sleepScore", "warning"], e.target.value)}
                />
                <FormField 
                  label="Critical" 
                  value={formData.vitalTracker.sleepScore.critical}
                  onChange={(e) => updateField(["vitalTracker", "sleepScore", "critical"], e.target.value)}
                />
                <FormField 
                  label="Info Description" 
                  value={formData.vitalTracker.sleepScore.infoDesc}
                  onChange={(e) => updateField(["vitalTracker", "sleepScore", "infoDesc"], e.target.value)}
                />
                <FormField 
                  label="Warning Description" 
                  value={formData.vitalTracker.sleepScore.warningDesc}
                  onChange={(e) => updateField(["vitalTracker", "sleepScore", "warningDesc"], e.target.value)}
                />
                <FormField 
                  label="Critical Description" 
                  value={formData.vitalTracker.sleepScore.criticalDesc}
                  onChange={(e) => updateField(["vitalTracker", "sleepScore", "criticalDesc"], e.target.value)}
                />
              </div>
            </AccordionBox>

            <AccordionBox
              title="Heart Rate"
              active={formData.vitalTracker.heartRate.enabled}
              onToggle={() =>
                updateField(
                  ["vitalTracker", "heartRate", "enabled"],
                  !formData.vitalTracker.heartRate.enabled
                )
              }
            >
              <div className="grid grid-cols-3 gap-4">
                <FormField 
                  label="Info BPM" 
                  value={formData.vitalTracker.heartRate.infoBpm}
                  onChange={(e) => updateField(["vitalTracker", "heartRate", "infoBpm"], e.target.value)}
                />
                <FormField 
                  label="Warning BPM" 
                  value={formData.vitalTracker.heartRate.warningBpm}
                  onChange={(e) => updateField(["vitalTracker", "heartRate", "warningBpm"], e.target.value)}
                />
                <FormField 
                  label="Critical BPM" 
                  value={formData.vitalTracker.heartRate.criticalBpm}
                  onChange={(e) => updateField(["vitalTracker", "heartRate", "criticalBpm"], e.target.value)}
                />
                <FormField 
                  label="Info Description" 
                  value={formData.vitalTracker.heartRate.infoDesc}
                  onChange={(e) => updateField(["vitalTracker", "heartRate", "infoDesc"], e.target.value)}
                />
                <FormField 
                  label="Warning Description" 
                  value={formData.vitalTracker.heartRate.warningDesc}
                  onChange={(e) => updateField(["vitalTracker", "heartRate", "warningDesc"], e.target.value)}
                />
                <FormField 
                  label="Critical Description" 
                  value={formData.vitalTracker.heartRate.criticalDesc}
                  onChange={(e) => updateField(["vitalTracker", "heartRate", "criticalDesc"], e.target.value)}
                />
              </div>
            </AccordionBox>

            <AccordionBox
              title="Breathing Rate"
              active={formData.vitalTracker.breathingRate.enabled}
              onToggle={() =>
                updateField(
                  ["vitalTracker", "breathingRate", "enabled"],
                  !formData.vitalTracker.breathingRate.enabled
                )
              }
            >
              <div className="grid grid-cols-3 gap-4">
                <FormField 
                  label="Info BPM" 
                  value={formData.vitalTracker.breathingRate.infoBpm}
                  onChange={(e) => updateField(["vitalTracker", "breathingRate", "infoBpm"], e.target.value)}
                />
                <FormField 
                  label="Warning BPM" 
                  value={formData.vitalTracker.breathingRate.warningBpm}
                  onChange={(e) => updateField(["vitalTracker", "breathingRate", "warningBpm"], e.target.value)}
                />
                <FormField 
                  label="Critical BPM" 
                  value={formData.vitalTracker.breathingRate.criticalBpm}
                  onChange={(e) => updateField(["vitalTracker", "breathingRate", "criticalBpm"], e.target.value)}
                />
                <FormField 
                  label="Info Description" 
                  value={formData.vitalTracker.breathingRate.infoDesc}
                  onChange={(e) => updateField(["vitalTracker", "breathingRate", "infoDesc"], e.target.value)}
                />
                <FormField 
                  label="Warning Description" 
                  value={formData.vitalTracker.breathingRate.warningDesc}
                  onChange={(e) => updateField(["vitalTracker", "breathingRate", "warningDesc"], e.target.value)}
                />
                <FormField 
                  label="Critical Description" 
                  value={formData.vitalTracker.breathingRate.criticalDesc}
                  onChange={(e) => updateField(["vitalTracker", "breathingRate", "criticalDesc"], e.target.value)}
                />
              </div>
            </AccordionBox>

            {/* Movements */}
            <AccordionBox
              title="Movements"
              active={formData.vitalTracker.movements.enabled}
              onToggle={() =>
                updateField(
                  ["vitalTracker", "movements", "enabled"],
                  !formData.vitalTracker.movements.enabled
                )
              }
            >
              <p className="text-sm text-gray-500">
                Detect unusual movement patterns.
              </p>
            </AccordionBox>
          </div>
        )}

        {isAnyAlertEnabled && (

        <div className="mb-10">
          <h3 className="text-lg font-medium mb-4">Notifications</h3>

          <div className="grid grid-cols-3 gap-4">
  {[
    { key: "in_app", label: "In App" },
    { key: "message", label: "Text Message" },
    { key: "mail", label: "Mail" },
  ].map((n) => (
    <div
      key={n.key}
      onClick={() =>
        updateField(
          ["notifications", n.key],
          !formData.notifications[n.key]
        )
      }
      className={`relative cursor-pointer rounded-lg border p-4 transition ${
        formData.notifications[n.key]
          ? "border-[#EF9421] bg-gradient-to-b from-[#FDF4E9] to-white"
          : "border-gray-200 hover:border-gray-300"
      }`}
    >
      {formData.notifications[n.key] && <CheckBadge />}

      <p className="font-medium">{n.label}</p>
    </div>
  ))}
</div>

        </div>
  )}
        <div className="flex justify-end gap-3">
          <button onClick={() => navigate(-1)} className="px-5 py-2 border rounded-md">
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-6 py-2 rounded-md bg-[#EF9421] text-white"
          >
            {loading ? "Saving..." : isAdd ? "Add Alert" : "Save"}
          </button>
      </div>
</>
  )}
      </div>
    );
  };

  export default AlertForm;
