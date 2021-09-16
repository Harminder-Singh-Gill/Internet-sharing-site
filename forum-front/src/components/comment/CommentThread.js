import { useEffect, useState } from "react";
import axiosInstance from "axiosInstance";
import { pluralize } from "number_format";
import DownvoteButton from "components/specific_utils/content_related_components/DownvoteButton";
import UpvoteButton from "components/specific_utils/content_related_components/UpvoteButton";
import Comment from "components/comment/Comment";
import './CommentThread.css';

const CommentThread = ({commentData, isChild = false}) => {
    const [comment, setComment] = useState(commentData);
    
    useEffect(() => {
        setComment(commentData);
    }, [commentData]);

    const getMoreReplies = (e) => {
        axiosInstance
        .get('comments/?id__in=' + comment.low_priority_replies)
        .then(response => {
            setComment(prev => ({
                ...prev,
                replies: [...prev.replies, ...response.data.results],
                low_priority_replies: [] 
            }))
        })
    }

    const handleVote = (pointStats) => {
        setComment(prev => ({
            ...prev, 
            point_stats: pointStats
        }))
    }

    return !comment ? null : (
        <div className={"comment-thread " + (isChild ? 'child-cmnt-thread': '')}>
            <aside className="vertical-section">
                <img src={comment.poster.profile_pic} alt="" className="commenter-pic"/>
                <div className={"point-section " + comment.point_stats.vote}>
                    <UpvoteButton className="upvote-btn vote-btn" onVote={handleVote} contentType="comment" contentId={comment.id}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path d="M24 22h-24l12-20z"/></svg>
                    </UpvoteButton>
                    <p className="comment-points">{comment.point_stats.points}</p>
                    <DownvoteButton className="downvote-btn vote-btn" onVote={handleVote} contentType="comment" contentId={comment.id}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path d="M12 21l-12-18h24z"/></svg>
                    </DownvoteButton>
                </div>
                <div className="collapser">
                    <div className="vertical-line"></div>
                </div>
            </aside>
            <main className="comment-section">
                <Comment commentData={comment} setComment={setComment}/>
                <div className="replies">
                    {comment.replies.map(comment => (
                        <CommentThread commentData={comment} key={comment.id} isChild/>
                    ))}
                </div>
                {comment.low_priority_replies.length > 0 && <button type="button" onClick={getMoreReplies} className="load-more-btn">{comment.low_priority_replies.length} more {pluralize(comment.low_priority_replies.length, 'reply')}</button>} 
            </main>
        </div>
     );
}
 
export default CommentThread;