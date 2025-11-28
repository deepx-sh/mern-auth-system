import React, { useContext, useState } from 'react'
// import headerLogo from '../assets/header_img.png'
import {ShieldCheck} from 'lucide-react'
import { useNavigate } from 'react-router-dom';
import UserContext from '../context/UserContext';
const Navbar = () => {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  
  const { isLoggedIn, setIsLoggedIn, userData, setUserData } = useContext(UserContext);

  const userName = userData?.name || "";
  const userInit = userName ? userName.charAt(0).toUpperCase() : "?";
  const isVerified = userData?.isVerified;

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserData(null);
    navigate("/login")
  }

  const handleVerifyEmail = () => {
    navigate("");
  }

  const handleResetPassword = () => {
    navigate();
  }

  return (
    <header className='sticky top-0 z-30 w-full border-b border-white/10 bg-[#050505]/90 backdrop-blur'>
      <div className='mx-auto max-w-6xl px-4 sm:px-6 lg:px-8'>
        <div className='flex h-14 items-center justify-between'>
          {/* Header Logo */}
          <div className='flex items-center gap-2'>
            <div className='flex h-8 w-8 items-center justify-center  overflow-hidden'>
              <ShieldCheck size={32} color="#FF6B00" />
            </div>
              <span className='text-md font-semibold text-[#F8F8F8]'>SecureNation</span>
          </div>

          <div className='hidden sm:flex items-center gap-3'>
            {!isLoggedIn ? (
              <>
                <button type='button' className='text-sm text-[#C9C9C9] border hover:text-[#F8F8F8] px-3 py-1.5 rounded-full transition-colors cursor-pointer' onClick={()=> navigate('/login')}>Login</button>
              <button type='button' className='text-sm font-medium px-4 py-1.5 rounded-full bg-[#FF6B00] text-[#F8F8F8] hover:bg-[#E65A00] transition-colors shadow-sm cursor-pointer' onClick={()=> navigate('/register')}>Sign up</button>
              </>
            ) : (
                <div className='relative'>
                  <button type='button' onClick={() => setMenuOpen((prev) => !prev)} className='flex items-center gap-2 rounded-full bg-[#111111] px-2 py-1.5 text-sm text-[#F8F8F8] border border-white/10 hover:bg-[#1A1A1A] transition' >
                    <div className='flex h-8 w-8 items-center justify-center rounded-full bg-[#FF6B00] text-[#F8F8F8] text-sm font-semibold'>
                      {userInit}
                    </div>
                    <span className='hidden md:inline'>
                      {userName || "User"}
                    </span>
                    <svg
                    className="h-4 w-4 text-[#C9C9C9]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 9l6 6 6-6"
                    />
                  </svg>
                  </button>

                  {menuOpen && (
                    <div className='absolute right-0 mt-2 w-48 rounded-lg bg-[#111111] border border-white/10 shadow-lg py-1 text-sm text-[#F8F8F8]'>
                      {!isVerified && (
                        <button type='button' onClick={() => {
                          handleVerifyEmail();
                          setMenuOpen(false);
                        }} className='flex w-full items-center justify-between px-3 py-2 hover:bg-[#1A1A1A] transition'>
                          <span>Verify Email</span>
                          <span className='ml-2 rounded-full bg-[#FF6B00] px-2 py-[1px] text-[10px] uppercase tracking-wide'>Pending</span>
                        </button>
                      )}

                      <button type='button' onClick={() => {
                        handleResetPassword();
                        setMenuOpen(false);
                      }} className='w-full text-left px-3 py-2 hover:bg-[#1A1A1A] transition'>Reset Password</button>

                      <button type='button' onClick={() => {
                        handleLogout();
                        setMenuOpen(false);
                      }} className='w-full text-left px-3 py-2 text-[#FF6B00] hover:bg-[#1A1A1A] transition'>Logout</button>
                    </div>
                  )}
                </div>
              )}
          </div>

          {/* Mobile Menu */}
          <button type='button' onClick={() => setMobileOpen((prev) => !prev)} className='sm:hidden inline-flex h-9 w-9 items-center justify-center rounded-md border border-white/10 bg-[#111111] text-[#F8F8F8] hover:bg-[#1A1A1A] transition-colors' aria-label={mobileOpen ? "Close menu" : "Open menu"} aria-expanded={mobileOpen}>
            {mobileOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x-icon lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            ): (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-menu-icon lucide-menu"><path d="M4 5h16"/><path d="M4 12h16"/><path d="M4 19h16"/></svg>)}
          </button>
          </div>
      </div>

      <div className={`sm:hidden border-t  border-white/10 bg-[#050505]/95 transition-all duration-200 ease-out ${mobileOpen? "max-h-32 opacity-100": "max-h-0 opacity-0"} overflow-hidden`}>
        <div className='mx-auto max-w-6xl px-4 py-3 space-y2'>
          {!isLoggedIn ? (
            <>
              <button type='button' onClick={()=> navigate('/login')} className='w-full text-left text-sm text-[#C9C9C9] hover:text-[#F8F8F8] px-3 py-2 rounded-md hover:bg-[#111111] transition-colors'>Login</button>
          
          <button type='button' className='w-full text-sm mt-2 font-medium px-3 py-2 rounded-full bg-[#FF6B00] text-[#F8F8F8] hover:bg-[#E65A00] transition-colors shadow-sm' onClick={()=> navigate('/register')}>Sign up</button>
            </>
          ) : (
              <>
                <div className='flex items-center gap-3 px-3 py-2'>
                  <div className='flex h-8 w-8 items-center justify-center rounded-full bg-[#FF6B00] text-[#F8F8F8] text-sm font-semibold'>
                    {userInit}
                  </div>

                  <div className='flex flex-col'>
                    <span className='text-sm text-[#F8F8F8]'>
                      {userName || "User"}
                    </span>

                    {!isVerified && (
                      <span className='text-[11px] text-[#FF6B00]'>Email not verified</span>
                    )}
                  </div>
                </div>


                {!isVerified && (
                  <button type='button' onClick={handleVerifyEmail} className='w-full text-left text-sm px-3 py-2 hover:bg-[#111111] text-[#F8F8F8]'>Verify Email</button>
                )}

                <button type='button' onClick={handleResetPassword} className='w-full text-left text-sm px-3 py-2 hover:bg-[#111111] text-[#F8F8F8]'>Reset Password</button>
                                  <button type='button' onClick={handleLogout} className='w-full text-left text-sm px-3 py-2 hover:bg-[#111111] text-[#F8F8F8]'>Logout</button>


              </>
          )}
            </div>
      </div>
    </header>
  )
}

export default Navbar