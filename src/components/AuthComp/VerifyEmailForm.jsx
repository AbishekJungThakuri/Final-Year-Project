import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { verify } from "../../features/auth/registerAuth/registerSlice";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
  const [email, setEmail] = useState(initialEmail || "");
  const [otp, setOtp] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, emailVerified } = useSelector(
    (state) => state.register
  );

  const handleVerify = async (e) => {
    e.preventDefault();
    try {
      const result = await dispatch(
        verify({ email: email.trim().toLowerCase(), otp: String(otp).trim() })
      );

      // Ensure successful verification before navigating
      if (!result.error) {
        navigate("/login");
      }
    } catch (err) {
      console.error("Verification failed:", err);
    }
  };

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
              Enter the OTP sent to your email
            </p>

            {/* Email Field */}
            <div className="space-y-2 flex flex-col items-center">
              <Label>Email</Label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>

            {/* OTP Input */}
            <div className="space-y-2 flex flex-col items-center">
              <Label>OTP</Label>
              <InputOTP
                maxLength={6}
                value={otp}
                onChange={setOtp}
                className="justify-center"
              >

                {/* First 3 slots */}
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                </InputOTPGroup>

                {/* Separator */}
                <InputOTPSeparator>-</InputOTPSeparator>

                {/* Last 3 slots */}
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
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default VerifyEmailForm;
