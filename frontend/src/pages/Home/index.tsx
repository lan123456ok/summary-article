import React, {useState, useEffect} from 'react';
import SearchSection from "@/components/Search";
import {NewsCardProps} from "@/types";
import ListNewsCard from "@/components/ListNewsCard";
import {useArticles} from "@/hooks/useApi.ts";


const HomePage: React.FC = () => {
    const [lastUpdate, setLastUpdate] = useState(0);
    const [showSkeleton, setShowSkeleton] = useState(true);

    const {
        articles,
        loading,
        error,
        initialLoading,
        loadMore,
        hasMore,
        refresh,
        updateSearchParams,
        currentParams
    } = useArticles({size: 6, page: 1});

    useEffect(() => {
        if (!initialLoading && showSkeleton) {
            const timer = setTimeout(() => {
                setShowSkeleton(false);
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [initialLoading]);

    useEffect(() => {
        const now = Date.now();
        if (now - lastUpdate > 300) {
            setLastUpdate(now);

            const newParams = new URLSearchParams();

            if (currentParams.page && currentParams.page > 1) {
                newParams.set('page', currentParams.page.toString());
            }

            if (currentParams.size && currentParams.size !== 9) {
                newParams.set('size', currentParams.size.toString());
            }
        }
    }, [currentParams, lastUpdate]);

    const fetchMoreItems = async (page: number): Promise<NewsCardProps[]> => {
        return new Promise((resolve) => {
            if (!hasMore) {
                resolve([]);
                return;
            }

            loadMore();

            setTimeout(() => {
                resolve(articles);
            }, 1000);
        });
    };


    return (
        <div className="container mx-auto">
            <div className="py-6">
                <div className="container mx-auto px-6">
                    <div className="mx-auto">
                        <SearchSection
                        />
                    </div>
                </div>
            </div>

            <ListNewsCard
                initialItems={articles}
                fetchMoreItems={fetchMoreItems}
                isLoading={showSkeleton}
                hasMore={hasMore}
            />
        </div>
    )
}

export default HomePage;