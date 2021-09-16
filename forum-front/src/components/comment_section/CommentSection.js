import CommentThread from "components/comment/CommentThread";
import useScrollPagination from "hooks/useScrollPagination";
import './CommentSection.css';

const COMMENT_SORT_PARAMS = {
    top: '-_points',
    new: '-posted_date',
    old: 'posted_date'
}

const getCommentEndPointUrl = (postId, sort) => {
    const sortQuery = sort && COMMENT_SORT_PARAMS[sort] ? 'ordering=' + COMMENT_SORT_PARAMS[sort] : "";
    return `/comments/?post=${postId}&${sortQuery}&only_top_level=true`;
};

const CommentSection = ({postId, sort, isNoComments}) => {
    const {content: comments, hasMore, loaderRef} = useScrollPagination(getCommentEndPointUrl(postId, sort));

    return ( 
        <div className="comment-section">
            {comments && comments.map(comment => (
                <div className="comment-thread-div" key={comment.id}>
                    <CommentThread commentData={comment}/>
                </div>
            ))}
            {isNoComments && comments.length === 0 && !hasMore && (
                <p className="no-cmnt-message">No comments here</p>
            )}
            {hasMore && <div ref={loaderRef} className="loading-icon" ></div>}
        </div>
     );
}
 
export default CommentSection;