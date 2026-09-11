import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { BaseController } from "../../../utilities/base/base-controller";
import { TicketRepository } from "../../../data/repositories/remote/ticket.repository";
import { UserRepository } from "../../../data/repositories/remote/user.repository";

export const useAssigmentViewModel = () => {

    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [userIsLoading, setUserIsLoading] = useState(false);
    const [targetAgentId, setTargetAgentId] = useState<string>('');

    const [tickets, setTickets] = useState<any>({
        data: [],
        pagination: { page: 1, limit: 10, total: 0, totalPages: 1 },
    });
    const [users, setUsers] = useState([]);
    const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);

    const { control, handleSubmit, formState: { errors, isValid, isSubmitted } } = useForm<any>({
        mode: "onSubmit",
    });

    const hasErrors = Object.keys(errors).length > 0;

    const [filters, setFilters] = useState<any>({
        search: "",
        status: "ALL",
        priority: "ALL"
    });

    const baseController = useMemo(() => new BaseController(), []);
    const repository = new TicketRepository();
    const userRepository = new UserRepository();

    useEffect(() => {
        getTickets();
        getUsers();
    }, []);

    const getTickets = () => {
        baseController.apiRequest(
            repository.getTickets(
                undefined,
                1,
                5
            ),
            {
                onStart: () => {
                    setIsLoading(true);
                },
                onSuccess: (response: any) => {
                    console.log("Data ==> ", response);
                    setTickets(response);
                    setIsLoading(false);
                },
                onError: () => {
                    setIsLoading(false);
                }
            }
        )
    }

    const addTicket = (data: any) => {
        baseController.apiRequest(
            repository.createTicket({
                description: data.comment,
                ...data
            }),
            {
                onStart: () => {
                    setIsLoading(true);
                },
                onSuccess: (response: any) => {
                    console.log("server response :: ", response);
                    setIsLoading(false);
                    baseController.showSuccessToast("", "El ticket se creó con exíto");
                },
                onError: (error: any) => {
                    console.error("error response :: ", error);
                    setIsLoading(false);
                    baseController.showSuccessToast("", "Ha ocurrido error al crear el ticket");
                }
            }
        );
    }

    const toggleSelectTicket = (id: string) => {
        setSelectedTicketId((prev: any) => (prev === id ? null : id));
    };

    const asignTicket = (data: any) => {
        if (!selectedTicketId) {
            baseController.showErrorToast("", "Debes seleccionar un Ticket para poder asignarlo");
            return;
        }
        if (!targetAgentId) {
            baseController.showErrorToast("", "Debes seleccionar un agente para poder asignarlo");
            return;
        }
        const _user: any = users.filter((item: any) => item.id == targetAgentId)[0];
        //${_user.firstName + " " + (_user.lastName || "")}
        baseController.apiRequest(
            repository.asignTicket(
                selectedTicketId!,
                {
                    "assignedToId": targetAgentId,
                    "notes": `Se asigna el Ticket al usuario `
                }),
            {
                onStart: () => {
                    setIsLoading(true);
                },
                onSuccess: (response: any) => {
                    console.log("server response :: ", response);
                    setIsLoading(false);
                    baseController.showSuccessToast("", "El ticket se asignó con exíto");
                },
                onError: (error: any) => {
                    console.error("error response :: ", error);
                    setIsLoading(false);
                    baseController.showErrorToast("", "Ha ocurrido error al asignar el ticket");
                }
            }
        );
    }

    const getUsers = () => {
        baseController.apiRequest(
            userRepository.getUsers(),
            {
                onStart: () => {
                    setUserIsLoading(true);
                },
                onSuccess: (response: any) => {
                    setUserIsLoading(false);
                    setUsers(response.data);
                },
                onError: (error: any) => {
                    setUserIsLoading(false);
                }
            }
        );
    }

    const filteredTickets = useMemo(() => {
        let result = tickets?.data || [];
        const { search, status, priority } = filters;
        if (search.trim()) {
            const term = search.toLowerCase();
            result = result.filter((item: any) =>
                String(item.title).toLowerCase().includes(term) ||
                String(item.description).toLowerCase().includes(term) ||
                String(item.ticketNumber).toLowerCase().includes(term)
            );
        }
        if (status !== 'ALL') {
            result = result.filter((t: any) => t.status === status);
        }
        if (priority !== 'ALL') {
            result = result.filter((t: any) => t.priority === priority);
        }

        const totalRecords = result.length;
        const limit = tickets?.pagination?.limit || 10;
        const totalPages = Math.ceil(totalRecords / limit) || 1;

        // 6. Estructura de retorno
        return {
            data: result,
            pagination: {
                ...tickets.pagination,
                total: totalRecords,
                totalPages: totalPages
            }
        };
    }, [tickets, filters]);

    return {
        navigate,
        tickets,
        users,
        isModalOpen,
        setIsModalOpen,
        control,
        handleSubmit,
        addTicket,
        errors,
        hasErrors,
        isSubmitted,
        isLoading,
        selectedTicketId,
        setSelectedTicketId,
        toggleSelectTicket,
        asignTicket,
        setTargetAgentId,
        targetAgentId,
        setFilters,
        filters,
        filteredTickets
    }
}