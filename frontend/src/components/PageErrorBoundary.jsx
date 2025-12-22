import React from 'react'
import { useNavigate } from 'react-router-dom';


const PageErrorBoundary = ({ error, resetErrorBoundary}) => {
    const navigate = useNavigate();

    const handleGoHome = () => {
        resetErrorBoundary();
        navigate('/');
    }
  return (
      <div className='min-h-[60vh] flex items-center justify-center p-6'>
          <div className='max-w-md w-full text-center'>
              <div className='mb-6'>
                  <div className='inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-100 mb-4'>
                      <svg
              className='w-10 h-10 text-red-600'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z'
              />
            </svg>
                  </div>
                  <h2 className='text-xl font-semibold text-[#0D0D0D] mb-2'>
                      Page Error
                  </h2>

                  <p className='text-sm text-[#6B6B6B]'>This page encountered an error and could't be displayed</p>
              </div>

              {import.meta.env.DEV && (
                  <div className='mb-6 p-3 bg-red-50 rounded-lg text-left'>
                      <p className='text-xs font-mono text-red-800 wrap-break-word'>
                          {error?.message}
                      </p>
                  </div>
              )}

              <div className='space-y-2'>
                  <button onClick={resetErrorBoundary} className='w-full px-4 py-2 bg-[#FF6B00] text-white rounded-full hover:bg-[#E65A00] transition text-sm font-medium'>
                      Try again
                  </button>

                  <button onClick={handleGoHome} className='w-full px-4 py-2 border border-[#EDEDED] text-[#6B6B6B] rounded-full hover:bg-[#F5F4F1] transition text-sm' >
                        Go to home
                  </button>
              </div>
          </div>
    </div>
  )
}

export default PageErrorBoundary