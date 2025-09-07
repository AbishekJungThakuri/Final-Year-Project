import axios from '../../../services/axiosInstances';

export const registerUser = async ({ username, email, password, city_id }) => {
  if (!city_id) throw new Error("City is required");

  const res = await axios.post("/auth/register", {
    username,
    email,
    password,
    city_id, 
  });
  return res.data;
};

export const verifyEmail = async ({ email, otp }) => {
  if (!email || !otp) throw new Error("Missing email or OTP");

  const res = await axios.post(
    `/auth/verify_email?email=${encodeURIComponent(email)}&otp=${encodeURIComponent(
      otp.trim()
    )}`
  );
  return res.data;
};