import {apiClient} from "@/api/config";
import {NewsCardProps} from "@/types";
import {ArticleData, ArticleParams, ArticleResponse} from "@/types";

const mapArticleToNewsCard = (article: ArticleData): NewsCardProps => ({
    title: article.title,
    link_url: article.link_url,
    location: article.location || 'Không có',
    datetime: article.datetime || article.created_at,
    image_url: article.image_url,
    category: article.category,
    summary: article.summary || ''
})
export const articlesService = {
    getArticles: async (params: ArticleParams = {}, signal?: AbortSignal) => {
        const queryParams = new URLSearchParams();

        if (params.page) queryParams.append('page', params.page.toString());
        if (params.size) queryParams.append('size', params.size.toString());
        if (params.category) queryParams.append('category', params.category);
        if (params.q) queryParams.append('q', params.q);

        const endpoint = `articles/?${queryParams.toString()}`;

        try {
            const response = await apiClient<ArticleResponse>(endpoint, {
                method: 'GET',
                signal
            });

            if (response.error) {
                return {error: response.error};
            }

            return {
                data: {
                    articles: response.data.items.map(mapArticleToNewsCard),
                    total: response.data.total,
                    page: response.data.page,
                    size: response.data.size,
                    pages: response.data.pages
                }
            };
        } catch (error) {
            if (error instanceof Error) {
                if (error.name === 'AbortError') {
                    throw error;
                }
                return { error: error.message };
            }
            return { error: 'Unknown error occurred'};
        }
    },

    getArticleCategories: async () => {
        const endpoint = 'articles/categories';

        try {
            const response = await apiClient<string[]>(endpoint);

            if (response.error) {
                return { error: response.error};
            }

            return {data: response.data};
        } catch (error) {
            if (error instanceof Error) {
                return { error: error.message };
            }
            return { error: 'Unknown error occurred'};
        }
    }
}