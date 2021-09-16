import dayjs from 'dayjs';
import { useCallback, useContext, useEffect, useState } from 'react';
import { LoginRequiredContext } from 'App';
import SaveButton from 'components/specific_utils/content_related_components/SaveButton';
import DateText from 'components/utils/date_text/DateText';
import './CommentPreview.css';
import CommentForm from 'components/comment/CommentForm';
import axiosInstance from 'axiosInstance';
import Post from 'components/post/Post';

// $(document).on('click', '.test-section', function(){
//     var $this = $(this),
//         $document = $(document),
//         currentOffset = $this.offset().top - $document.scrollTop();
  
//     $this.prev('.test-section').remove();
//     $document.scrollTop($this.offset().top - currentOffset);
//     // credit goes to Jeff B from StackOverflow: http://stackoverflow.com/a/9834241/1784564 
//   });

// const maintainScroll = () => {
//     const element;

//     const currentOffset = element.scrollTop - document.scrollTop;
//     // remove thing;
//     document.scrollTop = element.scrollTop - currentOffset;
// }

const getOffset = (element) => {
    const rect = element.getBoundingClientRect();

    return { 
        top: rect.top + window.scrollY, 
        left: rect.left + window.scrollX
    }
}

const CommentPreview = ({comment}) => {
    const [inReplyMode, setInReplyMode] = useState(false);
    const [parent, setParent] = useState(null);
    const [post, setPost] = useState(null);
    const [newReplies, setNewReplies] = useState([]);
    const [isSaved, setIsSaved] = useState(comment.isSaved);

    useEffect(() => {
        setIsSaved(comment.is_saved);
    }, [comment.is_saved]);

    const loginRequired = useContext(LoginRequiredContext);

    const updateSaveState = useCallback((isSaved) => {
        setIsSaved(isSaved);
    }, [setIsSaved]);

    const handlePost = useCallback((reply) => {
        setInReplyMode(false);
        setNewReplies(prev => [reply, ...prev]);
    }, [setInReplyMode, setNewReplies]);

    const handleReplyClick = useCallback(loginRequired((e) => {
        setInReplyMode(prev => !prev);
    }), [loginRequired, setInReplyMode]);
    
    const getPost = useCallback(() => {
        setParent(null);
        axiosInstance('post/posts/' + comment.post)
        .then(response => setPost(response.data))
        .catch(error => {});

    }, [comment.post, setPost, setParent]);

    const getParent = useCallback(() => {
        setPost(null);
        axiosInstance('comments/' + comment.parent)
        .then(response => setParent(response.data))
        .catch(error => {});
        
    }, [comment.parent, setParent, setPost]);

    const removeParent = useCallback(() => {
        setPost(null);
        setParent(null);

    }, [setPost, setParent]);

    return (
        <div className={"comment-preview " + (isSaved ? "saved ": "") + (inReplyMode? 'reply-mode ': '') + (post? 'post-view-mode view-mode': '') + (parent? 'parent-view-mode view-mode': '')}>
            {parent && <div className="parent">
                <header className="cmnt-preview-header">
                    <p className="cmnt-poster">Posted by {parent.poster.username}</p>
                    <div className="cmnt-posted-date" >
                        <DateText date={dayjs(parent.posted_date)} />
                    </div>
                    <div className="cmnt-point-stats">
                        <p className="upvote-stat stat">
                            {parent.point_stats.upvotes}
                            <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24"><path d="M24 22h-24l12-20z"/></svg>
                        </p>
                        <p className="downvote-stat stat">
                            {parent.point_stats.downvotes}
                            <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24"><path d="M12 21l-12-18h24z"/></svg>
                        </p>
                        <p className="favourability-stat stat">{parent.point_stats.favourability}%</p>
                    </div>
                </header>
                <main className="cmnt-content">{parent.content}</main>
            </div>}
            {post && <div className="post-in-comment parent">
                <Post isPreview postData={post} />
            </div>}
            <div className="main-cmnt">
                <header className="cmnt-preview-header">
                    <p className="cmnt-poster">Posted by {comment.poster.username}</p>
                    <div className="cmnt-posted-date" >
                        <DateText date={dayjs(comment.posted_date)} />
                    </div>
                    <div className="cmnt-point-stats">
                        <p className="upvote-stat stat">
                            {comment.point_stats.upvotes}
                            <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24"><path d="M24 22h-24l12-20z"/></svg>
                        </p>
                        <p className="downvote-stat stat">
                            {comment.point_stats.downvotes}
                            <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24"><path d="M12 21l-12-18h24z"/></svg>
                        </p>
                        <p className="favourability-stat stat">{comment.point_stats.favourability}%</p>
                    </div>
                </header>
                <main className="cmnt-content">{comment.content}</main>
                <footer className="cmnt-footer">
                    <button className={"reply-btn footer-btn "} onClick={handleReplyClick}>
                        <p>Reply</p>
                    </button>
                    <SaveButton className="save-btn footer-btn" onToggleSave={updateSaveState} contentType='comment' contentId={comment.id}>{isSaved? 'Saved' : 'Save'}</SaveButton>
                    {comment.parent && <button className="footer-btn" onClick={() => parent ? removeParent() : getParent()}>View Parent</button>}
                    <button className="footer-btn" onClick={() => post ? removeParent() : getPost()}>View Post</button>
                </footer>
                {inReplyMode && (
                    <div className="reply-form">
                        <CommentForm parent={comment} postId={comment.post} onCancel={(e) => setInReplyMode(false)} onPost={handlePost} />
                    </div>
                )}
            </div>
        </div>
     );
}
 
export default CommentPreview;