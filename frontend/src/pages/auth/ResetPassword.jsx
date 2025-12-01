import React, { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import apiClient from '../../lib/apiClient';
import TextInput from '../../components/ui/TextInput';
import { Eye, EyeOff } from 'lucide-react'
import PrimaryButton from '../../components/ui/PrimaryButton';
const ResetPassword = () => {

  const location = useLocation();
  const navigate = useNavigate();

  const emailFormState = location.state?.email || localStorage.getItem("resetEmail");
  const storedToken = localStorage.getItem("resetToken");

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [showConfim, setShowConfim] = useState(false);

  useEffect(() => {
    if (!storedToken) {
      navigate("/forgot-password")
    }
  }, [storedToken, navigate])
  
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!password.trim() || !confirm.trim()) {
      toast.error("Password and confirm password are required");
      return;
    }

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    if (password != confirm) {
      toast.error("Password do not match");
      return;
    }

    setLoading(true);

    try {
      await apiClient.post("/auth/reset-password", {
        resetToken: storedToken,
        newPassword:password
      })

      localStorage.removeItem("resetToken");
      localStorage.removeItem("resetEmail");

      toast.success("Password reset successfully. You can now log in.")
      navigate("/login");
    } catch (error) {
      const msg = error?.response?.data?.message || error?.response?.data?.error || "Failed to reset password";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }
  return (
    <main className='min-h-screen flex items-center justify-center bg-[#F5F4F1] p-6'>
      <div className='w-full max-w-md'>
        <div className='mb-6 text-center'>
          <h1 className='text-2xl font-extrabold text-[#0D0D0D]'>Set a new password</h1>

          <p className='mt-2 text-sm text-[#6B6B6B]'>Choose a strong password for{" "} <span className='font-semibold text-[#0D0D0D]'>{ emailFormState || "your account"}</span></p>
        </div>

        <form onSubmit={handleSubmit} className='bg-white rounded-2xl p-6 shadow-sm ring-1 ring-[#EDEDED] space-y-4'>
          <TextInput label="New password" name="password" type={showPw ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 8 characters" required rightElement={<button type='button' onClick={() => setShowPw((s) => !s)} className='text-xs text-[#6B6B6B] px-2 py-1'>{showPw ? <EyeOff /> : <Eye />}</button>} autoComplete="new-password" />
          
          <TextInput label="Confirm password" name="confirmPassword" type={showConfim ? "text" : "password"} value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="Repeat new password" required rightElement={<button type='button' onClick={() => setShowConfim((s) => !s)} className='text-xs text-[#6B6B6B] px-2 py-1 rounded'>{showConfim ? <EyeOff /> : <Eye />}</button>} autoComplete="new-password" />
          
          <PrimaryButton type='submit' loading={loading} className='w-full'>Reset Password</PrimaryButton>

          <div className='text-center text-sm text-[#6B6B6B]'>Remember your password?{" "}<Link to="/login" className='text-[#0D0D0D] font-medium underline'>Back to login</Link></div>
        </form>
      </div>
    </main>
  )
}

export default ResetPassword