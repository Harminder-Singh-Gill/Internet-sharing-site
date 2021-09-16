import axiosInstance from "axiosInstance";

export const BASE_URLS = {
    post: 'post/posts',
    comment: 'comments'
}

export const votePost = (vote, contentId, contentType, onVote) => {
    axiosInstance.post(`${BASE_URLS[contentType]}/${contentId}/vote/`, {'vote': vote})
        .then(response => {
            if (onVote) {
                onVote(response.data);
            }
        })
}

export const toggleSave = (contentId, contentType, onToggleSave) => {
    axiosInstance
    .post(`${BASE_URLS[contentType]}/${contentId}/toggle_save/`)
    .then(response => {
        if (onToggleSave) {
            onToggleSave(response.data.is_saved);
        }
    });
}