import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { BaseController } from "../../../utilities/base/base-controller";
import { AuthRepository } from "../../../data/repositories/remote/auth.repository";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../storage/zustand-store";

export const useSignInViewModel = () => {

    const baseController = useMemo(() => new BaseController(),[]);
    const repository = new AuthRepository();

    const { control, handleSubmit, formState: { errors, isValid, isSubmitted } } = useForm<any>({
        mode: "onSubmit",
    });
    const hasErrors = Object.keys(errors).length > 0;

    const navigate = useNavigate();
    const onAuthSuccess = useAuthStore((s) => s.onAuthSuccess);

    const signIn = (data: any) => {

        if (!isValid) {
            toast.error("Debes completar todos los campos");
        }
        baseController.apiRequest(
            repository.login(data),
            {
                onSuccess: async(response: any) => {
                    console.log("Response server... ", response);
                    baseController.showSuccessToast("","Iniciaste sesión con exíto, pronto te vamos a redireccionar...");
                    await onAuthSuccess();
                    setTimeout(() => {
                        navigate("/dashboard")
                    }, 1200);
                },
                onError: (error: any) => {
                    console.error("Error :: => ", error);
                }
            }
        )
    }
    return {
        control,
        signIn,
        handleSubmit,
        errors,
        hasErrors,
        isSubmitted,
        isValid
    }
}