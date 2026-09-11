import { useState, type ComponentPropsWithoutRef, type ReactNode } from "react";

interface Iinput extends ComponentPropsWithoutRef<"input"> {
    label?: string;
    Icon?: ReactNode;
    isError?: boolean
    isRequired?: boolean
}

export const Input: React.FC<Iinput> = ({
    id,
    type = "text",
    label,
    Icon,
    placeholder,
    isError,
    isRequired,
    ...props
}) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPasswordType = type === "password";

    // Determina el tipo de input actual si es de tipo contraseña
    const currentType = isPasswordType
        ? (showPassword ? "text" : "password")
        : type;

    // Genera un ID fallback si no se proporciona uno para que el label funcione correctamente
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);
return (
        <div>
            {label && (
                <label 
                    htmlFor={inputId} 
                    className="mb-2 text-slate-900 dark:text-slate-50 font-medium text-sm inline-block flex"
                >
                    {label}
                    {isRequired && <span className="text-rose-500 translate-x-2">*</span>}
                </label>
            )}
            <div className="relative flex items-center">
                {Icon && (
                    <div className="absolute left-2 flex items-center pointer-events-none text-slate-500">
                        {Icon}
                    </div>
                )}
                <input
                    {...props}
                    id={inputId}
                    type={currentType}
                    placeholder={placeholder || ""}
                    className={`px-2.5 py-2 h-10 text-sm text-slate-900 dark:text-slate-50 rounded-md bg-[#F6F6F7] dark:bg-neutral-800 w-full dark:outline-neutral-700 focus:outline-2 focus:-outline-offset-2 focus:outline-[#E08D1B] ${
                        Icon ? "pl-10" : "pl-3"
                    } ${isPasswordType ? "pr-10 pl-12" : "pr-10 pl-12"} ${isError ? 'border border-red-500 placeholder-red-500' : ''}`}
                />
                
                {isPasswordType && (
                    <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="absolute right-3 flex items-center text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 focus:outline-none"
                        aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                    >
                        {showPassword ? (
                            /* Icono Ojo Tachado (Ocultar) */
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                            </svg>
                        ) : (
                            /* Icono Ojo (Mostrar) */
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12c1.274 4.057 5.065 7 9.542 7 4.477 0 8.268-2.943 9.542-7-1.274-4.057-5.064-7-9.542-7-4.477 0-8.268 2.943-9.542 7z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                        )}
                    </button>
                )}
            </div>
        </div>
    );
}