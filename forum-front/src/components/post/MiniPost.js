import axiosInstance, { baseURL } from "axiosInstance";
import { getImgUrl } from "baseUrls";
import { useEffect, useState } from "react";
import { useHistory } from "react-router";
import { getVideoId } from "youtube";
import './MiniPost.css';

const MiniPost = ({post}) => {
    const [linkData, setLinkData] = useState(null);
    const [youtubeVideoId, setYoutubeVideoId] = useState(null);
    const history = useHistory();

    useEffect(() => {
        if (post.post_type !== 'link' || !post.link) {return;}
        
        const youtubeVideoId = getVideoId(post.link);
        if (youtubeVideoId) {
            setYoutubeVideoId(youtubeVideoId);
            return;
        }

        setYoutubeVideoId(null);

        axiosInstance
        .get('post/link-preview/?url=' + post.link)
        .then(response => {
            setLinkData(response.data);
        });
    }, [post.link, post.post_type]);
    
    let backgroundImage = getImgUrl('circle-blues.png');
    if (post.post_type === 'images') {
        backgroundImage = baseURL + post.images[0];
    } else if (linkData) {
        backgroundImage = linkData.image_url || getImgUrl('congruent_pentagon.png');
    } else if (youtubeVideoId) {
        backgroundImage = `https://img.youtube.com/vi/${youtubeVideoId}/0.jpg`;
    }

    return ( 
        <div className="mini-post" style={{backgroundImage: `url("${backgroundImage}")`}} onClick={() => history.push(`/post/${post.id}`)}>
            <div className="post-info">
                <div className='post-title'>{post.title}</div>
                <div className="topic-info">
                    {post.topic && (<>
                        <img src={post.topic.icon || getImgUrl('default_topic_icon.jpg')} alt="" className="topic-icon"/>
                        <div className="topic-name">t/{post.topic.name}</div>
                    </>)}
                    {!post.topic && (<>
                        <img src={post.poster.profile_pic} alt="" className="topic-icon"/>
                        <div className="topic-name">u/{post.poster.username}</div>
                    </>)}
                </div>
            </div>
        </div>
     );
}
 
export default MiniPost;