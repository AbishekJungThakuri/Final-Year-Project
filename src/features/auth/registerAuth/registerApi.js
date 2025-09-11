import axios from '../../../services/axiosInstances';

export const registerUser = async ({ username, email, password }) => {

  const res = await axios.post("/auth/register", {
    username,
    email,
    password,
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


export const resendEmailOtp = async (email) => {
  if(!email) throw new Error("Missing email");
  
  const res = await axios.post(`/auth/resend_otp?email=${encodeURIComponent(email)}`);
  return res.data;
};