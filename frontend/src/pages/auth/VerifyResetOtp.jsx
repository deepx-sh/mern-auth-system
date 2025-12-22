import React, { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify'
import apiClient from '../../lib/apiClient'
import PrimaryButton from '../../components/ui/PrimaryButton';
const VerifyResetOtp = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const emailFromState = location.state?.email || localStorage.getItem("resetEmail");

    const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
    const [resendTimer, setResendTimer] = useState(0);
    

  useEffect(() => {
    if (!emailFromState) {
      navigate("/forgot-password");
    }
  }, [emailFromState, navigate]);

  useEffect(() => {
      if (!resendTimer) return;
      const id = setTimeout(() => setResendTimer((t) => t - 1), 1000);
      return () => clearTimeout(id);
    },[resendTimer])

  const handleSubmit = async(e) => {
    e.preventDefault();

    if (!otp.trim() || otp.trim().length < 6) {
      toast.error("Please enter the code sent to your email")
      return;
    }

    setLoading(true);

    try {
      const res = await apiClient.post("/auth/verify-reset-otp",{email:emailFromState,otp});

      const data = res.data.data || {};
     
      
      const resetToken = data.resetToken;
      
      if (!resetToken) {
        toast.error("No reset token received from server");
        return;
      }

      localStorage.setItem("resetToken", resetToken);
      localStorage.setItem("resetEmail",emailFromState)
      toast.success(res.data.message || "OTP verified. You can reset your password now");
      navigate("/reset-password", { state: { email: emailFromState } });
    } catch (error) {
      
      
      const msg = error?.response?.data?.message || error?.response?.data?.error || "Invalid or expired code"
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }

  const handleResend = async  () => {
    if (!emailFromState) return;

    setResendLoading(true);

    try {
      await apiClient.post("/auth/forget-password", { email: emailFromState });
      toast.success("New Code sent to your email");
      setResendTimer(60);
    } catch (error) {
      const msg = error?.response?.data?.message || error?.response?.data?.error || "Could not resend OTP";
      toast.error(msg);
    } finally {
      setResendLoading(false);
    }
  }
  return (
    <main className='min-h-screen flex items-center justify-center bg-[#F5F4F1] p-6'>

      <div className='w-full max-w-md'>
        <div className='mb-6 text-center'>
          <h1 className='text-2xl font-extrabold text-[#0D0D0D]'>
            Enter reset code
          </h1>

          <p className='mt-2 text-sm text-[#6B6B6B]'>
            We&apos;ve sent reset code to{" "} 
            <span className='font-semibold text-[#0D0D0D]'>
              {emailFromState || "Your email"}
            </span>
            . Enter it below to continue.
          </p>
        </div>

        <form onSubmit={handleSubmit} className='bg=white rounded-2xl p-6 shadow-sm ring-1 ring-[#EDEDED] space-y-4'>
          <div>
            <label className='block'>
              <span className='text-xs text-[#6B6B6B]'>Reset Code</span>

              <input type="text" inputMode='numeric' maxLength={6} value={otp} onChange={(e) => {
                const v = e.target.value.replace(/\D/g, "");
                setOtp(v);
              }} className='mt-1 w-full rounded-lg border border-[#EDEDED] px-3 py-2 text-center tracking-[0.4rem] text-lg bg-white text-[#0D0D0D] focus:outline-none focus:ring-2 focus:ring-[#FF6B00]/40' placeholder='••••••'/>
            </label>

            <p className='mt-1 text-xs text-[#6B6B6B]'>Code is valid only for a five minutes.</p>
          </div>

          <PrimaryButton type='submit' loading={loading} className='w-full'>Verify code</PrimaryButton>

          <div className='flex items-center justify-between text-sm text-[#6B6B6B]'>
            <span>Didn't get the code?</span>
            <button type='button' disabled={resendLoading || resendTimer > 0} onClick={handleResend} className='text-[#0D0D0D] font-medium underline disabled:opacity-60 disabled:cursor-not-allowed'>{ resendTimer>0 ? `Resend in ${resendTimer}s`:resendLoading?"Sending...":"Resend code"}</button>
          </div>

          <div className='text-center text-xs text-[#6B6B6B]'>
            <Link to="/forgot-password" className='underline'>
            Change email</Link>
          </div>
        </form>
      </div>
    </main>
  )
}

export default VerifyResetOtp