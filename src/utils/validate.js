export const validate = (name, value, onErrors) => {
  let validated = true;
  let error = "";
  if (!value.trim()) {
    error = "This field is required";
    validated = false;
  }
  onErrors((prev) => ({ ...prev, [name]: error }));
  return validated;
};

export const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export const reg = new RegExp("^((072|078|073))[0-9]{7}$", "i");

export const getPasswordStrength = (password) => {
  return {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
  };
};
