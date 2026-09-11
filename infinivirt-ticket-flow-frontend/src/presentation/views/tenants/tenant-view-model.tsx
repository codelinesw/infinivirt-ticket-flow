import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { BaseController } from "../../../utilities/base/base-controller";
import { ClientRepository } from "../../../data/repositories/remote/client.repository";
import { useTenantsStore } from "../../storage/zustand-store";

export const useTenantViewModel = () => {

    const [isOpen, setIsOpen] = useState<boolean>(false);
    const { control, handleSubmit, reset, setValues, getValues, formState: { errors, isValid, isSubmitted } } = useForm<any>({
        mode: "onSubmit",
    });

    const [search, setSearch] = useState('');

    const hasErrors = Object.keys(errors).length > 0;

    const baseController = useMemo(() => new BaseController(), []);
    const repository = new ClientRepository();

    
    const { items:tenants, setTenants, addItem: addTenant, updateItem: updateTenant, setCurrentTenant, currentTenant } = useTenantsStore();

    const filteredTenants = useMemo(() => {
        let result = tenants || [];
        if (search.trim()) {
            const term = search.toLowerCase();
            result = result.filter((item: any) =>
                String(item.name).toLowerCase().includes(term) ||
                String(item.domain).toLowerCase().includes(term) ||
                String(item.email).toLowerCase().includes(term)
            );
        }

        // 6. Estructura de retorno
        return result;
    }, [tenants, search]);

    useEffect(() => {
        getAllTenants();
    },[]);

    const getAllTenants = () => {
        baseController.apiRequest(
            repository.getClients(),
            {
                onSuccess: (response: any) => {
                    console.log("server response ", response);
                    setTenants(response.data);
                }
            }
        )
    }

    const createTenant = (data: any) => {
        baseController.apiRequest(
            repository.createClient(data),
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
                    setIsOpen(false);
                    addTenant(response.data);
                    baseController.showSuccessToast("", "La organización se creó con exíto!");
                }
            }
        )
    }

    const openModal = (tenant: any) => {
        setCurrentTenant(tenant);
        setValues(tenant);
        setIsOpen(true);
    }

    const _updateTenant = (_formData: any) => {
        baseController.apiRequest(
            repository.updateClient(currentTenant!.id, _formData),
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
                    setIsOpen(false);
                    const tempDate = {
                        ...currentTenant,
                        ..._formData
                    }
                    updateTenant(currentTenant!.id, tempDate);
                    setCurrentTenant(null);
                    baseController.showSuccessToast("", "La organización se actualizó con exíto!");
                }
            }
        )
    }

    const save = (data: any) => {
        if (currentTenant) {
            _updateTenant(data);
            return;
        }
        createTenant(data);
    }

    return {
        isOpen,
        setIsOpen,
        control,
        handleSubmit,
        createTenant,
        errors,
        hasErrors,
        isSubmitted,
        filteredTenants,
        search,
        setSearch,
        openModal,
        _updateTenant,
        save
    }
}