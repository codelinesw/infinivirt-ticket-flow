import React, { useId } from 'react';

export interface SwitchProps {
  /** Estado actual del switch */
  checked: boolean;
  /** Función que se ejecuta al cambiar el estado */
  onChange: (checked: boolean) => void;
  /** Texto o etiqueta descriptiva */
  label?: string;
  /** Posición de la etiqueta respecto al switch */
  labelPosition?: 'left' | 'right';
  /** Deshabilita la interacción */
  disabled?: boolean;
  /** Tamaño del componente */
  size?: 'sm' | 'md' | 'lg';
  /** Clases CSS adicionales para el contenedor */
  className?: string;
}

const sizeClasses = {
  sm: {
    track: 'w-8 h-4',
    thumb: 'w-3 h-3',
    translate: 'translate-x-4',
    text: 'text-xs',
  },
  md: {
    track: 'w-11 h-6',
    thumb: 'w-5 h-5',
    translate: 'translate-x-5',
    text: 'text-sm',
  },
  lg: {
    track: 'w-14 h-7',
    thumb: 'w-6 h-6',
    translate: 'translate-x-7',
    text: 'text-base',
  },
};

export const Switch: React.FC<SwitchProps> = ({
  checked,
  onChange,
  label,
  labelPosition = 'right',
  disabled = false,
  size = 'md',
  className = '',
}) => {
  const id = useId();
  const currentSize = sizeClasses[size];

  const handleToggle = () => {
    if (!disabled) {
      onChange(!checked);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      handleToggle();
    }
  };

  return (
    <label
      htmlFor={id}
      className={`inline-flex items-center gap-3 select-none ${
        disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
      } ${className}`}
    >
      {label && labelPosition === 'left' && (
        <span className={`font-medium text-gray-700 dark:text-gray-200 ${currentSize.text}`}>
          {label}
        </span>
      )}

      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        className={`relative inline-flex items-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 ${
          currentSize.track
        } ${checked ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-700'}`}
      >
        <span
          className={`inline-block transform rounded-full bg-white shadow-md transition-transform duration-200 ease-in-out ${
            currentSize.thumb
          } ${checked ? currentSize.translate : 'translate-x-0.5'}`}
        />
      </button>

      {label && labelPosition === 'right' && (
        <span className={`font-medium text-gray-700 dark:text-gray-200 ${currentSize.text}`}>
          {label}
        </span>
      )}
    </label>
  );
};