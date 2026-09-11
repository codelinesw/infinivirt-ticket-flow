import { useEffect, useMemo, useState } from "react";
import { TicketRepository } from "../../../data/repositories/remote/ticket.repository";
import { BaseController } from "../../../utilities/base/base-controller";


export const useTicketViewModel = () => {

    const baseController = useMemo(() => new BaseController(), []);
    const repository = new TicketRepository();

    const [loading, setLoading] = useState<boolean>(true);
    const [ticketData, setTicketData] = useState<any>({
        data: [],
        pagination: { page: 1, limit: 10, total: 0, totalPages: 1 },
    });
    const [filters, setFilters] = useState<any>({
        search: "",
        status: "ALL",
        priority: "ALL"
    });

    useEffect(() => {
        getTickets();
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
                    setLoading(true);
                },
                onSuccess: (response: any) => {
                    console.log("Data ==> ", response);
                    setTicketData(response);
                    setLoading(false);
                },
                onError: () => {
                    setLoading(false);
                }
            }
        )
    }

    const filteredTickets = useMemo(() => {
        let result = ticketData?.data || [];
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
        const limit = ticketData?.pagination?.limit || 10;
        const totalPages = Math.ceil(totalRecords / limit) || 1;

        // 6. Estructura de retorno
        return {
            data: result,
            pagination: {
                ...ticketData.pagination,
                total: totalRecords,
                totalPages: totalPages
            }
        };
    }, [ticketData, filters]);


    return {
        ticketData,
        loading,
        filteredTickets,
        filters,
        setFilters
    }
}