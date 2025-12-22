import { AlertTriangle } from 'lucide-react';
import React from 'react'
import PrimaryButton from './ui/PrimaryButton';

const ErrorFallback = ({error,resetErrorBoundary}) => {
  return (
      <div className='min-h-screen flex items-center justify-center bg-[#F5F4F1] p-6'>
          <div className='w-full max-w-md'>
              <div className='bg-white rounded-2xl p-8 shadow-lg ring-1 ring-[#EDEDED]'>
                  <div className='flex justify-center mb-6'>
                      <div className='w-16 h-16  rounded-full bg-red-100 flex items-center justify-center'>
                          <AlertTriangle className='w-8 h-8 text-red-600'/>
                      </div>
                  </div>

                  <h1 className='text-2xl font-bold text-center text-[#0D0D0D] mb-3'>
                      Oops! Something went wrong
                  </h1>

                  <p className='text-sm text-center text-[#6B6B6B] mb-6'>
                      We encountered an unexpected error. Don't worry, your data is safe.
                  </p>

                  {import.meta.env.DEV && (
                      <div className='mb-6 p-4 bg-[#FFF5F5] rounded-lg border border-[#FED7D7]'>
                          <p className='text-xs font-mono text-red-800 wrap-break-word'>
                              {error?.message || 'Unknown error'}
                          </p>

                          {error?.stack && (
                              <details className='mt-2'>
                                  <summary className='text-xs text-red-600 cursor-pointer hover:text-red-800'>
                                      View stack trace
                                  </summary>

                                  <pre className='mt-2 text-[10px] text-red-700 overflow-auto max-h-40'>
                                      {error.stack}
                                  </pre>
                              </details>
                          )}
                      </div>
                  )}

                  <div className='space-y-3'>
                      <PrimaryButton onClick={resetErrorBoundary} className='w-full'>
                          Try again
                      </PrimaryButton>

                      <button onClick={()=> window.location.href='/'} className='w-full px-4 py-2 text-sm text-[#6B6B6B] hover:text-[#0D0D0D] border border-[#EDEDED] rounded-full hover:bg-[#F5F4F1] transition'>Go to home</button>
                  </div>

                  <p className='mt-6 text-xs text-center text-[#999]'>
                      If this problem persists, please{' '} <a href="mailto:dvprajapati7212@gmail.com" className='text-[#FF6B00] underline'>Contact support</a>
                  </p>
              </div>
          </div>
    </div>
  )
}

export default ErrorFallback