import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { ShieldCheck, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { toast } from "@/hooks/use-toast";
import authService from "@/auth/authServices";

export default function VerifyOTP() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [timer, setTimer] = useState(60);

  useEffect(() => {
    if (!email) {
      navigate("/forgot-password");
      return;
    }

    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [email, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) {
      toast({ title: "Invalid OTP", description: "Please enter a 6-digit code.", variant: "destructive" });
      return;
    }

    setIsLoading(true);
    try {
      const response = await authService.verifyOTP(email, otp);
      if (response.success) {
        toast({
          title: "Verified",
          description: "OTP verified successfully. You can now reset your password.",
        });
        navigate("/reset-password", { state: { email } });
      }
    } catch (error: any) {
      toast({
        title: "Verification Failed",
        description: error.response?.data?.message || "Invalid or expired OTP.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resendOTP = async () => {
    setTimer(60);
    try {
      await authService.forgotPassword(email);
      toast({ title: "OTP Resent", description: "A new code has been sent to your email." });
    } catch (error) {
      toast({ title: "Error", description: "Failed to resend OTP.", variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-slate-50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-3xl p-8 shadow-xl border border-slate-100 text-center"
      >
        <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <ShieldCheck size={32} />
        </div>

        <h1 className="text-3xl font-heading font-bold mb-2">Verify OTP</h1>
        <p className="text-muted-foreground mb-6">
          We've sent a 6-digit verification code to <br />
          <span className="font-bold text-slate-800">{email}</span>
        </p>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="flex flex-col items-center gap-4">
            <InputOTP maxLength={6} value={otp} onChange={(val) => setOtp(val)}>
              <InputOTPGroup className="gap-2">
                <InputOTPSlot index={0} className="w-12 h-14 text-xl font-bold rounded-xl border-2" />
                <InputOTPSlot index={1} className="w-12 h-14 text-xl font-bold rounded-xl border-2" />
                <InputOTPSlot index={2} className="w-12 h-14 text-xl font-bold rounded-xl border-2" />
                <InputOTPSlot index={3} className="w-12 h-14 text-xl font-bold rounded-xl border-2" />
                <InputOTPSlot index={4} className="w-12 h-14 text-xl font-bold rounded-xl border-2" />
                <InputOTPSlot index={5} className="w-12 h-14 text-xl font-bold rounded-xl border-2" />
              </InputOTPGroup>
            </InputOTP>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
              Code expires in 10 minutes
            </p>
          </div>

          <Button type="submit" size="lg" className="w-full h-12 rounded-xl" disabled={isLoading || otp.length !== 6}>
            {isLoading ? (
              <Loader2 className="animate-spin" />
            ) : (
              <>
                Verify & Continue
                <ArrowRight className="ml-2 w-4 h-4" />
              </>
            )}
          </Button>
        </form>

        <div className="mt-8 text-sm">
          <p className="text-slate-500">
            Didn't receive the code?{" "}
            {timer > 0 ? (
              <span className="font-bold text-primary">Resend in {timer}s</span>
            ) : (
              <button onClick={resendOTP} className="font-bold text-primary hover:underline">
                Resend Now
              </button>
            )}
          </p>
        </div>
      </motion.div>
    </div>
  );
}
