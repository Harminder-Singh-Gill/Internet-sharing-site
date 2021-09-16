export const getVideoId = (ytVideoUrl) => {
    // const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|\?v=)([^#\&\?]*).*/;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|\?v=)([^#&?]*).*/;
    const match = ytVideoUrl.match(regExp);
    if (match && match[2].length === 11) {
        return match[2];
    }
    return null;
}

export const isYoutubeVideo = (ytVideoUrl) => {
    // const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|\?v=)([^#\&\?]*).*/;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|\?v=)([^#&?]*).*/;
    const match = ytVideoUrl.match(regExp);
    return match && match[2].length === 11;
}