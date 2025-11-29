import { useContext } from "react";
import UserContext from "../context/UserContext";
import { Navigate, Outlet, useLocation } from "react-router-dom";

export const RequireAuth = () => {
    const { isLoggedIn } = useContext(UserContext);
    const location = useLocation();

    if (!isLoggedIn) {
        return <Navigate to="/login" state={{from:location}} replace/>
    }

    return <Outlet/>
};


export const RedirectIfAuth = () => {
    const { isLoggedIn } = useContext(UserContext);
    const location = useLocation();

    if (isLoggedIn) {
        const redirectTo = location.state?.from?.pathname || "/dashboard";
        console.log(location.state);
        
        return <Navigate to={ redirectTo} replace />
    }

    return <Outlet/>
}