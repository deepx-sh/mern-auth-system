import React from 'react'

const FeatureCard = ({title,desc,icon}) => {
  return (
      <div className='rounded-2xl border border-[#EDEDED] bg-white p-5 shadow-sm'>
          <div className='flex  items-center gap-4'>
              <div className='flex h-10 w-10 items-center justify-center rounded-lg text-[#FFB00] '>
                  {icon}
              </div>
              <div>
                  <h3 className='text-sm font-semibold text-[#0D0D0D]'>
                      {title}
                  </h3>
                  <p className='mt-1 text-xs text-[#6B6B6B]'>{desc}</p>
              </div>
          </div>
    </div>
  )
}

export default FeatureCard