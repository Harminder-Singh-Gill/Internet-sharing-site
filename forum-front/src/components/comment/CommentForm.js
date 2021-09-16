import { useContext, useState } from 'react';
import './CommentForm.css';
import axiosInstance from "axiosInstance";
import { LoginRequiredContext } from "App";

const CommentForm = ({parent, onCancel, onPost, postId}) => {
    const [content, setContent] = useState('');
    const loginRequired = useContext(LoginRequiredContext);

    const handleCommentFormSubmit = (e) => {
        e.preventDefault();
        postComment();
    }
    const postComment = loginRequired(() => {
        axiosInstance
        .post('comments/', {
            parentId: parent? parent.id : null, 
            postId,
            content
        })
        .then(response => {
            if (onPost) {
                onPost(response.data);
            }
            setContent('');
        })
    });

    return ( 
        <form onSubmit={handleCommentFormSubmit} className="comment-form">
            <textarea className="comment-textarea" value={content} onChange={e => setContent(e.target.value)} placeholder="Write a comment..." required/>
            <div className="form-btns">
                {parent && <button className="cancel-btn form-btn" type="button" onClick={onCancel? onCancel : ()=>{}} >Cancel</button>}
                <button className="cmnt-submit-btn form-btn" type="submit" disabled={!content}>{parent ? 'Reply': 'Comment'}</button>
            </div>
        </form>
     );
}
 
export default CommentForm;