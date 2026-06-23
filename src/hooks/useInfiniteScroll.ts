import { useCallback, useRef } from 'react';

export const useInfiniteScroll = (
    loading: boolean,
    hasMore: boolean,
    onLoadMore: () => void
) => {
    const observerRef = useRef<IntersectionObserver | null>(null);

    const lastElementRef = useCallback(
        (node: HTMLDivElement | null) => {
            if (loading) return;
            if (observerRef.current) observerRef.current.disconnect();

            observerRef.current = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting && hasMore) {
                    onLoadMore();
                }
            });

            if (node) observerRef.current.observe(node);
        },
        [loading, hasMore, onLoadMore]
    );

    return lastElementRef;
};
