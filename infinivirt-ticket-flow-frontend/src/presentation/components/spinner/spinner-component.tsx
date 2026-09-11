// Definimos tamaños predeterminados para que sea fácil de reusar
const SIZES: any = {
  sm: 'h-4 w-4 border-2',
  md: 'h-8 w-8 border-4',
  lg: 'h-12 w-12 border-4',
  xl: 'h-16 w-16 border-[6px]',
};

// Definimos colores predeterminados de Tailwind
const COLORS: any = {
  primary: 'border-[#FE9501]',
  secondary: 'border-gray-600',
  success: 'border-green-600',
  danger: 'border-red-600',
  warning: 'border-yellow-500',
  white: 'border-white',
};

export default function Spinner({
  size = 'md',          // Tamaño predeterminado
  color = 'primary',    // Color predeterminado
  label = 'Cargando...', // Texto para lectores de pantalla
  className = '',       // Clases extras para margen, posición, etc.
}) {
  // Combinamos las clases base con las props
  const spinnerClasses = [
    'inline-block',
    'animate-spin',          // Animación de rotación (Tailwind nativo)
    'rounded-full',          // Lo hace circular
    'border-solid',          // Tipo de borde
    'border-t-transparent',  // Oculta la parte superior para crear el efecto de arco
    SIZES[size] || SIZES.md,
    COLORS[color] || COLORS.primary,
    className,
  ].join(' ');

  return (
    // 'role="status"' informa a la tecnología asistiva que el contenido es dinámico
    <div className="flex items-center justify-center" role="status">
      <div className={spinnerClasses}>
        {/* Texto oculto visualmente pero legible para lectores de pantalla (SEO/Accesibilidad) */}
        <span className="sr-only">{label}</span>
      </div>
    </div>
  );
}