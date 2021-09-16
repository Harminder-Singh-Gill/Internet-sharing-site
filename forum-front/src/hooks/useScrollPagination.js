import { useCallback, useEffect, useRef, useState } from "react";
import useContentGetter from "./useContentGetter";

const useScrollPagination = (contentUrl) => {
    const [pageNumber, setPageNumber] = useState(0);
    const {content, hasMore, isLoading, isError} = useContentGetter(contentUrl, pageNumber);
    const observer = useRef();
    // const [loaderNode, setLoaderNode] = useState();
    
    // const loaderRef = useCallback(node => {
    //     setLoaderNode(node);
    // }, []);

    // useEffect(() => {
    //     if (isLoading) return;

    //     const options = {
    //         root: null,
    //         rootMargin: '0px',
    //         threshold: 1
    //     }

    //     observer.current = new IntersectionObserver(entries => {
    //         if (entries[0].isIntersecting && hasMore) {
    //             setPageNumber(prev => prev + 1);
    //         }
    //     }, options);

    //     if (loaderNode) {
    //         observer.current.observe(loaderNode);
    //     }
        
    //     return () => {
    //         observer.current && observer.current.disconnect();
    //     }
    // }, [loaderNode, setPageNumber, isLoading, hasMore]);

    useEffect(() => {
        setPageNumber(0);
    }, [contentUrl, setPageNumber]);

    const loaderRef = useCallback((node) => {
        if (isLoading) return;

        const options = {
            root: null,
            rootMargin: '0px',
            threshold: 1
        }

        if (observer.current) { observer.current.disconnect(); }
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                setPageNumber(prev => prev + 1);
            }
        }, options);

        if (node) {
            observer.current.observe(node);
        }
    }, [setPageNumber, isLoading, hasMore]);

    return {content, hasMore, isLoading, isError, pageNumber, loaderRef};
}
 
export default useScrollPagination;