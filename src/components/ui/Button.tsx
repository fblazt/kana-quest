import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  variant = 'primary', 
  fullWidth = false, 
  className = '', 
  children, 
  ...props 
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-sans font-medium rounded-md px-6 py-3 transition-colors duration-200 cursor-pointer';
  const widthStyles = fullWidth ? 'w-full' : '';
  
  let variantStyles = '';
  switch (variant) {
    case 'primary':
      variantStyles = 'bg-primary text-on-primary hover:bg-primary-container hover:text-on-primary-container';
      break;
    case 'secondary':
      variantStyles = 'bg-secondary text-on-secondary hover:bg-secondary-container hover:text-on-secondary-container';
      break;
    case 'outline':
      variantStyles = 'border border-outline text-on-surface hover:bg-surface-variant';
      break;
  }

  return (
    <button 
      className={`${baseStyles} ${widthStyles} ${variantStyles} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
