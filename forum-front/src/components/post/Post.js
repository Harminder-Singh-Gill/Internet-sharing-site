import DateText from '../utils/date_text/DateText';
import {useContext, useEffect, useState} from 'react';
import './Post.css';
import axiosInstance from "axiosInstance";
import { pluralize, shortify } from '../../number_format';
import {getVideoId} from '../../youtube.js';
import { LoginRequiredContext } from '../../App';
import ImageGallery from '../utils/image_gallery/ImageGallery';
import { useHistory } from 'react-router';
import { getImgUrl } from 'baseUrls';

const Post = ({postData, isPreview}) => {
    const loginRequired = useContext(LoginRequiredContext);
    const history = useHistory();

    const [pointStats, setPointStats] = useState(postData.point_stats);
    const [isSaved, setIsSaved] = useState(postData.is_saved);
    const [isHidden, setIsHidden] = useState(postData.is_hidden);
    const [linkData, setLinkData] = useState(null);
    const [youtubeVideoId, setYoutubeVideoId] = useState(null);

    useEffect(() => setPointStats(postData.point_stats), [postData.point_stats]);
    useEffect(() => setIsSaved(postData.is_saved), [postData.is_saved]);
    useEffect(() => setIsHidden(postData.is_hidden), [postData.is_hidden]);

    useEffect(() => {
        if (postData.post_type !== 'link' || !postData.link) {return;}

        const ytVideoId = getVideoId(postData.link);
        if (ytVideoId) {
            setYoutubeVideoId(ytVideoId);
            return;
        }

        setYoutubeVideoId(null);

        axiosInstance
        .get('post/link-preview/?url=' + postData.link)
        .then(response => {
            setLinkData(response.data);
        });
    }, [postData.link, postData.post_type]);

    const upvoteClickHandle = (e) => {
        e.stopPropagation();
        votePost('upvote');
    }

    const toggleSave = loginRequired((e) => {
        axiosInstance.post(`post/posts/${postData.id}/toggle_save/`)
            .then(response => setIsSaved(response.data.is_saved));
    });

    const toggleHide = loginRequired(() => {
        axiosInstance.post(`post/posts/${postData.id}/toggle_hide/`)
            .then(response => setIsHidden(response.data.is_hidden));
    });

    const votePost = loginRequired((vote) => {
        axiosInstance.post(`post/posts/${postData.id}/vote/`, {'vote': vote})
            .then(response => setPointStats(response.data));
    }) 

    const handleHideClick = (e) => {
        e.stopPropagation();
        toggleHide();
    }

    const handleSaveClick = (e) => {
        e.stopPropagation();
        toggleSave();
    }


    const downvoteClickHandle = (e) => {
        e.stopPropagation();
        votePost('downvote');
    }

    return ( 
        <div className={'post ' + (isPreview ? 'preview ': 'non-preview')}>
            <header className="post-header" onClick={() => isPreview && history.push(`/post/${postData.id}`)}>
                <div className="post-data">
                    <div className='post-info'>
                        <div className="topic-info">
                            {postData.topic && (<>
                                <img src={postData.topic.icon || getImgUrl('default_topic_icon.jpg')} alt="" className="topic-icon"/>
                                <div className="topic-name">t/{postData.topic.name}</div>
                            </>)}
                            {!postData.topic && (<>
                                <img src={postData.poster.profile_pic} alt="" className="topic-icon"/>
                                <div className="topic-name">u/{postData.poster.username}</div>
                            </>)}
                        </div>
                        <p className="creation-info">Posted by u/{postData.poster.username} <DateText date={postData.posted_date}/></p>
                    </div>
                    <p className="upvote-percentage">{pointStats.favourability}% Upvoted</p>
                    {/* <div className="stats">
                        <p className="upvote-stat stat">
                            {pointStats.upvotes}
                            <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24"><path d="M24 22h-24l12-20z"/></svg>
                        </p>
                        <p className="downvote-stat stat">
                            {pointStats.downvotes}
                            <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24"><path d="M12 21l-12-18h24z"/></svg>
                        </p>
                        <p className="favourability-stat stat">{pointStats.favourability}% Upvoted</p>
                    </div> */}
                    {/* <div className="stats">
                        <div className="upvote-count-div stat">
                            <p className="upvote-count stat-value">{shortify(pointStats.upvotes)}</p>
                            <p className="upvote-label stat-label">{pluralize(pointStats.upvotes, 'upvote')}</p>
                        </div>
                        <div className="downvote-count-div stat">
                            <p className="downvote-count stat-value">{shortify(pointStats.downvotes)}</p>
                            <p className="downvote-label stat-label">{pluralize(pointStats.downvotes, 'downvote')}</p>
                        </div>
                        <div className="favourability-div stat">
                            <p className="favourability stat-value">{shortify(pointStats.favourability)}%</p>
                            <p className="favourability-label stat-label">upvoted</p>
                        </div>
                    </div> */}
                </div>
                <div className='post-title'>{postData.title}</div>
            </header>
            <main className="post-content">
                {postData.post_type === 'text' && (
                    <div className="text-content">
                        <p>{postData.text}</p>
                    </div>
                )}
               {postData.post_type === 'images' &&  (
                    <div className="image-content">
                        <ImageGallery baseUrl="http://localhost:8000" images={postData.images} />
                    </div>
                )}
                {linkData && (
                    <a className="link-anchor-tag" href={postData.link}>
                        <div className="link-preview link-content" style={{backgroundImage: `url("${linkData.image_url || 'http://localhost:8000/media/congruent_pentagon.png'}")`}}>
                            <div className="link-info">
                                
                                <div className="link-icon-container">
                                    <svg className="link-svg" xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24"><path d="M6.188 8.719c.439-.439.926-.801 1.444-1.087 2.887-1.591 6.589-.745 8.445 2.069l-2.246 2.245c-.644-1.469-2.243-2.305-3.834-1.949-.599.134-1.168.433-1.633.898l-4.304 4.306c-1.307 1.307-1.307 3.433 0 4.74 1.307 1.307 3.433 1.307 4.74 0l1.327-1.327c1.207.479 2.501.67 3.779.575l-2.929 2.929c-2.511 2.511-6.582 2.511-9.093 0s-2.511-6.582 0-9.093l4.304-4.306zm6.836-6.836l-2.929 2.929c1.277-.096 2.572.096 3.779.574l1.326-1.326c1.307-1.307 3.433-1.307 4.74 0 1.307 1.307 1.307 3.433 0 4.74l-4.305 4.305c-1.311 1.311-3.44 1.3-4.74 0-.303-.303-.564-.68-.727-1.051l-2.246 2.245c.236.358.481.667.796.982.812.812 1.846 1.417 3.036 1.704 1.542.371 3.194.166 4.613-.617.518-.286 1.005-.648 1.444-1.087l4.304-4.305c2.512-2.511 2.512-6.582.001-9.093-2.511-2.51-6.581-2.51-9.092 0z"/></svg>
                                </div>
                                <div className="link-header">
                                    <div className="link-title">
                                        {linkData.title}
                                    </div>
                                    {/* <div className="link-desc">
                                        {linkData.description}
                                    </div> */}
                                </div>
                                <div className="link">{postData.link}</div>
                            </div>
                        </div>
                    </a>
                )}
                {youtubeVideoId && (
                    <div className="link-content">
                        <iframe  className="video-iframe" src={"https://www.youtube.com/embed/" + youtubeVideoId} title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen;" allowFullScreen></iframe>
                    </div>
                )}
            </main>
            <footer className="post-footer" onClick={() => isPreview && history.push(`/post/${postData.id}`)}>
                <div className={"points-section " + pointStats.vote}>
                    <p className="points">{pointStats.points}</p>
                    <div className="vote-btns">
                        <button className="upvote-btn" onClick={upvoteClickHandle}>
                            <svg className="upvote-svg" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path d="M24 22h-24l12-20z"/></svg>
                        </button>
                        <button className="downvote-btn" onClick={downvoteClickHandle}>
                            <svg className="downvote-svg" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path d="M12 21l-12-18h24z"/></svg>
                        </button>
                    </div>
                </div>
                <button className="comments-btn footer-btn">
                    <svg xmlns="http://www.w3.org/2000/svg" height="16" viewBox="0 0 24 24" width="16" fill="#000000"><path d="M21.99 4c0-1.1-.89-2-1.99-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4-.01-18z"/></svg>
                    <p>{postData.comment_count} Comments</p>
                </button>
                <button onClick={handleSaveClick} className={"save-btn footer-btn " + (isSaved ? "saved" : "")}>
                    <svg xmlns="http://www.w3.org/2000/svg" height="16" viewBox="0 0 24 24" width="16"  fill="#000000"><path d="M17 3H7c-1.1 0-1.99.9-1.99 2L5 21l7-3 7 3V5c0-1.1-.9-2-2-2z"/></svg>
                    <p className="save-btn-text btn-text" >{ isSaved? "Saved" : "Save" }</p>
                </button>
                <button onClick={handleHideClick} className={"hide-btn footer-btn " + (isHidden? "hidden" : "")}>
                    <svg xmlns="http://www.w3.org/2000/svg" height="16" viewBox="0 0 24 24" width="24px" fill="#000000"><g><path d="M2.81,2.81L1.39,4.22l2.27,2.27C2.61,8.07,2,9.96,2,12c0,5.52,4.48,10,10,10c2.04,0,3.93-0.61,5.51-1.66l2.27,2.27 l1.41-1.41L2.81,2.81z M12,20c-4.41,0-8-3.59-8-8c0-1.48,0.41-2.86,1.12-4.06l10.94,10.94C14.86,19.59,13.48,20,12,20z M7.94,5.12 L6.49,3.66C8.07,2.61,9.96,2,12,2c5.52,0,10,4.48,10,10c0,2.04-0.61,3.93-1.66,5.51l-1.46-1.46C19.59,14.86,20,13.48,20,12 c0-4.41-3.59-8-8-8C10.52,4,9.14,4.41,7.94,5.12z"/></g></svg>
                    <p className="hide-btn-text btn-text">{ isHidden? "Hidden" : "Hide" }</p>
                </button>
                <div className="stats">
                    <div className="upvote-count-div stat">
                        <p className="upvote-count stat-value">{shortify(pointStats.upvotes)}</p>
                        <p className="upvote-label stat-label">{pluralize(pointStats.upvotes, 'upvote')}</p>
                    </div>
                    <div className="downvote-count-div stat">
                        <p className="downvote-count stat-value">{shortify(pointStats.downvotes)}</p>
                        <p className="downvote-label stat-label">{pluralize(pointStats.downvotes, 'downvote')}</p>
                    </div>
                    {/* <div className="favourability-div stat">
                        <p className="favourability stat-value">{shortify(pointStats.favourability)}%</p>
                        <p className="favourability-label stat-label">upvoted</p>
                    </div> */}
                </div>
            </footer>
        </div>
     );
}
 
export default Post;