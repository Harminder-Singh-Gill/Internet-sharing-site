import axios from "axios";
import axiosInstance from "axiosInstance";
import { useEffect, useState } from "react";

const useCommentGetter = (postId, pageNumber) => {
    const [comments, setComments] = useState([]);
    const [hasMore, setHasMore] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);

    useEffect(() => {
        setComments([]);
    }, [postId]);

    useEffect(() => {
        if (pageNumber === 0) {return}
        setIsLoading(true);
        setIsError(false);

        const source = axios.CancelToken.source();
        axiosInstance(`/comments/?post=${postId}&only_top_level=true&page=${pageNumber}&page_size=1`, {cancelToken: source.token})
        .then(response => {
            setComments(prev => [...prev, ...response.data.results]);
            setHasMore(response.data.next !== null);
            setIsError(false);
            setIsLoading(false);
        })
        .catch(error => {
            if (axios.isCancel(error)) {return} // Do nothing
            setIsLoading(false);
            setIsError(true);
        });
        
        return () => {
            source.cancel();
        }

    }, [postId, pageNumber, setComments]);

    return {isLoading, isError, hasMore, comments}
}
 
export default useCommentGetter;