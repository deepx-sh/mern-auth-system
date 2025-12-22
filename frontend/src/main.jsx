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
import Layout from "./Layout.jsx";
import VerifyEmailOtp from "./pages/auth/VerifyEmailOtp.jsx";
import ResetPassword from "./pages/auth/ResetPassword.jsx";
import ForgetPassword from "./pages/auth/ForgetPassword.jsx";
import Login from "./pages/auth/Login.jsx";
import Register from "./pages/auth/Register.jsx";
import UserContextProvider from "./context/UserContextProvider.jsx";
import { ToastContainer } from "react-toastify";
import Dashboard from "./pages/Dashboard.jsx";
import VerifyResetOtp from "./pages/auth/VerifyResetOtp.jsx";
import { RedirectIfAuth, RequireAuth } from "./routes/guards.jsx";
import SessionPage from "./pages/SessionPage.jsx";
import {ErrorBoundary} from "react-error-boundary"
import PageErrorBoundary from "./components/PageErrorBoundary.jsx";
import ErrorFallback from "./components/ErrorFallback.jsx";


const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />}>
      <Route index element={<Home />} />
      <Route element={<RedirectIfAuth />}>
         
        
        <Route path="register" element={<Register />} />
        <Route path="login" element={<Login />} />
      </Route>
      
      <Route path="verify-email" element={<VerifyEmailOtp />} />
        <Route path="reset-password" element={<ResetPassword />} />
        <Route path="forgot-password" element={<ForgetPassword />} />
        <Route path="verify-reset-otp" element={<VerifyResetOtp />} />
      <Route element={<RequireAuth />}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="session" element={<SessionPage/>} />
      </Route>
     
    </Route>
  )
);

const errorHandler = (error, errorInfo) => {
  console.error("Global Error Boundary caught on error: ",error,errorInfo)
}
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ErrorBoundary FallbackComponent={ErrorFallback} onError={errorHandler} onReset={() => { window.location.href = '/'; }}>
      <UserContextProvider>
      <RouterProvider router={router}>
        <App />
      </RouterProvider>
    </UserContextProvider>
    <ToastContainer
      position="top-right"
      autoClose={3000}
      hideProgressBar={false}
      newestOnTop
      closeOnClick
      pauseOnHover
      theme="dark"
      preventDuplicates
    />
    </ErrorBoundary>
  </StrictMode>
);
