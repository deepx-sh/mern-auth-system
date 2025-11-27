import React, { useState } from 'react'
import UserContext from './UserContext';

const UserContextProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userData, setUserData] = useState(null);
  return (
      <UserContext.Provider value={{ isLoggedIn, setIsLoggedIn, userData, setUserData }}>
          {children}
    </UserContext.Provider>
  )
}

export default UserContextProvider