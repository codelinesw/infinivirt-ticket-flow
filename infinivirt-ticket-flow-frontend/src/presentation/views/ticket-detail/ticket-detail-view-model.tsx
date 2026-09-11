import { useEffect, useMemo, useState } from "react";
import { TicketRepository } from "../../../data/repositories/remote/ticket.repository";
import { BaseController } from "../../../utilities/base/base-controller";
import { useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import type { TicketStatus } from "../../types";
import { UserRepository } from "../../../data/repositories/remote/user.repository";


export const useTicketDetailViewModel = () => {

    const baseController = useMemo(() => new BaseController(), []);
    const repository = useMemo(() => new TicketRepository(), []);
    const userRepository = useMemo(() => new UserRepository(), []);

    const { id } = useParams();

    console.log(" ticked id ", id);

    const [loading, setLoading] = useState<boolean>(false);
    const [updatingStatus, setUpdatingStatus] = useState(false);
    const [userIsLoading, setUserIsLoading] = useState(false);
    const [ticketDetailData, setTicketDetailData] = useState<any>(null);
    const [ticketComments, setTicketComments] = useState<any>([]);
    const [loadingComments, setLoadingComments] = useState<any>([]);
    const [users, setUsers] = useState([]);
    

    const { control, handleSubmit, reset, getValues, formState: { errors, isValid, isSubmitted } } = useForm<any>({
        mode: "onSubmit",
    });


    useEffect(() => {
        getTicketDetailById();
        getComments();
        getUsers();
    }, []);

    const getTicketDetailById = () => {
        baseController.apiRequest(
            repository.getTicketDetailById(id!),
            {
                onStart: () => {
                    setLoading(true);
                },
                onSuccess: (response: any) => {
                    console.log("Data ==> ", response);
                    setTicketDetailData(response.data);
                    setLoading(false);
                },
                onError: () => {
                    setLoading(false);
                }
            }
        )
    }

    const getComments = () => {
        baseController.apiRequest(
            repository.getComments(id!),
            {
                onStart: () => {
                    setLoadingComments(true);
                },
                onSuccess: (response: any) => {
                    console.log("Data ==> ", response);
                    setTicketComments(response.data);
                    setLoadingComments(false);
                },
                onError: () => {
                    setLoadingComments(false);
                }
            }
        )
    }

    const handleAddComment = (data: any) => {
        if (!isValid) {
            baseController.showErrorToast("", "Debes de ingresar un mensaje para poder publicar un comentario");
        }
        baseController.apiRequest(
            repository.addComment(
                id!!,
                {
                    content: data?.comment ?? "freezer",
                    isInternal: data?.isInternal ?? false
                }),
            {
                onSuccess: (response: any) => {
                    reset({ comment: '', isInternal: false });
                    baseController.showSuccessToast("", "El comentario se agregó correctamente");
                    setTicketComments((prevComment: any) => [...prevComment, response.data]);
                },

                onError: (error: any) => {
                    console.error("ERROR ", error);
                }
            }
        )
    }

    // Modificar Estado (PATCH /:id/status)
    const handleStatusChange = async (newStatus: TicketStatus) => {
        setUpdatingStatus(true);
        baseController.apiRequest(
            repository.updateStatus(id!, {
                status: newStatus,
                note: getValues()?.comment || "Se actualiza el estado del Ticket"
            }),
            {
                onSuccess: (response: any) => {
                    setUpdatingStatus(false);
                    baseController.showSuccessToast("", "El estado del Ticket se actualizó con exíto");
                },
                onError: (error: any) => {
                    setUpdatingStatus(false);
                    baseController.showErrorToast("", "Ocurrió un error actualizando el estado del Ticket");
                }
            }
        )

    };

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

    // Asignar Agente (PATCH /:id/assign) - Solo ADMIN
    const handleAssignAgent = async (agentId: string) => {
        if (!id) {
            baseController.showErrorToast("", "Debes seleccionar un Ticket para poder asignarlo");
            return;
        }
        const _user: any = users.filter((item: any) => item.id == agentId)[0];        
        baseController.apiRequest(
            repository.asignTicket(
                id!,
                {
                    "assignedToId": agentId,
                    "notes": `Se asigna el Ticket al usuario ${_user.firstName + " " + (_user.lastName || "")}`
                }),
            {
                onStart: () => {
                    setLoading(true);
                },
                onSuccess: (response: any) => {
                    console.log("server response :: ", response);
                    setLoading(false);
                    baseController.showSuccessToast("", "El ticket se asignó con exíto");
                },
                onError: (error: any) => {
                    console.error("error response :: ", error);
                    setLoading(false);
                    baseController.showErrorToast("", "Ha ocurrido error al asignar el ticket");
                }
            }
        );
    };


    return {
        control,
        handleSubmit,
        errors,
        isSubmitted,
        isValid,
        ticketDetailData,
        loading,
        ticketComments,
        loadingComments,
        handleAddComment,
        updatingStatus,
        handleStatusChange,
        handleAssignAgent,
        users
    }
}