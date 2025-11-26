import React, { useState } from 'react'
// import headerLogo from '../assets/header_img.png'
import {ShieldCheck} from 'lucide-react'
import { useNavigate } from 'react-router-dom';
const Navbar = () => {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

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
              <button type='button' className='text-sm text-[#C9C9C9] border hover:text-[#F8F8F8] px-3 py-1.5 rounded-full transition-colors cursor-pointer' onClick={()=> navigate('/login')}>Login</button>
              <button type='button' className='text-sm font-medium px-4 py-1.5 rounded-full bg-[#FF6B00] text-[#F8F8F8] hover:bg-[#E65A00] transition-colors shadow-sm cursor-pointer' onClick={()=> navigate('/register')}>Sign up</button>
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
          <button type='button' onClick={()=> navigate('/login')} className='w-full text-left text-sm text-[#C9C9C9] hover:text-[#F8F8F8] px-3 py-2 rounded-md hover:bg-[#111111] transition-colors'>Login</button>
          
          <button type='button' className='w-full text-sm mt-2 font-medium px-3 py-2 rounded-full bg-[#FF6B00] text-[#F8F8F8] hover:bg-[#E65A00] transition-colors shadow-sm' onClick={()=> navigate('/register')}>Sign up</button>
            </div>
      </div>
    </header>
  )
}

export default Navbar