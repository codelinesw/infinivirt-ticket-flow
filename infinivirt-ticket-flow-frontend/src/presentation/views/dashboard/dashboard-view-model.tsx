import { useEffect, useMemo, useState } from "react";
import { DashboardRepository } from "../../../data/repositories/remote/dashboard.repository";
import { BaseController } from "../../../utilities/base/base-controller";

export const useDashboardViewModel = () => {
    const [summary, setSummary] = useState<any>({
        kpis: [],
        sla: null,
        recent_tickets: []
    });

    const baseController = useMemo(() => new BaseController(),[]);
    const repository = useMemo(() => new DashboardRepository(),[]);


    useEffect(() => {
        getSummary();
    },[]);

    const getSummary = () => {
        baseController.apiRequest(
            repository.getSummary(),
            {
                onSuccess: (response: any) => {
                    const kpisArray = Object.entries(response.data?.kpis ?? {}).map(
                    ([key, kpi]) => ({
                        key,
                        ...kpi,
                    })
                    );
                    console.error(response.data.kpis);
                    console.error(kpisArray);
                    const responseData = response.data;
                    responseData.kpis = kpisArray;
                    setSummary(response.data);
                },
                onError: (error: any) => {
                    let message = error.message || error.Message || "Ha ocurrido un error al intentar consultar la información del dashboard";
                    baseController.showErrorToast("", message);
                }
            }
        )
    }


    return {
        summary
    }
}