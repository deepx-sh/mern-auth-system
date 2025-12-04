import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
// import axios from 'axios'

import {EyeOff,Eye} from 'lucide-react'

import TextInput from '../../components/ui/TextInput'
import PrimaryButton from '../../components/ui/PrimaryButton'
import apiClient from '../../lib/apiClient';
import { toast } from 'react-toastify';
const Register = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({})
  const [showPassword,setShowPassword]=useState(false)
  
  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  const validate = () => {
      const errors = {};

      if (!form.name.trim()) errors.name = "Name is required"
      if (!form.email.trim()) errors.email = "Email is required"
      else if (!/^\S+@\S+\.\S+$/.test(form.email)) errors.email = "Enter valid email"
      if (!form.password.trim()) errors.password = "Password is required"
      else if(!/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()]).{8,32}$/.test(form.password)) errors.password="Password requires at least one digit, one lowercase letter, one uppercase letter, one special character, and a length between 8 and 32 characters."
    
    setFieldErrors(errors)
    setFormError("");
    return Object.keys(errors).length === 0;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;
    setLoading(true);
    setFormError("");
    setFieldErrors({});

    try {
      const response=await apiClient.post("/auth/register", form);
      toast.success(response?.data?.message)
      localStorage.setItem("pendingEmail", form.email);
      navigate("/verify-email", { state: { email: form.email } });
    } catch (error) {
   
      
      const data = error?.response?.data || {};
      toast.error(data.message)
      
      
      if (data.errors && typeof data.errors === "object" && Object.keys(data.errors).length>0) {
        setFieldErrors(data.errors);
      } else {
        const newFieldError = {};
        if (data.email) newFieldError.email = data.email;
        if (data.name) newFieldError.name = data.name;
        if (data.password) newFieldError.password = data.password;

        if (Object.keys(newFieldError).length) {
          setFieldErrors(newFieldError);
        } else {
          setFormError(data.message || data.error || error.message || "Registration failed")
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
          <h1 className='text-2xl font-extrabold text-[#0D0D0D]'>
            Create your SecureNation account
          </h1>

          <p className='mt-2 text-sm text-[#6B6B6B]'>
            Secure authentication with built in OTP flows.
          </p>
        </div>


        <form onSubmit={handleSubmit} className='bg-white rounded-2xl p-6 shadow-sm ring-1 ring-[#EDEDED] space-y-4'>
          {formError && (
            <div className='rounded-md bg-[#FFEDED] px-3 py-2 text-sm text-[#B03A2E]'>
              {formError}
            </div>
          )}


          <TextInput label="Full name" name="name" value={form.name} onChange={handleChange} placeholder="eg. Deep Prajapati" required error={fieldErrors.name} />
          
          <TextInput label="Email" name="email" type="email" value={form.email} onChange={handleChange} placeholder="you@example.com" required error={fieldErrors.email} autoComplete="email" />
          
          <TextInput label="Password" name="password" type={showPassword? "text": "password"} value={form.password} rightElement={<button type='button' onClick={() => setShowPassword((prev) => !prev)} className='text-xs text-[#6B6B6B] px-2 py-1 rounded'>{ showPassword ? <EyeOff />:<Eye />}</button>} onChange={handleChange} placeholder="At least 8 characters" required error={fieldErrors.password} autoComplete="new-password"/>
        
        
          <PrimaryButton type='submit' loading={loading} className='w-full' >Create account</PrimaryButton>
       
          <div className='text-center text-sm text-[#6B6B6B]'>
            Already have an account?{" "} <Link to="/login" className='text-[#0D0D0D] font-medium underline'>Sign in</Link>
          </div>
        </form>
      </div>
    </main>
  )
}

export default Register