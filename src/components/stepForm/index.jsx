import React, { useEffect, useState } from "react";
import FormField from "../formField";
import client from "../../redux/axios-baseurl";
import Loading from "../../components/loader";
import { validateForm, allowOnlyTenDigits } from "../../utils/formUtils";
import Breadcrumb from "../../components/formField/breadcrumb";
import { SiStackblitz } from "react-icons/si";
import { IoAnalyticsOutline } from "react-icons/io5";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";


function SetupWizardModal({ onClose }) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const steps = ["User Details", "Home & Devices", "Resident Details"];

  const [user, setUser] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
  });

  const [home, setHome] = useState({ name: "" });

  const [resident, setResident] = useState({
    name: "",
    phone: "",
    age: "",
    gender: "",
    email: "",
    emergency_con_name: "",
    emergency_con_num: "",
  });

  const [device, setDevice] = useState({
    type: "",
    camera_id: "",
    sr_num: "",
  });

  // ✅ Clear errors when step changes
  useEffect(() => {
    setErrors({});
  }, [step]);

  const handleDeviceSelect = (type) => {
    setDevice({ type, camera_id: "", sr_num: "" });
    setErrors((prev) => ({ ...prev, type: "" }));
  };

  const buildPayload = () => ({
    user: { ...user },
    home: { ...home },
    resident: { ...resident, age: Number(resident.age) },
    device: {
      type:
        device.type === "altum"
          ? "Eltum"
          : device.type === "emfit"
            ? "Emfit"
            : "",
      camera_id: device.camera_id || "",
      sr_num: device.sr_num || "",
    },
  });

  const navigate = useNavigate()
 const submitQuickSetup = async () => {
  try {
    setLoading(true);
    const payload = buildPayload();
    const res = await client.post("/quick-setup", payload);

    toast.success("User setup completed successfully");
    navigate("/user")
  } catch (error) {
    toast.error(error?.response?.data?.error_message);
  } finally {
    setLoading(false);
  }
};


  const validateStep = () => {
    if (step === 1) return validateForm(user, setErrors);
    if (step === 2) {
      const isHomeValid = validateForm(home, setErrors);
      if (!isHomeValid) return false;

      if (!device.type) {
        setErrors({ type: "Please select device type" });
        return false;
      }

      if (device.type === "emfit")
        return validateForm({ sr_num: device.sr_num }, setErrors);

      if (device.type === "altum")
        return validateForm({ camera_id: device.camera_id }, setErrors);

      return true;
    }

    if (step === 3) return validateForm(resident, setErrors);
    return true;
  };

  const handleNext = () => {
    if (!validateStep()) return;

    if (step < 3) setStep(step + 1);
    else submitQuickSetup();
  };

  const renderStepper = () => (
    <div className="flex items-center gap-6">
      {steps.map((label, index) => {
        const active = step === index + 1;
        const completed = step > index + 1;

        return (
          <div key={label} className="flex items-center gap-2">
            <div
              className={`h-6 w-6 rounded-full flex items-center justify-center text-xs font-medium
    ${completed
                  ? "bg-green-600 text-white"
                  : active
                    ? "bg-[#FDF4E9] border-2 border-[#EF9421] text-[#EF9421]"
                    : "bg-white border border-gray-300 text-gray-400"
                }`}
            >
              {completed ? "✓" : index + 1}
            </div>

            <span
              className={`text-sm ${active ? "text-[#EF9421] font-medium" : "text-gray-500"
                }`}
            >
              {label}
            </span>

            {index < steps.length - 1 && (
              <div className="w-10 h-px bg-gray-300 mx-2" />
            )}
          </div>
        );
      })}
    </div>
  );
  const isStepComplete = () => {
  // STEP 1
  if (step === 1) {
    return (
      user.first_name &&
      user.last_name &&
      user.email &&
      user.phone.length === 10
    );
  }

  // STEP 2
  if (step === 2) {
    if (!home.name || !device.type) return false;

    if (device.type === "emfit") {
      return (
        device.sr_num 
      );
    }

    if (device.type === "altum") {
      return (
        device.camera_id 
      );
    }

    return false;
  }

  // STEP 3
  if (step === 3) {
    return (
      resident.name &&
      resident.phone.length === 10 &&
      resident.age &&
      resident.gender
    );
  }

  return false;
};


  return (
    <div className="p-6 bg-[#F9FAFB] min-h-screen relative">
      {loading && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/70">
          <Loading />
        </div>
      )}

      <Breadcrumb items={[{ label: "Home" }, { label: "User Quick Setup" }]} />

      <h1 className="mt-4 text-[28px] leading-[32px] font-semibold text-gray-800">
        Add New User
      </h1>
      <div className="mt-4 bg-white rounded-md  shadow-sm">

        <div className="px-6 py-6 ">{renderStepper()}</div>

        <div className="px-6 py-6">
          {/* STEP 1 */}
          {step === 1 && (
            <div className="grid grid-cols-2 gap-6">
              <FormField
                label="First Name"
                name="first_name"
                value={user.first_name}
                onChange={(e) =>
                  setUser({ ...user, first_name: e.target.value })
                }
                rules={[{ type: "required" }]}
                error={errors.first_name}
              />

              <FormField
                label="Last Name"
                name="last_name"
                value={user.last_name}
                onChange={(e) =>
                  setUser({ ...user, last_name: e.target.value })
                }
                rules={[{ type: "required" }]}
                error={errors.last_name}
              />

              <div className="col-span-2">
                <FormField
                  label="User Email"
                  name="email"
                  value={user.email}
                  onChange={(e) =>
                    setUser({ ...user, email: e.target.value })
                  }
                  rules={[{ type: "required" }, { type: "email" }]}
                  error={errors.email}
                />
              </div>

              <div className="col-span-2">
                <FormField
                  label="Contact Number"
                  name="phone"
                  prefix="+91"
                  value={user.phone}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (allowOnlyTenDigits(value)) {
                      setUser({ ...user, phone: value });
                    }
                  }}
                  rules={[{ type: "required" }, { type: "length", value: 10 }]}
                  error={errors.phone}
                />
              </div>
            </div>
          )}

          {/* STEP 2 */}
        {step === 2 && (
  <div className="space-y-6">
    <FormField
      label="Home Name"
      name="name"
      value={home.name}
      onChange={(e) => setHome({ name: e.target.value })}
      rules={[{ type: "required" }]}
      error={errors.name}
    />

    <div className="space-y-4">
      <h3 className="text-sm font-medium text-gray-700">
        Select Devices
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* EmFit */}
        <div
          onClick={() => handleDeviceSelect("emfit")}
          className={`cursor-pointer rounded-lg border p-4 transition
            ${
              device.type === "emfit"
                ? "border-[#EF9421] bg-gradient-to-b from-[#FDF4E9] to-[#ffffff]"
                : "border-gray-200 hover:border-gray-300"
            }`}
        >
          <div className="flex items-start gap-3">
            <div
              className={`h-10 w-10 rounded-md flex items-center justify-center border
                ${
                  device.type === "emfit"
                    ? "border-[#EF9421] bg-[#FFF7ED] text-[#EF9421]"
                    : "border-gray-200 bg-white text-gray-400"
                }`}
            >
              <IoAnalyticsOutline className="text-xl" />
            </div>

            <div>
              <p className="font-medium">EmFit</p>
              <p className="text-sm text-gray-500">
                Contact-free sleep monitoring technology
              </p>
            </div>
          </div>
        </div>

        {/* Altum */}
        <div
          onClick={() => handleDeviceSelect("altum")}
          className={`cursor-pointer rounded-lg border p-4 transition
            ${
              device.type === "altum"
                ? "border-[#EF9421] bg-gradient-to-b from-[#FDF4E9] to-[#ffffff]"
                : "border-gray-200 hover:border-gray-300"
            }`}
        >
          <div className="flex items-start gap-3">
            <div
              className={`h-10 w-10 rounded-md flex items-center justify-center border
                ${
                  device.type === "altum"
                    ? "border-[#EF9421] bg-[#FFF7ED] text-[#EF9421]"
                    : "border-gray-200 bg-white text-gray-400"
                }`}
            >
              <SiStackblitz className="text-xl" />
            </div>

            <div>
              <p className="font-medium">Altum</p>
              <p className="text-sm text-gray-500">
                AI Activity Sensor for Senior Care & Patient Monitoring
              </p>
            </div>
          </div>
        </div>
      </div>

      {errors.type && (
        <p className="text-sm text-red-600">{errors.type}</p>
      )}
    </div>

    {/* ✅ Device-specific input */}
    {device.type === "emfit" && (
      <FormField
        label="SR Number"
        name="sr_num"
        value={device.sr_num}
        onChange={(e) =>
          setDevice({ ...device, sr_num: e.target.value })
        }
        rules={[{ type: "required" }]}
        error={errors.sr_num}
      />
    )}

    {device.type === "altum" && (
      <FormField
        label="Camera ID"
        name="camera_id"
        value={device.camera_id}
        onChange={(e) =>
          setDevice({ ...device, camera_id: e.target.value })
        }
        rules={[{ type: "required" }]}
        error={errors.camera_id}
      />
    )}
  </div>
)}


          {/* STEP 3 */}
          {step === 3 && (
            <div className="grid grid-cols-2 gap-6">
              <FormField
                label="Resident Name"
                name="name"
                value={resident.name}
                onChange={(e) =>
                  setResident({ ...resident, name: e.target.value })
                }
                rules={[{ type: "required" }]}
                error={errors.name}
              />
              <FormField
                label="Resident Email"
                name="email"
                value={resident.email}
                onChange={(e) =>
                  setResident({ ...resident, email: e.target.value })
                }
                rules={[{ type: "required" }, { type: "email" }]}
                error={errors.email}
              />

              <FormField
                label="Contact Number*"
                name="phone"
                value={resident.phone}
                onChange={(e) => {
                  const value = e.target.value;
                  if (allowOnlyTenDigits(value)) {
                    setResident({ ...resident, phone: value });
                  }
                }}
                rules={[{ type: "required" }, { type: "length", value: 10 }]}
                error={errors.phone}
              />

              <FormField
                label="Age"
                name="age"
                type="number"
                value={resident.age}
                onChange={(e) =>
                  setResident({ ...resident, age: e.target.value })
                }
                rules={[{ type: "required" }]}
                error={errors.age}
              />

              <FormField
                label="Gender"
                name="gender"
                type="select"
                value={resident.gender}
                onChange={(e) =>
                  setResident({ ...resident, gender: e.target.value })
                }
                options={[
                  { label: "Male", value: "male" },
                  { label: "Female", value: "female" },
                ]}
                rules={[{ type: "required" }]}
                error={errors.gender}
              />
                <FormField
                label="Emergency Contact Name"
                name="emergency_con_name"
                value={resident.emergency_con_name}
                onChange={(e) =>
                  setResident({ ...resident, emergency_con_name: e.target.value })
                }
                rules={[{ type: "required" }]}
                error={errors.name}
              />
                <FormField
                label="Emergency Contact Number*"
                name="emergency_con_num"
                value={resident.emergency_con_num}
               onChange={(e) => {
                  const value = e.target.value;
                  if (allowOnlyTenDigits(value)) {
                    setResident({
                      ...resident,
                      emergency_con_num: value,
                    });
                  }
                }}
                rules={[{ type: "required" }, { type: "length", value: 10 }]}
                error={errors.emergency_con_num}
              />
            </div>
          )}
        </div>

        <div className="px-6 py-4 flex justify-between items-center">
  {/* Left side: Cancel */}
  <button
    onClick={()=>navigate("/")}
    className="px-4 py-2 border border-[#4D4D4F] text-[#4D4D4F] rounded"
  >
    Cancel
  </button>

  {/* Right side: Previous + Next */}
  <div className="flex gap-3">
    {step > 1 && (
      <button
        onClick={() => setStep(step - 1)}
        className="px-4 py-2 border border-gray-300 text-gray-700 rounded"
      >
        Previous
      </button>
    )}

    <button
      onClick={handleNext}
      disabled={!isStepComplete()}
      className={`px-6 py-2 rounded transition
        ${
          isStepComplete()
            ? "bg-[#EF9421] text-white cursor-pointer"
            : "bg-gray-300 text-gray-500 cursor-not-allowed"
        }`}
    >
      {step === 3 ? "Finish" : "Next"}
    </button>
  </div>
</div>

      </div>
    </div>
  );
}

export default SetupWizardModal;
