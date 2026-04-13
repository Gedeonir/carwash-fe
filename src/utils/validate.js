  export const validate = (name, value,onErrors) => {
    let validated = true;
    let error = "";
    if (!value.trim()) {
      error = "This field is required";
      validated = false;
    }
    onErrors((prev) => ({ ...prev, [name]: error }));
    return validated;
  };