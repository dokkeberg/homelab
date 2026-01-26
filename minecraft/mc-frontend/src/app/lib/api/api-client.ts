import { getAccessToken } from "@/app/lib/auth/auth-server-client";


export function createApiClient(host: string) {
    
    async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T | null> { 
        const accessToken = await getAccessToken();

        try {
            if(!accessToken) {
                throw new Error("No access token available, user not authenticated.");
            }

            const normalizeEndpoint = endpoint.startsWith("/") ? endpoint.slice(1) : endpoint;
            
            const response = await fetch(`${host}/${normalizeEndpoint}`, {
                ...options,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken.accessToken}`,
                    ...(options?.headers || {}),
                }
            });

            console.log("API Client Response:", response);
            if(response.ok) {
                const data: T = await response.json();
                return data;
            } else {
                return null;
            }
        } catch (error) {
            console.error("API Client Error:", error);
            return null;
        }
    }    

    return {
        get: <T>(endpoint: string, options?: RequestInit) => request<T>(endpoint, { ...options, method: "GET" }),
        post: <T>(endpoint: string, body: unknown, options?: RequestInit) => {
            return request<T>(endpoint, { 
                ...options, 
                method: "POST", 
                body: JSON.stringify(body), 
                headers: { ...options?.headers, "Content-Type": "application/json" }
            });
        },
        delete: (endpoint: string, options?: RequestInit) => request(endpoint, { ...options, method: "DELETE" }),
    }
}