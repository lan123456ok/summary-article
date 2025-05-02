import {apiClient} from "@/api/config";
import {HealthStatus} from "@/types";

export const healthService = {
    checkHealth: async () => {
        const endpoint = "/health";
        return await apiClient<HealthStatus>(endpoint);
    }
};