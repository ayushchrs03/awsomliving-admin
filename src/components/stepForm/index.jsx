import React, { useEffect, useState } from "react";
import FormField from "../formField";
import client from "../../redux/axios-baseurl";
import { RxCross2 } from "react-icons/rx";
import Loading from "../../components/loader";
import { validateForm, allowOnlyTenDigits } from "../../utils/formUtils";

function SetupWizardModal({ onClose }) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const steps = ["User Details", "Home", "Resident Details", "Devices"];

  const [errors, setErrors] = useState({});

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
    resident: {
      ...resident,
      age: Number(resident.age),
    },
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

  const submitQuickSetup = async () => {
    try {
      setLoading(true);
      const payload = buildPayload();
      const res = await client.post("/quick-setup", payload);
      console.log("Quick setup success", res.data);
      onClose();
    } catch (error) {
      console.error("Quick setup failed", error?.response?.data || error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Step Validations
  const validateStep = () => {
    // Step 1
    if (step === 1) {
      const isValid = validateForm(
        user,
        setErrors
      );
      return isValid;
    }

    // Step 2
    if (step === 2) {
      const isValid = validateForm(
        home,
        setErrors
      );
      return isValid;
    }

    // Step 3
    if (step === 3) {
      const isValid = validateForm(
        resident,
        setErrors
      );
      return isValid;
    }

    // Step 4
    if (step === 4) {
      // ✅ Device type required
      if (!device.type) {
        setErrors({ type: "Please select device type" });
        return false;
      }

      // ✅ validate SR / Camera based on type
      if (device.type === "emfit") {
        const isValid = validateForm(
          { sr_num: device.sr_num },
          setErrors
        );
        return isValid;
      }

      if (device.type === "altum") {
        const isValid = validateForm(
          { camera_id: device.camera_id },
          setErrors
        );
        return isValid;
      }

      return true;
    }

    return true;
  };

  const handleNext = () => {
    const isValid = validateStep();
    if (!isValid) return;

    if (step < 4) {
      setStep(step + 1);
    } else {
      submitQuickSetup();
    }
  };

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/40">
      {loading && (
        <div className="absolute inset-0 z-50 flex items-center justify-center">
          <Loading />
        </div>
      )}

      <div className="relative w-full max-w-5xl h-[85vh] rounded-md bg-white shadow-lg flex flex-col">
        <div className="flex items-center justify-between border-b border-[#EF9421] px-6 py-4">
          <h2 className="text-lg font-semibold">Setup Wizard</h2>
          <button
            onClick={onClose}
            className="text-xl hover:text-[#EF9421] transition"
          >
            <RxCross2 size={22} />
          </button>
        </div>

        {/* Stepper */}
        <div className="w-full flex justify-center pt-6">
          <div className="w-full max-w-4xl px-10">
            <div className="relative flex items-center justify-between">
              <div className="absolute left-[6%] right-[6%] top-1/2 h-[2px] bg-gray-300"></div>

              <div
                className="absolute left-[6%] top-1/2 h-[2px] bg-[#EF9421] transition-all duration-300"
                style={{
                  width: `${((step - 1) / (steps.length - 1)) * 88}%`,
                }}
              ></div>

              {steps.map((label, index) => {
                const currentStep = index + 1;
                const isActive = step >= currentStep;

                return (
                  <div
                    key={label}
                    onClick={() => setStep(currentStep)}
                    className="flex flex-col items-center cursor-pointer w-full relative z-10"
                  >
                    <div
                      className={`h-12 w-12 flex items-center justify-center rounded-full border transition
                      ${
                        isActive
                          ? "bg-[#EF9421] text-white border-[#EF9421]"
                          : "bg-white text-gray-400 border-gray-300"
                      }`}
                    >
                      {currentStep}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-between mt-3">
              {steps.map((label) => (
                <div key={label} className="w-full text-center text-sm">
                  {label}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="px-10 py-6 flex-1 overflow-y-auto">
          {/* STEP 1 */}
          {step === 1 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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

              <FormField
                label="Email"
                name="email"
                value={user.email}
                onChange={(e) => setUser({ ...user, email: e.target.value })}
                rules={[{ type: "required" }, { type: "email" }]}
                error={errors.email}
              />

              <FormField
                label="Phone"
                name="phone"
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
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <FormField
              label="Home Name"
              name="name"
              value={home.name}
              onChange={(e) => setHome({ name: e.target.value })}
              rules={[{ type: "required" }]}
              error={errors.name}
            />
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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
                label="Resident Phone"
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
                label="Email"
                name="email"
                value={resident.email}
                onChange={(e) =>
                  setResident({ ...resident, email: e.target.value })
                }
                rules={[{ type: "required" }, { type: "email" }]}
                error={errors.email}
              />

              <FormField
                label="Emergency Contact Name"
                name="emergency_con_name"
                value={resident.emergency_con_name}
                onChange={(e) =>
                  setResident({
                    ...resident,
                    emergency_con_name: e.target.value,
                  })
                }
                rules={[{ type: "required" }]}
                error={errors.emergency_con_name}
              />

              <FormField
                label="Emergency Contact Number"
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

          {/* STEP 4 */}
          {step === 4 && (
            <div>
              <div className="flex gap-6 mb-4">
                <label className="flex gap-2 items-center">
                  <input
                    type="checkbox"
                    checked={device.type === "emfit"}
                    onChange={() => handleDeviceSelect("emfit")}
                    className="accent-orange-500 scale-150"
                  />
                  Emfit
                </label>

                <label className="flex gap-2 items-center">
                  <input
                    type="checkbox"
                    checked={device.type === "altum"}
                    onChange={() => handleDeviceSelect("altum")}
                    className="accent-orange-500 scale-150"
                  />
                  Altum
                </label>
              </div>

              {errors.type && (
                <p className="text-sm text-red-600 mb-4">{errors.type}</p>
              )}

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
        </div>

        {/* Footer */}
        <div className="flex justify-between px-6 py-4 bg-white sticky bottom-0">
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded border border-gray-300"
            >
              Cancel
            </button>
          </div>

          <div className="flex gap-3">
            {step > 1 && (
              <button
                onClick={() => setStep(step - 1)}
                className="px-4 py-2 rounded border border-gray-300"
              >
                Previous
              </button>
            )}

            <button
              onClick={handleNext}
              className="bg-[#EF9421] text-white px-6 py-2 rounded"
            >
              {step === 4 ? "Finish" : "Next"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SetupWizardModal;
