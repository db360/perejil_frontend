import { apiClient } from "../client";

export const pageService = {
    getPages: () => apiClient.get('/pages'),
    getPagesBySlug: (slug: string) => apiClient.get(`/pages?slug=${slug}`),
}