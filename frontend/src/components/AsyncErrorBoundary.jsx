import React from 'react'
import { ErrorBoundary } from 'react-error-boundary';
import { toast } from 'react-toastify';

const AsyncErrorBoundary = ({ children, onReset }) => {
    
    const handleError = ({ error, errorInfo }) => {
        console.error('Async operation error:', error, errorInfo);
        toast.error('An error occurred during the operation', {
            toastId:'async-error'
        })
    }
  return (
      <ErrorBoundary onError={handleError} onReset={onReset} fallbackRender={({ resetErrorBoundary }) => (
          <div className='p-4 text-center'>
              <p className='text-sm text-[#6B6B6B] mb-3'>
                  Something went wrong during this operation
              </p>

              <button onClick={resetErrorBoundary} className='px-4 py-2 bg-[#FF6B00] text-white rounded-full hover:bg-[#E65A00] transition text-sm'>
                  Try again
              </button>
          </div>
      )}>
          {children}
    </ErrorBoundary>
  )
}

export default AsyncErrorBoundary