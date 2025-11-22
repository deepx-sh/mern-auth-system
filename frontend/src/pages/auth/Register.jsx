import React, { useState } from 'react'
import {useNavigate}  from 'react-router-dom'
const Register = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({})
  
  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  const validate = () => {
      const errors = {};

      if (!form.name.trim()) errors.name = "Name is required"
      if (!form.email.trim()) errors.email = "Email is required"
      else if (!/^\S+@\S+\.\S+$/.test(form.email)) errors.email = "Enter valid email"
      if (!form.password.trim()) errors.password = "Password is required"
      else if(!/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#\$%^&*()]).{8,32}$/.test(form.password)) errors.password="Password requires at least one digit, one lowercase letter, one uppercase letter, one special character, and a length between 8 and 32 characters."
    
    setFieldErrors(errors)
    setFormError("");
    return Object.keys(errors).length === 0;
  }
  return (
    <div>Register</div>
  )
}

export default Register