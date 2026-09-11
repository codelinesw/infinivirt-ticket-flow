import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { BaseController } from "../../../utilities/base/base-controller";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../storage/zustand-store";
import { UserRepository } from "../../../data/repositories/remote/user.repository";

export const useSignUpViewModel = () => {

    const baseController = useMemo(() => new BaseController(),[]);
    const repository = new UserRepository();

    const { control, handleSubmit, formState: { errors, isValid, isSubmitted } } = useForm<any>({
        mode: "onSubmit",
    });
    const hasErrors = Object.keys(errors).length > 0;


    const createUser = (data: any) => {
        baseController.apiRequest(
            repository.createUser(data),
            {
                onSuccess: async(response: any) => {
                    console.log("Response server... ", response);
                    baseController.showSuccessToast("","Se creó el usuario con exíto...");
                },
                onError: (error: any) => {
                    console.error("Error :: => ", error);
                    baseController.showErrorToast("","Ocurrió un error al intentar crer la cuenta");
                }
            }
        )
    }
    return {
        control,
        createUser,
        handleSubmit,
        errors,
        hasErrors,
        isSubmitted,
        isValid
    }
}