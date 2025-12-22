import React from 'react'
import { useContext } from 'react';
import {  useLocation, useNavigate } from 'react-router-dom'
import UserContext from '../../context/UserContext';
import { useState } from 'react';
import { useEffect } from 'react';
import { toast } from 'react-toastify';
import apiClient from '../../lib/apiClient';
import PrimaryButton from '../../components/ui/PrimaryButton';
const VerifyEmailOtp = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { setIsLoggedIn, setUserData } = useContext(UserContext);

  const emailFormState = location.state?.email || localStorage.getItem("pendingEmail");

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  useEffect(() => {
    if (!emailFormState) {
      navigate("/register");
    }
  }, [emailFormState, navigate]);

  useEffect(() => {
    if (!resendTimer) return;
    const id = setTimeout(() => setResendTimer((t) => t - 1), 1000);
    return () => clearTimeout(id);
  },[resendTimer])
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!otp.trim() || otp.trim().length < 4) {
      toast.error("Please enter the OTP sent to your email");
      return;
    }
    setLoading(true);

    try {
      const res = await apiClient.post("/auth/verify-otp", { email: emailFormState, otp })
      // console.log(res);
      
      const data = res.data.data || {};
      // console.log(data);
      
      toast.success(res.data.message || "Email verified successfully");

      if (data) {
        // setIsLoggedIn(true);
        setUserData(data);
      } else {
        setIsLoggedIn(true)
      }
      localStorage.removeItem("pendingEmail");
      navigate("/dashboard")
    } catch (error) {
      // console.log(error);
      
      const msg = error?.response?.data?.message || error?.response?.data?.error || "Invalid or expired OTP";
      toast.error(msg);
    } finally {
      setLoading(false)
    }
  }

  const handleResend = async  () => {
    if (!emailFormState) return;

    setResendLoading(true);

    try {
      await apiClient.post("/auth/resend-verify-otp", { email: emailFormState });
      toast.success("New OTP sent to your email");
      setResendTimer(60);
    } catch (error) {
      const msg = error?.response?.data?.message || error?.response?.data?.error || "Could not resend OTP";
      toast.error(msg);
    } finally {
      setResendLoading(false);
    }
  }
  return (
    <main className='min-h-screen flex items-center justify-center bg-[#F5F4F1] P-6'>
      <div className='w-full max-w-md'>
        <div className='mb-6 text-center'>
          <h1 className='text-2xl font-extrabold text-[#0D0D0D]'>Verify your email</h1>
          <p className='mt-2 text-sm text-[#6B6B6B]'>We've sent a 6-digit verification code to {" "} <span className='font-semibold text-[#0D0D0D]'>{emailFormState || "your email"}</span>{ " "}Enter it below to activate your account.</p>
        </div>

        <form onSubmit={handleSubmit} className='bg-white rounded-2xl p-6 shadow-sm ring-1 ring-[#EDEDED] space-y-4'>
          <div>
            <label className='block'>
              <span className='text-xs text-[#6B6B6B]'>Verification code</span>
              <input type="text" inputMode='numeric' maxLength={6} value={otp} onChange={(e) => { const v = e.target.value.replace(/\D/g, ""); setOtp(v); }} className='mt-1 w-full rounded-lg border border-[#EDEDED] px-3 py-2 text-center tracking-[0.4rem] text-lg bg-white text-[#0D0D0D] focus:outline-none focus:ring-[#FF6B00]/40' placeholder='••••••' />
              
            </label>

            <p className='mt-1 text-xs text-[#6B6B6B]'>Code expires in 5 minutes. Check span if you can't find the email.</p>
          </div>
          
          <PrimaryButton type='submit' loading={loading} className='w-full'>Verify email</PrimaryButton>
          
          <div className='flex items-center justify-between text-sm text-[#6B6B6B]'>
            <span>Didn't get the code?</span>
            <button type='button' disabled={resendLoading || resendTimer > 0} onClick={handleResend} className={`text-[#0D0D0D] font-medium underline disabled:opacity-60 disabled:cursor-not-allowed`}>{ resendTimer>0 ? `Resend in ${resendTimer}s`:resendLoading?"Sending...":"Resend OTP"}</button>
          </div>
        </form>
      </div>
    </main>
  )
}

export default VerifyEmailOtp