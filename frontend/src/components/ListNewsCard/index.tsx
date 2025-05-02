import React, {useState, useEffect, useRef, useCallback, memo} from 'react';
import NewsCard from '@/components/NewsCard';
import {NewsCardProps} from "@/types";
import {Button} from "@/components/ui/button.tsx";

import NewsSkeleton from "@/components/NewsCard/NewsSkeleton.tsx";

type ListNewsCardProps = {
    initialItems: NewsCardProps[];
    fetchMoreItems?: (page: number) => Promise<NewsCardProps[]>;
    isLoading?: boolean;
    hasMore?: boolean;
    className?: string;
};

const ListNewsCard: React.FC<ListNewsCardProps> = ({
                                                       initialItems,
                                                       fetchMoreItems,
                                                       isLoading = false,
                                                       hasMore = true,
                                                       className
                                                   }) => {
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [visibleItems, setVisibleItems] = useState<number[]>([]);
    const observerRef = useRef<IntersectionObserver | null>(null);
    const lastItemRef = useRef<HTMLDivElement | null>(null);

    const scrollToTop = () => {
        window.scrollTo({top: 0, behavior: 'smooth'});
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            const indices = Array.from({length: initialItems.length}
                , (_, i) => i);
            setVisibleItems(indices);
        }, 100);

        return () => clearTimeout(timer);
    }, [initialItems]);

    const loadMoreItems = useCallback(async () => {
        if (loading || !hasMore || !fetchMoreItems) return;

        setLoading(true);


        try {
            await new Promise(resolve => setTimeout(resolve, 800));

            const nextPage = page + 1;
            await fetchMoreItems(nextPage);

            setPage(nextPage);
        } catch (error) {
            console.error('Error fetching more items:', error);
        } finally {
            setLoading(false);
        }
    }, [loading, hasMore, fetchMoreItems, page]);

    useEffect(() => {
        if (loading) return;

        const options = {
            root: null,
            rootMargin: '100px',
            threshold: 0.01,
        };

        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && hasMore) {
                loadMoreItems();
            }
        }, options);

        observerRef.current = observer;

        const currentLastItem = lastItemRef.current;
        if (currentLastItem) {
            observer.observe(currentLastItem);
        }

        return () => {
            if (currentLastItem && observerRef.current) {
                observerRef.current.unobserve(currentLastItem);
            }
        };
    }, [loadMoreItems, loading, hasMore]);

    return (
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-6 pb-6 ${className}`}>
            {isLoading && (
                Array.from({length: 6}).map((_, index) => (
                    <NewsSkeleton key={`skeleton-${index}`}/>
                ))
            )}

            {initialItems.map((item, index) => (
                <div
                    key={`${item.link_url}-${index}`}
                    ref={index === initialItems.length - 1 ? lastItemRef : null}
                    className={`transition-all duration-500 ${
                        visibleItems.includes(index)
                            ? 'opacity-100 translate-y-0'
                            : 'opacity-0 translate-y-8'
                    }`}
                    style={{
                        transitionDelay: `${(index % 6) * 50}ms`
                    }}
                >
                    <NewsCard
                        title={item.title}
                        link_url={item.link_url}
                        location={item.location}
                        datetime={item.datetime}
                        image_url={item.image_url}
                        category={item.category}
                        summary={item.summary}
                    />
                </div>
            ))}

            {!loading && initialItems.length > 0 && !hasMore && (
                <div className="col-span-full text-center py-6
                transition-opacity duration-500 ease-in opacity-0 animate-fade-in
                text-muted-foreground">
                    <p className="text-muted-foreground mb-4">Đã hết tin tức để hiển thị</p>
                    <Button
                        onClick={scrollToTop}
                        className="px-4 py-2 rounded-md transition-colors"
                    >
                        Quay lại đầu trang
                    </Button>
                </div>
            )}
        </div>
    )
}

export default memo(ListNewsCard)

