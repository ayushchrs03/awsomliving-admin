const fieldRegistry = {};

export const createFieldUpdater = (setFormData, setErrors) => {
  return (key, value) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [key]: "",
    }));
  };
};

export const allowOnlyTenDigits = (value) => {
  if (!value) return true;

  for (let i = 0; i < value.length; i++) {
    if (value[i] < "0" || value[i] > "9") {
      return false;
    }
  }

  return value.length <= 10;
};

export const isValidEmail = (email) => {
  if (!email) return false;

  let atFound = false;
  let dotFound = false;

  for (let i = 0; i < email.length; i++) {
    if (email[i] === "@") atFound = true;
    if (atFound && email[i] === ".") dotFound = true;
  }

  return atFound && dotFound;
};

export const registerField = (name, rules = []) => {
  fieldRegistry[name] = rules;
};

export const validateForm = (formData, setErrors) => {
  const newErrors = {};

  for (let field in fieldRegistry) {
    if (!(field in formData)) continue;
    const value = formData[field];
    const rules = fieldRegistry[field];

    for (let i = 0; i < rules.length; i++) {
      const rule = rules[i];

      if (rule.type === "required") {
        if (
          value === null ||
          value === undefined ||
          (typeof value === "string" && !value.trim()) ||
          (Array.isArray(value) && value.length === 0)
        ) {
          newErrors[field] = rule.message || "Required field";
          break;
        }
      }

      if (rule.type === "email") {
        if (value && !isValidEmail(value)) {
          newErrors[field] = rule.message || "Invalid email address";
          break;
        }
      }

      if (rule.type === "length") {
        if (value && value.length !== rule.value) {
          newErrors[field] =
            rule.message || `Must be ${rule.value} characters`;
          break;
        }
      }
    }
  }

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};
