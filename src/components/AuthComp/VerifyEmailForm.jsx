import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { verify, resendOTP } from "../../features/auth/registerAuth/registerSlice";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
} from "@/components/ui/input-otp";

const VerifyEmailForm = ({ email: initialEmail }) => {
  const [otp, setOtp] = useState("");
  const [cooldown, setCooldown] = useState(0);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, emailVerified } = useSelector(
    (state) => state.register
  );

  const email = initialEmail || "";

  const handleVerify = async (e) => {
    e.preventDefault();
    try {
      const result = await dispatch(
        verify({ email: email.trim().toLowerCase(), otp: String(otp).trim() })
      );

      if (!result.error) {
        navigate("/login");
      }
    } catch (err) {
      console.error("Verification failed:", err);
    }
  };

  const handleResend = async () => {
    try {
      await dispatch(resendOTP({ email: email.trim().toLowerCase() }));
      setCooldown(30); // 30s cooldown
    } catch (err) {
      console.error("Failed to resend OTP:", err);
    }
  };

  // countdown for cooldown
  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown((prev) => prev - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  useEffect(() => {
    if (emailVerified) {
      navigate("/login");
    }
  }, [emailVerified, navigate]);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-sm shadow-lg rounded-2xl">
        <CardHeader>
          <CardTitle className="text-center text-xl font-semibold">
            Verify Your Email
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleVerify} className="space-y-6">
            <p className="text-sm text-gray-600 text-center">
              An OTP has been sent to{" "}
              <span className="font-medium text-gray-900">{email}</span>
            </p>

            {/* OTP Input */}
            <div className="space-y-2 flex flex-col items-center">
              <Label>Enter OTP</Label>
              <InputOTP
                maxLength={6}
                value={otp}
                onChange={setOtp}
                className="justify-center"
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                </InputOTPGroup>

                <InputOTPSeparator>-</InputOTPSeparator>

                <InputOTPGroup>
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </div>

            {/* Error Message */}
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Submit Button */}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Verifying..." : "Verify"}
            </Button>

            {/* Resend OTP Button */}
            <Button
              type="button"
              variant="outline"
              className="w-full mt-2"
              disabled={cooldown > 0 || loading}
              onClick={handleResend}
            >
              {cooldown > 0 ? `Resend OTP in ${cooldown}s` : "Resend OTP"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default VerifyEmailForm;
