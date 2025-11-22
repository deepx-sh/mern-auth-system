import React from 'react'

const PrimaryButton = ({children,loading=false,disabled=false,className="",type="button",...rest}) => {
  
    const isDisabled = disabled || loading;

    return (
        <button type={type} disabled={isDisabled} aria-busy={loading} className={`inline-flex items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-medium ${isDisabled ? "opacity-60 cursor-not-allowed" : ""} bg-[#FF6B00] text-[#F8F8F8] hover:bg-[#E65A00] transition shadow-sm ${className}`} {...rest}>
            {loading && (
                 <svg
          className="h-4 w-4 animate-spin"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.25)" strokeWidth="4" />
          <path d="M22 12a10 10 0 00-10-10" stroke="#fff" strokeWidth="4" strokeLinecap="round" />
        </svg>
            )}

            <span>{ children}</span>
    </button>
  )
}

export default PrimaryButton