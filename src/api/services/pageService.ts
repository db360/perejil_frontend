import { apiClient } from "../client";

export const pageService = {
    getPages: () => apiClient.get('/wp-json/wp/v2/pages'),
    getPagesBySlug: (slug: string) => apiClient.get(`/wp-json/wp/v2/pages?slug=${slug}`),
}