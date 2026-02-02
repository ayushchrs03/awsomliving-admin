import React from "react";
import { FaPencil } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

const SelectableRow = ({ title, description, selected, details = [] }) => {
  return (
    <div
      className={`rounded-xl shadow-sm p-4 transition-all
        ${selected ? "border-[#EF9421] bg-orange-50" : "border-gray-200"}
      `}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="font-medium text-gray-900">{title}</p>

          {description && (
            <p className="text-sm text-gray-500 mt-1">{description}</p>
          )}

          {/* ---- VALUES SECTION ---- */}
          {details.length > 0 && (
            <div className="mt-3 space-y-1 text-xs text-gray-600">
              {details.map((item, index) => (
                <p key={index}>
                  <span className="font-medium">{item.label}:</span>{" "}
                  {item.value}
                </p>
              ))}
            </div>
          )}
        </div>

        {selected && (
          <span className="h-6 w-6 flex items-center justify-center rounded-full bg-[#EF9421] text-white text-sm">
            ✓
          </span>
        )}
      </div>
    </div>
  );
};


const NotificationCard = ({ label, enabled }) => (
  <div
    className={`rounded-xl shadow-sm p-4 flex items-center justify-between transition-all
      ${
        enabled
          ? "bg-orange-50 ring-1 ring-[#EF9421]"
          : "bg-white"
      }
    `}
  >
    <div>
      <p className="text-sm font-medium text-gray-900">{label}</p>
    </div>

    {enabled && (
      <span className="h-6 w-6 flex items-center justify-center rounded-full bg-[#EF9421] text-white text-sm">
        ✓
      </span>
    )}
  </div>
);


const AlertView = ({ formData, onEdit }) => {
  const navigate = useNavigate()

  console.log(formData,"AYUSSHSHSH")
  const deviceLabel =
    formData.device === "altum"
      ? "Fall Detector"
      : formData.device === "emfit"
        ? "Vital Tracker"
        : "—";

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">
            {formData.name || "Unnamed Alert"}
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Device: {deviceLabel}
          </p>
        </div>

        <button
          onClick={onEdit}
          className="h-8 w-8 flex items-center justify-center rounded-full bg-[#EF9421] text-white text-xs"
        >
          <FaPencil/>
        </button>
      </div>

      {formData.device === "altum" && (
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h3 className="font-semibold mb-4">Fall Detector</h3>

         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
  {formData.fallDetector.fallDetection.enabled && (
    <SelectableRow
      title="Fall Detection"
      selected
      details={[
        { label: "Type", value: formData.fallDetector.fallDetection.type },
        { label: "Description", value: formData.fallDetector.fallDetection.description },
      ]}
    />
  )}

  {formData.fallDetector.movementDetected.enabled && (
    <SelectableRow
      title="Movement Detected"
      selected
      details={[
        { label: "Type", value: formData.fallDetector.movementDetected.type },
        { label: "Description", value: formData.fallDetector.movementDetected.description },
      ]}
    />
  )}
</div>

        </div>
      )}

      {formData.device === "emfit" && (
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h3 className="font-semibold mb-4">Vital Tracker</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
           {Object.entries(formData.vitalTracker)
  .filter(([, metric]) => metric.enabled)
  .map(([key, metric]) => {
    const title = key.replace(/([A-Z])/g, " $1");

    let details = [];

    if (key === "sleepQuality") {
      details = [
        { label: "Info", value: `${metric.infoHours} hrs – ${metric.infoDesc}` },
        { label: "Warning", value: `${metric.warningHours} hrs – ${metric.warningDesc}` },
        { label: "Critical", value: `${metric.criticalHours} hrs – ${metric.criticalDesc}` },
      ];
    }

    if (key === "sleepScore") {
      details = [
        { label: "Info", value: `${metric.info} – ${metric.infoDesc}` },
        { label: "Warning", value: `${metric.warning} – ${metric.warningDesc}` },
        { label: "Critical", value: `${metric.critical} – ${metric.criticalDesc}` },
      ];
    }

    if (key === "heartRate") {
      details = [
        { label: "Info", value: `${metric.infoBpm} bpm – ${metric.infoDesc}` },
        { label: "Warning", value: `${metric.warningBpm} bpm – ${metric.warningDesc}` },
        { label: "Critical", value: `${metric.criticalBpm} bpm – ${metric.criticalDesc}` },
      ];
    }

    if (key === "breathingRate") {
      details = [
        { label: "Info", value: `${metric.infoBpm} bpm – ${metric.infoDesc}` },
        { label: "Warning", value: `${metric.warningBpm} bpm – ${metric.warningDesc}` },
        { label: "Critical", value: `${metric.criticalBpm} bpm – ${metric.criticalDesc}` },
      ];
    }

    if (key === "movements") {
      details = [{ label: "Status", value: "Movement monitoring enabled" }];
    }

    return (
      <SelectableRow
        key={key}
        title={title}
        selected
        details={details}
      />
    );
  })}


          </div>
        </div>
      )}

      <div className="bg-white rounded-xl p-6 shadow-sm">

        <h3 className="font-semibold mb-4">Notifications</h3>
{console.log(formData)}
        <div className="grid grid-cols-3 sm:grid-cols-3 gap-4">
          <NotificationCard
            label="In App"
            enabled={formData.notifications.in_app}
          />
          <NotificationCard
            label="Text Message"
            enabled={formData.notifications.message}
          />
          <NotificationCard
            label="Email"
            enabled={formData.notifications.mail}
          />
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
    </>
  );
};

export default AlertView;
