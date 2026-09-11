import React from "react";
import { useState, type ReactNode } from "react";
import { AlertTriangle, Info, XCircle, CheckCircle, X } from "lucide-react";

export type AlertVariant = "warning" | "info" | "error" | "success";

interface AlertProps {
  variant?: AlertVariant;
  title?: string;
  children: ReactNode;
  dismissible?: boolean; // Habilita o deshabilita el botón de cerrar
  onClose?: () => void;  // Callback opcional al cerrar
}

const variantStyles: Record<AlertVariant, { container: string; icon: ReactNode }> = {
  warning: {
    container: "bg-amber-50 text-amber-900 border-amber-200 dark:bg-amber-950/40 dark:text-amber-200 dark:border-amber-800",
    icon: <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0" />,
  },
  info: {
    container: "bg-blue-50 text-blue-900 border-blue-200 dark:bg-blue-950/40 dark:text-blue-200 dark:border-blue-800",
    icon: <Info className="h-5 w-5 text-blue-600 shrink-0" />,
  },
  error: {
    container: "bg-red-50 text-red-900 border-red-200 dark:bg-red-950/40 dark:text-red-200 dark:border-red-800",
    icon: <XCircle className="h-5 w-5 text-red-600 shrink-0" />,
  },
  success: {
    container: "bg-emerald-50 text-emerald-900 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-200 dark:border-emerald-800",
    icon: <CheckCircle className="h-5 w-5 text-emerald-600 shrink-0" />,
  },
};

export const Alert: React.FC<AlertProps> = ({
  variant = "info",
  title,
  children,
  dismissible = true,
  onClose,
}) => {
  const [isVisible, setIsVisible] = useState<boolean>(true);

  if (!isVisible) return null;

  const handleClose = () => {
    setIsVisible(false);
    if (onClose) onClose();
  };

  const style = variantStyles[variant];

  return (
    <div role="alert" className={`flex items-start gap-3 p-4 border rounded-lg shadow-sm text-sm mb-5 ${style.container}`}>
      {style.icon}
      
      <div className="flex-1 min-w-0">
        {title && <h5 className="font-semibold mb-1 leading-none">{title}</h5>}
        <div className="leading-relaxed opacity-90">{children}</div>
      </div>

      {/* Botón para cerrar */}
      {dismissible && (
        <button
          onClick={handleClose}
          type="button"
          aria-label="Cerrar alerta"
          className="-mr-1 -mt-1 p-1 rounded-md opacity-70 hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/10 transition-all focus:outline-none"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};