/**
 * Validates password strength
 * @param {string} password - The password to validate
 * @returns {Object} - Validation result with isValid flag and message
 */
export const validatePassword = (password) => {
  // Check if password exists
  if (!password) {
    return { isValid: false, message: "Password is required" };
  }

  const requirements = [];
  let isValid = true;

  // Check all requirements
  if (password.length < 8) {
    isValid = false;
    requirements.push("at least 8 characters");
  }
  
  if (password.length > 128) {
    isValid = false;
    requirements.push("no more than 128 characters");
  }

  if (!/[A-Z]/.test(password)) {
    isValid = false;
    requirements.push("at least one uppercase letter");
  }

  if (!/[a-z]/.test(password)) {
    isValid = false;
    requirements.push("at least one lowercase letter");
  }

  if (!/\d/.test(password)) {
    isValid = false;
    requirements.push("at least one number");
  }

  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    isValid = false;
    requirements.push("at least one special character (!@#$%^&*()_+-=[]{}|;:'\",.<>/?)")
  }

  // If password is valid, return success
  if (isValid) {
    return { isValid: true, message: "Password is valid" };
  }

  // Otherwise, return a comprehensive error message
  return { 
    isValid: false, 
    message: `Password must contain ${requirements.join(", ")}.`
  };
};