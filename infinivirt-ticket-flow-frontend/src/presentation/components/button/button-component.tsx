import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Variante de estilo del botón */
  color?: 'white' | 'primary';
  /** Texto plano opcional cuando no se pasan componentes/iconos en children */
  text?: string;
  /** Estado de carga que deshabilita el botón */
  loading?: boolean;
}

const variantClasses = {
  white:
    'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 shadow-sm focus:ring-slate-300',
  primary:
    'bg-[#FE9501] text-white shadow-md shadow-[#FE9501]-600/20 hover:bg-[#FE9501]-700 focus:ring-[#FE9501]-500',
};

export const Button: React.FC<ButtonProps> = ({
  color = 'primary',
  text,
  children,
  className = '',
  disabled,
  loading = false,
  type = 'button',
  ...props
}) => {
  const isDisabled = disabled || loading;

  return (
    <button
      type={type}
      disabled={isDisabled}
      className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 ${
        variantClasses[color]
      } ${
        isDisabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
      } ${className}`}
      {...props}
    >
      {/* Prioriza children sobre la prop text */}
      {children ?? text}
    </button>
  );
};