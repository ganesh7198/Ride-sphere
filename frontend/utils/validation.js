export function validateLogin(formData) {
  const errors = {};

  if (!formData.email) {
    errors.email = "Email is required";
  } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
    errors.email = "Invalid email format";
  }

  if (!formData.password) {
    errors.password = "Password is required";
  } else if (formData.password.length < 6) {
    errors.password = "Password must be at least 6 characters";
  }

  return errors;
}

export function validateSignup(data) {
  const errors = {};

  if (!data.username) {
    errors.username = "Username is required";
  } else if (data.username.length < 3) {
    errors.username = "Username must be at least 3 characters";
  }

  if (!data.fullname) {
    errors.fullname = "Full name is required";
  }

  if (!data.email) {
    errors.email = "Email is required";
  } else if (!/\S+@\S+\.\S+/.test(data.email)) {
    errors.email = "Invalid email";
  }

  if (!data.password) {
    errors.password = "Password is required";
  } else if (data.password.length < 6) {
    errors.password = "Password must be at least 6 characters";
  }
  return errors;
}