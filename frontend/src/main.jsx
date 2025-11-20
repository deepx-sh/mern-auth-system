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

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />}>
      <Route path="" element={<Home />} />
      <Route path="verify-email" element={<VerifyEmailOtp />} />
      <Route path="reset-password" element={<ResetPassword />} />
      <Route path="forget-password" element={<ForgetPassword />} />
      <Route path="login" element={<Login/> } />
    </Route>
  )
);
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router}>
      <App />
    </RouterProvider>
  </StrictMode>
);
