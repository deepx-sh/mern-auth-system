import React from "react";
import Navbar from "./components/Navbar";
import { Outlet, useLocation } from "react-router-dom";
import {ErrorBoundary} from 'react-error-boundary'
import PageErrorBoundary from "./components/PageErrorBoundary";
import ErrorFallback from "./components/ErrorFallback";

const Layout = () => {
  const { pathname } = useLocation();

  const hiddenNavbarRoutes = ["/login", "/register", "/verify-email", "/reset-password", "/forgot-password","/verify-reset-otp"];
  
  
  const shouldHideNavbar = hiddenNavbarRoutes.includes(pathname);
  return (
    <>
      {!shouldHideNavbar && <Navbar/>}
      <ErrorBoundary FallbackComponent={PageErrorBoundary} resetKeys={[pathname]}>
        <Outlet />
      </ErrorBoundary>
    </>
  );
};

export default Layout;
