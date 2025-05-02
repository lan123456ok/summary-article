import { useState, useEffect, useCallback, useRef } from "react";
import type { NewsCardProps } from "@/types";
import { articlesService } from "@/api/services"
import { toast } from "sonner";

export const useArticles = (
    initialParams = {
        page: 1,
        size: 3,
    }) => {
    const [articles, setArticles] = useState<NewsCardProps[]>([]);
    const [loading, setLoading] = useState(true);
    const [initialLoading, setInitialLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [params, setParams] = useState(initialParams);
    const [hasMore, setHasMore] = useState(true);
    const [totalItems, setTotalItems] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const initialMount = useRef(true);
    const abortController = useRef<AbortController | null>(null);

    const fetchArticles = useCallback(async (
        currentParams = params,
        isRefreshing = false
    ) => {
        if (abortController.current) {
            abortController.current.abort();
        }

        abortController.current = new AbortController();

        if (currentParams.page === 1) {
            setInitialLoading(true);
        }
        setLoading(true);
        setError(null);

        try {
            const result = await articlesService.getArticles(currentParams, abortController.current.signal);

            if (result.error) {
                setError(result.error);
                toast.error("Lỗi", {
                    description: result.error
                });
                return;
            }

            setArticles(prev =>
                isRefreshing || currentParams.page === 1
                ? result.data.articles
                : [...prev, ...result.data.articles]
            );

            setTotalItems(result.data.total);
            setTotalPages(result.data.pages)

            setHasMore(currentParams.page < result.data.pages);

            if (isRefreshing) {
                toast.success("Thành công",{
                    description: `Đã tải ${result.data.articles.length} tin tức`
                });
            }

        } catch (err) {
            if (err instanceof Error && err.name === "AbortError") {
                return;
            }

            const errorMessage = "Thât bai khi tải tin tức";
            setError(errorMessage);
            toast.error('Lỗi', {
                description: errorMessage,
            })
        } finally {
            setLoading(false);
            if (currentParams.page === 1) {
                setInitialLoading(false);
            }
        }
    }, [params, toast]);

    useEffect(() => {
        if (initialMount.current) {
            fetchArticles();
            initialMount.current = false;
        } else {
            fetchArticles();
        }

        return () => {
            if (abortController.current) {
                abortController.current.abort();
            }
        }
    }, [params, fetchArticles]);

    const loadMore = useCallback(() => {
        if (loading || !hasMore) return;

        const nextPage = params.page + 1;
        setParams(prev => ({...prev, page: nextPage}));
    }, [loading, hasMore, params]);

    const refresh = useCallback(() => {
        return fetchArticles({...params, page: 1}, true);
    }, [params, fetchArticles]);

    const updateSearchParams = useCallback((newParams: Partial<typeof params>) => {
        setParams(prev => ({
            ...prev,
            ...newParams,
            page: 1
        }))
    }, [])

    return {
        articles,
        loading,
        error,
        hasMore,
        totalItems,
        totalPages,
        loadMore,
        refresh,
        updateSearchParams,
        currentParams: params
    };
};