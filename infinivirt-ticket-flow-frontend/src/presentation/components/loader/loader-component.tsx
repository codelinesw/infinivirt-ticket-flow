import { useGlobalStore } from "../../storage/zustand-store";
import { Overlay } from "../overlay/overlay-component";

interface ILoader {
    show?: boolean;
}

export const Loader: React.FC<ILoader> = () => {
    const showLoading = useGlobalStore((state) => state.loading);
    if (!showLoading) return null;
    return (<Overlay show={showLoading} zIndex={1900}>
        <div className="w-[250px] h-[70px] p-5 flex justify-center items-center gap-5 bg-white rounded-xl">            
            <div className="spinner"></div>
            <p className="text-semiBold text-gray-800">Procesando...</p>
        </div>
    </Overlay>);
};