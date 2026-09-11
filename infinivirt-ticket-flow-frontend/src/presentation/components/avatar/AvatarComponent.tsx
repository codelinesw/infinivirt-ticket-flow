import React, { useMemo } from 'react';

interface AvatarProps {
  name: string;
  src?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
  name,
  src,
  size = 'md',
  className = '',
}) => {
  // Obtener iniciales del usuario
  const initials = useMemo(() => {
    if (!name) return 'U';
    const parts = name.trim().split(' ');
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  }, [name]);

  // Generar un color pastel consistente basado en Hash del nombre
  const backgroundColor = useMemo(() => {
    if (src) return '';
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const colors = [
      'bg-[#FE9501]',
      'bg-blue-600',
      'bg-emerald-600',
      'bg-amber-600',
      'bg-violet-600',
      'bg-rose-600',
      'bg-cyan-600',
      'bg-teal-600',
    ];
    const index = Math.abs(hash) % colors.length;
    return colors[index];
  }, [name, src]);

  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
  };

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={`${sizeClasses[size]} rounded-full object-cover ring-2 ring-slate-200 dark:ring-slate-700 ${className}`}
      />
    );
  }

  return (
    <div
      className={`${sizeClasses[size]} ${backgroundColor} flex items-center justify-center rounded-full font-semibold text-white shadow-sm ring-2 ring-white/10 ${className}`}
      title={name}
    >
      {initials}
    </div>
  );
};