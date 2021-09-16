import axios from "axios";
import axiosInstance from "axiosInstance";
import { useEffect, useState } from "react";

const useContentGetter = (contentUrl, pageNumber) => {
    const [content, setContent] = useState([]);
    const [hasMore, setHasMore] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);

    useEffect(() => {
        setContent([]);
        setHasMore(true);
    }, [contentUrl, setContent, setHasMore]);

    useEffect(() => {
        if (pageNumber === 0) return;
        setIsLoading(true);
        setIsError(false);
        const source = axios.CancelToken.source();
        axiosInstance(contentUrl, { cancelToken: source.token, params: { page: pageNumber } })
        .then(response => {
            setContent(prev => [...prev, ...response.data.results]);
            setHasMore(response.data.next !== null);
            setIsError(false);
            setIsLoading(false);
        })
        .catch(error => {
            setIsLoading(false);
            if (axios.isCancel(error)) {return} // Do nothing
            setIsError(true);
        });
        
        return () => {
            source.cancel();
        }

    }, [contentUrl, pageNumber, setContent]);

    return {isLoading, isError, hasMore, content};
}
 
export default useContentGetter;