import React from "react";
import Navbar from "./components/Navbar";
import { Outlet, useLocation } from "react-router-dom";

const Layout = () => {
  const { pathname } = useLocation();

  const hiddenNavbarRoutes = ["/login", "/register", "/verify-email", "/reset-password", "/forgot-password"];
  
  
  const shouldHideNavbar = hiddenNavbarRoutes.includes(pathname);
  return (
    <>
      {!shouldHideNavbar && <Navbar/>}
      <Outlet />
    </>
  );
};

export default Layout;
