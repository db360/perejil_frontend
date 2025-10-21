import { apiClient } from "../client";

export const pageService = {
    getPages: () => apiClient.get(
        '/wp-json/wp/v2/pages?_embed&_fields=id,title,content,slug,featured_media,yoast_head_json,video_destacado,_embedded'
    ),
    getPagesBySlug: (slug: string) => apiClient.get(
        `/wp-json/wp/v2/pages?slug=${slug}&_embed&_fields=id,title,content,slug,featured_media,meta,yoast_head_json,video_destacado,_embedded`
    ),
}