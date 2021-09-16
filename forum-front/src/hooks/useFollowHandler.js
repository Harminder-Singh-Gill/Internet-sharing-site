import { useContext, useEffect, useState } from "react";
import { LoginRequiredContext } from "App";
import axiosInstance from "axiosInstance";

const getToggleFollowUrl = (entity, entityType) => {
    switch(entityType) {
        case 'topic':
            return 'topics/' + entity.name + "/toggle_follow/";
        case 'user':
            return 'users/' + entity.username + "/toggle_follow/";
        default:
            return '';
    }
}
const useFollowHandler = (entity, entityType) => {
    const loginRequired = useContext(LoginRequiredContext);

    const [isFollowed, setIsFollowed] = useState(entity && entity.is_followed);
    const [followerCount, setFollowerCount] = useState(entity && entity.follower_count);

    const toggleFollow = loginRequired(() => {
        if (!entity) {return;}
        axiosInstance
        .post(getToggleFollowUrl(entity, entityType))
        .then(response => {
            setIsFollowed(response.data.is_followed);
            setFollowerCount(response.data.follower_count);
        });
    });
    
    useEffect(() => {
        if (!entity) {return;}
        setIsFollowed(entity.is_followed);
        setFollowerCount(entity.follower_count);
    }, [entity]);

    return {isFollowed, followerCount, toggleFollow};
}
 
export default useFollowHandler;