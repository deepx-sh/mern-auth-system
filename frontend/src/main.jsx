import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import Home from "./pages/Home.jsx";
import Layout from "./layout.jsx";
import VerifyEmailOtp from "./pages/auth/VerifyEmailOtp.jsx";
import ResetPassword from "./pages/auth/ResetPassword.jsx";
import ForgetPassword from "./pages/auth/ForgetPassword.jsx";
import Login from "./pages/auth/Login.jsx";
import Register from "./pages/auth/Register.jsx";
import UserContextProvider from "./context/UserContextProvider.jsx";
import {ToastContainer} from 'react-toastify'
import Dashboard from "./pages/Dashboard.jsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />}>
      <Route path="" element={<Home />} />
      <Route path="verify-email" element={<VerifyEmailOtp />} />
      <Route path="reset-password" element={<ResetPassword />} />
      <Route path="forgot-password" element={<ForgetPassword />} />
      <Route path="register" element={ <Register/>} />
      <Route path="login" element={<Login />} />
      <Route path="dashboard" element={<Dashboard/>}/>
    </Route>
  )
);
createRoot(document.getElementById("root")).render(
  <StrictMode>
     <UserContextProvider>
    <RouterProvider router={router}>
     
        <App />
     
      </RouterProvider>
       </UserContextProvider>
    <ToastContainer position="top-right" autoClose={ 2500} hideProgressBar={false} newestOnTop closeOnClick pauseOnHover theme="dark" />
  </StrictMode>
);
