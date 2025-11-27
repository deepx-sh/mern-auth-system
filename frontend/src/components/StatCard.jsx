import React from 'react'

const StatCard = ({label,value}) => {
  return (
      <div className='rounded-xl bg-[#F5F4F1] px-4 py-3'>
          <p className='text-cs text-[#6B6B6B]'>{label}</p>
          <p className='mt-1 text-sm font-semibold text-[#0D0D0D] truncate'>{ value}</p>
    </div>
  )
}

export default StatCard