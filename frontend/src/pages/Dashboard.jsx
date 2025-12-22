import React, { useContext } from 'react'
import UserContext from '../context/UserContext';
import StatCard from '../components/StatCard';


const Dashboard = () => {
    const { userData } = useContext(UserContext);
    
    
    const name=userData?.name || "there"
  return (
      <main className='min-h-[calc(100vh-56px)] bg-[#F5F4F1]'>
          <div className='mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8'>
              <div className='grid gap-8 lg:grid-cols-[1.2fr,1fr] items-stretch'>
                  {/* Left */}

                  <section className='bg-white rounded-2xl shadow-sm ring-1 ring-[#EDEDED] p-6 sm:p-8 flex flex-col justify-center'>
                      <p className='text-sm text-[#6B6B6B] mb-1'>Dashboard</p>
                      <h1 className='text-2xl sm:text-3xl font-extrabold text-[#0D0D0D]'>Welcome to SecureNation, {name}</h1>
                      
                      <p className='mt-3 text-sm sm:text-base text-[#4A4A4A] leading-relaxed'>This is your security command center. From here, you can manage your authentication, verify your email, reset your password, and keep your account protected with OTP-based flows.</p>

                      <div className='mt-6 grid gap-4 sm:grid-cols-3'>
                          <StatCard label="Status" value={userData?.isVerified ? "Verified" : "Not Verified"} />
                          <StatCard label="Email" value={userData?.email || "Not set"} />
                          <StatCard label="Sessions" value="Active"/>
                      </div>
                  </section>

                  {/* Right */}
                  <section className='bg-[#0D0D0D] rounded-2xl overflow-hidden shadow-md flex flex-col'>
                      <div className='relative h-40 sm:h-56 md:h-64'>
                          <img src="https://images.unsplash.com/photo-1580894908361-967195033215?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="tech-woman-img" className='h-full w-full object-cover opacity-80' />
                          <div className='absolute inset-0 bg-linear-to-t from-[#0D0D0D] via-transparent to-transparent'></div>
                      </div>

                      <div className='p-5 flex-1 flex flex-col justify-center'>
                          <div>
                              <h2 className='text-lg font-semibold text-[#F8F8F8]'>Your security, always on.</h2>
                              <p className='mt-2 text-sm text-[#C9C9C9]'>
                                  Keep your account protected with email verification, secure password resets, and token based sessions. We handle the auth logic, you focus on building
                              </p>
                          </div>

                          <div className='mt-4 flex flex-wrap gap-2 text-[11px] uppercase tracking-wide'>
                              <span className='rounded-full border bg-[#FF6B00] px-3 py-1 text-[#F8F8F8]'>OTP Enabled</span>
                              <span className='rounded-full border border-[#444444] px-3 py-1 text-[#C9C9C9]'>JWT Sessions</span>
                                <span className='rounded-full border border-[#444444] px-3 py-1 text-[#C9C9C9]'>Secure by Design</span>

                          </div>
                      </div>
                  </section>
              </div>
          </div>
    </main>
  )
}

export default Dashboard