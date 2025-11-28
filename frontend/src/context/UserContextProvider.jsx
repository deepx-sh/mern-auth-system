import React, { useEffect, useState } from 'react'
import UserContext from './UserContext';

const UserContextProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(() => {
    const stored = localStorage.getItem("userData");
    return stored ? JSON.parse(stored) : null;
  });
  
  useEffect(() => {
    if (userData) {
      localStorage.setItem("userData", JSON.stringify(userData));
      setIsLoggedIn(true);
    } else {
      localStorage.removeItem("userData");
      setIsLoggedIn(false)
    }
  },[userData])
  return (
      <UserContext.Provider value={{ isLoggedIn, setIsLoggedIn, userData, setUserData }}>
          {children}
    </UserContext.Provider>
  )
}

export default UserContextProvider