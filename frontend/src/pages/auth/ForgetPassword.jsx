
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import apiClient from '../../lib/apiClient';
import TextInput from '../../components/ui/TextInput';
import PrimaryButton from '../../components/ui/PrimaryButton';

const ForgetPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);


  const validateEmail = (value) => /^\S+@\S+\.\S+$/.test(value);
  
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error("Email is required");
      return
    }

    if (!validateEmail(email)) {
      toast.error("Enter a valid email")
      return
    }

    setLoading(true)
    try {
      await apiClient.post("/auth/forget-password", { email });

      localStorage.setItem("resetEmail", email);
      toast.success("OTP sent to your email");
      navigate("/verify-reset-otp", { state: { email } });

    } catch (error) {
      const msg = error?.response?.data?.data?.message || error?.response?.data?.data?.error || "Failed to send reset OTP";
      toast.error(msg);
    } finally {
      setLoading(false)
    }
  }
  return (
    <main className='min-h-screen flex items-center justify-center bg-[#F5F4F1] p-6'>
      <div className='w-full max-w-md'>
        <div className='mb-6 text-center'>
          <h1 className='text-2xl font-extrabold text-[#0D0D0D]'>Forgot your password?</h1>

          <p className='mt-2 text-sm text-[#6B6B6B]'>Enter your email and we&apos; Send you a one-time code to reset your password</p>
        </div>

        <form onSubmit={handleSubmit} className='bg-white rounded-2xl p-6 shadow-sm ring-1 ring-[#EDEDED] space-y-4'>

          <TextInput label="Email" name="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" autoComplete="email" required />
          
          <PrimaryButton type='submit' loading={loading} className='w-full' >Send reset code</PrimaryButton>
          
          <div className='text-center text-sm text-[#6B6B6B]'>
            Remember your password?{" "} 
            <Link to="/login" className='text-[#0D0D0D] font-medium underline'>Back to login</Link>
          </div>
        </form>
      </div>
    </main>
  )
}

export default ForgetPassword