import dayjs from 'dayjs';
import { useContext, useState } from 'react';
import { LoginRequiredContext } from 'App';
import SaveButton from 'components/specific_utils/content_related_components/SaveButton';
import DateText from 'components/utils/date_text/DateText';
import './Comment.css';
import CommentForm from 'components/comment/CommentForm';

const Comment = ({commentData, setComment}) => {
    const [inReplyMode, setInReplyMode] = useState(false);

    const loginRequired = useContext(LoginRequiredContext);

    const updateSaveState = (isSaved) => {
        setComment((prev) => ({
            ...prev,
            is_saved: isSaved
        }));
    }

    const handlePost = (reply) => {
        setInReplyMode(false);
        setComment(prev => ({
            ...prev,
            replies: [reply, ...prev.replies]
        }))
    }

    const handleReplyClick = loginRequired((e) => {
        setInReplyMode(!inReplyMode);
    });
    
    return ( 
        <article className={"comment " + (commentData.is_saved ? "saved ": "") + (inReplyMode? 'reply-mode ': '')}>
            <header className="cmnt-header">
                <p className="cmnt-poster">{commentData.poster.username}</p>
                <div className="cmnt-posted-date" >
                    <DateText date={dayjs(commentData.posted_date)} />
                </div>
                <div className="cmnt-point-stats">
                    <p className="upvote-stat stat">
                        {commentData.point_stats.upvotes}
                        <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24"><path d="M24 22h-24l12-20z"/></svg>
                    </p>
                    <p className="downvote-stat stat">
                        {commentData.point_stats.downvotes}
                        <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24"><path d="M12 21l-12-18h24z"/></svg>
                    </p>
                    <p className="favourability-stat stat">{commentData.point_stats.favourability}%</p>
                </div>
            </header>
            <main className="cmnt-content">{commentData.content}</main>
            <footer className="cmnt-footer">
                <button className={"reply-btn footer-btn "} onClick={handleReplyClick}>
                    <p>Reply</p>
                </button>
                <SaveButton className="save-btn footer-btn" onToggleSave={updateSaveState} contentType='comment' contentId={commentData.id}>{commentData.is_saved? 'Saved' : 'Save'}</SaveButton>
            </footer>
            {inReplyMode && (
                <div className="reply-form">
                    <CommentForm parent={commentData} postId={commentData.post} onCancel={(e) => setInReplyMode(false)} onPost={handlePost} />
                </div>
            )}
        </article>
     );
}
 
export default Comment;