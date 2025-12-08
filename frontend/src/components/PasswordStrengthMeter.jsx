import React from 'react'

const PasswordStrengthMeter = ({password}) => {
    const getStrength = (pass) => {
        let score = 0;
        if (!pass) return score;

        if (pass.length > 8) score += 1;
        if (/[A-Z]/.test(pass)) score += 1;
        if (/[0-9]/.test(pass)) score += 1;
        if (/[^A-Za-z0-9]/.test(pass)) score += 1;
        
        return score;
    }

    const score = getStrength(password);

    const getColor = () => {
        switch (score) {
            case 0: return 'bg-gray-200';
            case 1: return 'bg-red-500';
            case 2: return 'bg-orange-500';
            case 3: return 'bg-yellow-500';
            case 4: return 'bg-green-500';
            default: return 'bg-gray-200';
        }
    }

    const getLabel = () => {
        switch (score) {
            case 0: return 'Very Weak';
            case 1: return 'Weak';
            case 2: return 'Fair';
            case 3: return 'Good';
            case 4: return 'Strong';
            default: return '';
        }
    }
  return (
      <div className='mt-2'>
          <div className='flex justify-between items-center mb-1'>
              <span className='text-xs text-[#6B6B6B]'>Password strength</span>
              <span className='text-xs font-medium text-[#0D0D0D]'>{ getLabel()}</span>
          </div>

          <div className='h-1.5 w-full bg-gray-200 rounded-full overflow-hidden'>
              <div className={`h-full ${getColor()} transition-all duration-300 ease-out`} style={{width:`${(score/4)*100}%`}}></div>
          </div>

          <ul className='mt-2 space-y-1'>
              <li className={`text-[10px] flex items-center gap-1 ${password.length >= 8 ? 'text-green-600' : 'text-gray-400'}`}>
                  <span>•</span>At least 8 characters
              </li>

              <li className={`text-[10px] flex items-center gap-1 ${/[A-Z]/.test(password)? 'text-green-600' : 'text-gray-400'}`}>
                  <span>•</span>Uppercase letter
              </li>
              
              <li className={`text-[10px] flex items-center gap-1 ${/[0-9]/.test(password) ? 'text-green-600' : 'text-gray-400'}`}>
                  <span>•</span>Number
              </li>
              
              <li className={`text-[10px] flex items-center gap-1 ${/[^A-Za-z0-9]/.test(password) ? 'text-green-600' : 'text-gray-400'}`}>
                  <span>•</span>Special character
              </li>
          </ul>
      </div>
      
      
  )
}

export default PasswordStrengthMeter