import { type ComponentPropsWithoutRef, type ReactNode } from "react";

interface ITextArea extends ComponentPropsWithoutRef<"textarea"> {
    label?: string;
    isError?: boolean;
    errorMessage?: string;
    customStyles?: string;
    isRequired?: boolean
}

export const TextArea: React.FC<ITextArea> = ({
    label,
    isError,
    errorMessage,
    customStyles,
    isRequired,
    ...props
}) => {
    return (<div>
        {label && <label className="block text-xs font-semibold text-slate-700 mb-1 flex">
            {label}
            {isRequired && <span className="text-rose-500 translate-x-1">*</span>}
        </label>}
        <>
            <textarea
                {...props}
                rows={3}
                value={props.value}
                onChange={props.onChange}
                placeholder={props.placeholder}
                className={`w-full rounded-xl bg-[#F6F6F7] border p-3 text-xs text-slate-900 focus:outline-none focus:ring-2 transition-colors ${customStyles}`}
            />
            {isError && (
                <p className="mt-1 text-xs text-red-500 font-medium">
                    {errorMessage}
                </p>
            )}
        </>
    </div>);
}