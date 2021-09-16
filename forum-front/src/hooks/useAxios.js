import { useEffect, useState } from "react"
import axiosInstance from "axiosInstance";

const useAxios = (url) => {
    const [data, setData] = useState(null);
    const [isPending, setIsPending] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        axiosInstance
        .get(url)
        .then(response => {
            setData(response.data);
            setIsPending(false);
            setError(null);
        })
        .catch(error => {
            setData(null);
            setError(error);
            setIsPending(false);
        });
    }, [url]);

    return [data, isPending, error];
}

export default useAxios;