interface IOverLay {
    children: React.ReactNode;
    show?: boolean;
    zIndex?: number;
}
export const Overlay: React.FC<IOverLay> = ({ show = false, children, zIndex }) => {
    if (!show) return null;
    return (
        <div
            data-state="open"
            style={{ zIndex }} // Aplicamos el zIndex exacto que recibe por props
            className={`fixed inset-0 flex justify-center items-center bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0`}
            aria-hidden="true"
        >
            {children}
        </div>
    );
};