import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { BaseController } from "../../../utilities/base/base-controller";
import { UserRepository } from "../../../data/repositories/remote/user.repository";
import { useClientsStore } from "../../storage/zustand-store";

export const useUserViewModel = () => {

    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [search, setSearch] = useState<string>("");
    const { control, handleSubmit, reset, formState: { errors, isValid, isSubmitted } } = useForm<any>({
        mode: "onSubmit",
    });

    const hasErrors = Object.keys(errors).length > 0;

    const baseController = useMemo(() => new BaseController(), []);
    const repository = new UserRepository();

    const { items: users, setClients, addItem: addUser, updateItem: updateUser } = useClientsStore();

    useEffect(() => {
        getAllUsers();
    }, []);

    const getAllUsers = () => {
        baseController.apiRequest(
            repository.getUsers(),
            {
                onSuccess: (response: any) => {
                    console.log("server response ", response);
                    setClients(response.data);
                }
            }
        )
    }

    const createUser = (data: any) => {
        baseController.apiRequest(
            repository.createUser(data),
            {
                onSuccess: (response: any) => {
                    console.log("server response ", response);
                    reset({
                        name: "",
                        email: "",
                        domain: null,
                        phone: null,
                        is_active: false
                    });
                    addUser(response.data);
                    setIsOpen(false);
                    baseController.showSuccessToast("", "El usuario se creó con exíto!");
                }
            }
        )
    }

    const filteredUsers = useMemo(() => {
        let result = users || [];
        if (search.trim()) {
            const term = search.toLowerCase();
            result = result.filter((item: any) =>
                String(item.firstName + " " + (item.lastName || "")).toLowerCase().includes(term) ||
                String(item.email).toLowerCase().includes(term)
            );
        }

        // 6. Estructura de retorno
        return result;
    }, [users, search]);

    return {
        isOpen,
        setIsOpen,
        control,
        handleSubmit,
        createUser,
        errors,
        hasErrors,
        isSubmitted,
        filteredUsers,
        search,
        setSearch
    }
}