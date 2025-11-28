import React, { useEffect, useState } from 'react'
import UserContext from './UserContext';

const UserContextProvider = ({ children }) => {
    // const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(() => {
    const stored = localStorage.getItem("userData");
    return stored ? JSON.parse(stored) : null;
  });

  const isLoggedIn=!!userData
  
  useEffect(() => {
    if (userData) {
      localStorage.setItem("userData", JSON.stringify(userData));
      
    } else {
      localStorage.removeItem("userData");
     
    }
  }, [userData])
  
  const setIsLoggedIn = (value) => {
    if (!value) {
      setUserData(null);
    }
  }
  return (
      <UserContext.Provider value={{ isLoggedIn, setIsLoggedIn, userData, setUserData }}>
          {children}
    </UserContext.Provider>
  )
}

export default UserContextProvider