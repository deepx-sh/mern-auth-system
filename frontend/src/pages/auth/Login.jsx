import axios from 'axios';
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import TextInput from '../../components/ui/TextInput';
import { Eye, EyeOff } from 'lucide-react';
import PrimaryButton from '../../components/ui/PrimaryButton';
const Login = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);


  const handleChange = (e) => {
    setForm((prev) => ({...prev, [e.target.name]: e.target.value}));
  }




  const handleSubmit = async (e) => {
    e.preventDefault();
   
    setFormError("");
    setFieldErrors({});

    if (!form.email.trim() || !form.password.trim()) {
      setFieldErrors({
        email: !form.email.trim() ? "Email is required" : undefined,
        password: !form.password.trim() ? "Password is required" : undefined
      });
      return
    }

    setLoading(true);
    try {
      await axios.post("/api/auth/login", form, { withCredentials: true });
      navigate("/dashboard");
    } catch (error) {
      const data = error?.response?.data || {};
      if (data.errors && typeof data.errors === 'object') {
        setFieldErrors(data.errors)
      } else {
        const newFieldError = {};
        if (data.email) newFieldError.email = data.email;
        if (data.password) newFieldError.password = data.password;
        
        if (Object.keys(newFieldError).length) {
          setFieldErrors(newFieldError);
        } else {
          setFormError(data.message || data.error || error.message || "Login failed");
        }
      }
    } finally {
      setLoading(false);
    }
  }
  return (
    <main className='min-h-screen flex items-center justify-center bg-[#F5F4F1] p-6'>
      <div className='w-full max-w-md'>
        <div className='mb-6 text-center'>
          <h1 className='text-2xl font-extrabold text-[#0D0D0D]'>Welcome back</h1>
          <p className='mt-2 text-sm text-[#6B6B6B]'>
            Sign in to access your SecureNation dashboard
          </p>
        </div>

        <form onSubmit={handleSubmit} className='bg-white rounded-2xl p-6 shadow-sm ring-1 ring-[#EDEDED] space-y-4'>
          {formError && (
            <div className='rounded-md bg-[#FFEDED] px-3 py-2 text-sm text-[#B03A2E]'>{formError}</div>
    
          )}
          
          <TextInput label="Email" name="email" type='email' value={form.email} onChange={handleChange} placeholder="you@example.com" required error={fieldErrors.email} autoComplete="email" />
          

          <TextInput label="Password" name="password" type={showPassword ? 'text':'password'} value={form.password} onChange={handleChange} placeholder="Your Password" required rightElement={
            <button type='button' onClick={() => setShowPassword((prev) => !prev)} className='text-xs text-[#6B6B6B] px-2 py-1 rounded' >{showPassword?<EyeOff/>:<Eye/>}</button>
          } error={fieldErrors.password} autoComplete="current-password" />
          

          <div className='flex items-center justify-between'>
            <Link to='/forgot-password' className='text-sm text-[6B6B6B] hover:text-[#0D0D0D]'>Forgot password?</Link>

            <PrimaryButton type='submit' loading={loading}>Sign in</PrimaryButton>
          </div>

          <div className='text-center text-sm text-[#6B6B6B]'>
            Don't have an account{" "}
            <Link to='/register' className='text-[#0D0D0D] font-medium underline'>Create account</Link>
          </div>
        </form>
      </div>
    </main>
  )
}

export default Login