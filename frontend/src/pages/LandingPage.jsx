import { CheckCheck } from 'lucide-react';
import React, { useContext } from 'react'
import { Link } from 'react-router-dom';
import FeatureCard from '../components/FeatureCard';
import UserContext from '../context/UserContext';

const LandingPage = () => {

    const { isLoggedIn } = useContext(UserContext);
  return (
      <div className='min-h-screen bg-[#F5F4F1] text-[#0D0D0D]'>
          
          {/* Hero */}
          <main className='mx-auto max-w-7xl px-6 lg:px-8'>
              <section className='pt-12 pb-10 lg:pt-20 lg:pb-24'>
                  <div className='grid grid-cols-1 gap-8 lg:grid-cols-2 lg:items-center'>
                      
                      {/* Left Content */}
                      <div className='mx-auto max-w-xl text-center sm:text-left lg:mx-0'>
                          <h1 className='text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl lg:text-5xl'>
                              SecureNation <span className='text-[#FF6B00]'>Security, done right.</span>
                          </h1>

                          <p className='mt-4 text-md text-[#333333] max-w-xl'>
                              Simple,robust authentication and account protection for modern apps.
                              Emails OTPs, password reset flows, token-based  sessions built with security-first defaults.
                          </p>

                          {isLoggedIn ? (
                               <div className='mt-8'>
                                       <Link to="/dashboard" className='inline-flex items-center justify-center rounded-full bg-[#FF6B00] px-5 py-2.5 text-sm font-medium text-[#F8F8F8] hover:bg-[#E65A00] transition-colors text-shadow-sm'>
                                Dashboard
                              </Link>
                                  </div>
                          ) : (
                             <div className='mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4'>
                              <Link to="/register" className='inline-flex items-center justify-center rounded-full bg-[#FF6B00] px-5 py-2.5 text-sm font-medium text-[#F8F8F8] hover:bg-[#E65A00] transition-colors text-shadow-sm'>
                                Get started
                              </Link>

                              <Link to="/login" className='inline-flex items-center justify-center rounded-md  border border-[#333333] px-4 py-2 text-sm text-[#0D0D0D] bg-white hover:bg-[#F0F0F0] transitions-colors'>
                                Sign in
                              </Link>
                          </div>    
                          )}
                          <div className='mt-6 flex items-center gap-2.5 text-sm text-[#6B6B6B]'>
                              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#E65A00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-circle-check-icon lucide-circle-check"><circle cx="12" cy="12" r="10" /><path d="m9 12 2 2 4-4" /></svg>
                              <span>Trusted by developers easy integration, strong defaults</span>
                          </div>
                      </div>

                      {/* Right Content */}

                      <div className='mx-auto max-w-xl lg:mx-0'>
                          <div className='relative rounded-2xl bg-white/80 p-6 ring-1 ring-[#333333] shadow-xl'>
                              
                              <div className='flex items-center justify-between gap-4'>
                                  <div>
                                      <div className='rounded-lg bg-[#F5F4F1] inline-flex p-2'>
                                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#E65A00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-star-icon lucide-star"><path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"/></svg>
                                      </div>
                                      <h3 className='mt-4 text-lg font-semibold'>Enterprise ready Auth</h3>
                                      <p className='mt-2 text-sm text-[#6B6B6B]'>OTP verification, session management, and reset flows with security first defaults</p>
                                  </div>

                                  <div className='hidden md:block'>
                                      <div className='rounded-md bg-[#F5F4F1] p-3 text-sm text-[#333333] ring-1 ring-[#EDEDED]'>
                                          <div className='flex flex-col gap-2'>
                                              <div className='text-xs text-[#6B6B6B]'>Example</div>
                                              <div className='rounded bg-[#0D0D0D] px-3 py-1 text-[#F8F8F8] text-xs font-mono'>POST /api/auth/register</div>
                                          </div>
                                      </div>
                                  </div>
                              </div>

                              {/* Small metrics */}
                              <div className='mt-6 grid grid-cols-3 gap-3'>
                                  <div className='rounded-md bg-[#F5F4F1] px-3 py-2 text-center'>
                                      <div className='text-sm font-medium text-[#0D0D0D]'>99.99%</div>
                                      <div className='text-xs text-[#6B6B6B]'>Uptime</div>
                                  </div>
                                  <div className='rounded-md bg-[#F5F4F1] px-3 py-2 text-center'>
                                      <div className='text-sm font-medium text-[#0D0D0D]'>5 mins</div>
                                      <div className='text-xs text-[#6B6B6B]'>OTP expiry</div>
                                  </div>
                                  <div className='rounded-md bg-[#F5F4F1] px-3 py-2 text-center'>
                                       <div className='text-sm font-medium text-[#0D0D0D]'>Easy</div>
                                      <div className='text-xs text-[#6B6B6B]'>Integration</div>
                                  </div>
                              </div>
                          </div>
                      </div>
                  </div>
              </section>

              {/* Features Section */}

              <section className='py-8 lg:py-12'>
                  <div className='mx-auto max-w-4xl text-center'>
                      <h2 className='text-ld font-semibold'>What we handle for you</h2>
                      <p className='mt-2 text-sm text-[#6B6B6B]'>Focus on product we take care of authentication and security flows</p>
                  </div>

                  <div className='mt-8 grid  gap-6 sm:grid-cols-2 lg:grid-cols-3'>
                      <FeatureCard title="Email OTP" desc="Secure, time-limited OTPs for signup and password resets" icon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#E65A00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-mail-check-icon lucide-mail-check"><path d="M22 13V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v12c0 1.1.9 2 2 2h8"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/><path d="m16 19 2 2 4-4"/></svg>}/>
                        <FeatureCard title="Password Reset" desc="Secure reset flows with single-use tokens after OTP verification" icon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#E65A00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-key-round-icon lucide-key-round"><path d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z"/><circle cx="16.5" cy="7.5" r=".5" fill="currentColor"/></svg>}/>
                    <FeatureCard title="Token-based Sessions" desc="JWT access token patterns with httpOnly cookies support." icon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#E65A00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-cookie-icon lucide-cookie"><path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5"/><path d="M8.5 8.5v.01"/><path d="M16 15.5v.01"/><path d="M12 12v.01"/><path d="M11 17v.01"/><path d="M7 14v.01"/></svg>}/>
                  </div>
              </section>
          </main>
    </div>
  )
}

export default LandingPage