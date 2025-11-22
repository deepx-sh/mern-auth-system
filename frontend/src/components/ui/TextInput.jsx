import React from 'react'

const TextInput = ({label,name,type="text",value,onChange,placeholder,error,rightElement,className="",autoComplete,required=false,disabled=false,...rest}) => {
  
    const inputId = `input_${name}`;
    return (
        <label className={`block ${className}`}>
            {label && (
                <span className='text-xs text-[#6B6B6B]'>
                    {label} {required?<span className='ml-0.5 text-[#B03A2E]'>*</span>:null}
                </span>
            )}

            <div className='mt-1 relative'>
                <input
                    id={inputId}
                    name={name}
                    type={type}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    autoComplete={autoComplete}
                    required={required}
                    disabled={disabled}
                    aria-invalid={!!error}
                    aria-describedby={error ? `${inputId}-error` : undefined}
                    className={`w-full rounded-lg border border-[#EDEDED] px-3 py-2 text-sm bg-white text-[#0D0D0D] focus:outline-none focus:ring-2 focus:ring-[#FF6B00]/40 pr-${rightElement ? "12" : "3"}`}
                    {...rest}
                />

                {rightElement && (
                    <div className='absolute inset-y-0 right-2 flex items-center'>{ rightElement}</div>
                )}
            </div>

            {error && (
                <p id={`${inputId}-error`} className='mt-2 text-xs text-[#B03A2E]'>
                    {typeof error==="string"?error:"Invalid input"}
                </p>
            )}

        </label>
  )
}

export default TextInput