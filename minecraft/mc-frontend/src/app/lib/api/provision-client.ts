import { createApiClient } from "./api-client";

export const provisionClient = createApiClient(process.env.BACKEND_API as string + "/api");
