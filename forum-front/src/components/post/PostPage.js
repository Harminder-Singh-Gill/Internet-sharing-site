import { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";
import axiosInstance from "axiosInstance";
import useFollowHandler from "hooks/useFollowHandler";
import usePageInfoSetter from "hooks/usePageInfoSetter";
import CommentForm from "components/comment/CommentForm";
import CommentThread from "components/comment/CommentThread";
import TopicSidebar from "components/topic/topic_sidebar/TopicSidebar";
import UserSidebar from "components/user/user_sidebar/UserSidebar";
import Post from "components/post/Post";
import './PostPage.css';
import CommentSection from "components/comment_section/CommentSection";
import { pluralize, shortify } from "number_format";

const PostPage = () => {
    const history = useHistory();
    const {id, sort} = useParams();
    const [postData, setPostData] = useState(null);
    const [topic, setTopic] = useState(null);
    const {isFollowed, followerCount, toggleFollow} = useFollowHandler(topic, 'topic');
    const [user, setUser] = useState(null);
    const [newUserComments, setNewUserComments] = useState([]);
    const [selectedSort, setSelectedSort] = useState('top');

    useEffect(() => {
        setSelectedSort(sort);
    }, [sort, setSelectedSort]);

    usePageInfoSetter({topicName: topic?.name, username: user?.username});

    useEffect(() => {
        axiosInstance(`post/posts/${id}/post_topic/`)
        .then(response => {
            setPostData(response.data.post);
            if (response.data.topic) {
                setTopic(response.data.topic);
            } else if (response.data.user) {
                setUser(response.data.user);
            }
        })
        .catch(error => {
            history.push('/');
        })
    }, [history, id]);
    
    const addComment = (commentData) => {
        setNewUserComments(prev => [commentData, ...prev]);
        // setPostData(prev => ({
        //     ...prev,
        //     comments: [commentData, ...prev.comments],
        //     comment_count: prev.comment_count + 1
        // }));
    }

    const onCommentSortChange = (e) => {
        setNewUserComments([]);
        history.push(`/post/${postData.id}/${e.target.value}/`);
    }

    return !postData? null : (
        <div className='post-page'>
            <div className="post-main card-shadow">
                <div className="post-div">
                    <Post postData={postData}/>
                </div>
                <div className="main-comment-section">
                    <div className="comment-section-div">
                        <div className="cmnt-form-div">
                            <CommentForm postId={postData.id} onPost={addComment} />
                        </div>
                        <header className="comment-section-header">
                            <p className="comment-count">{shortify(postData.comment_count  + newUserComments.length)} {pluralize(postData.comment_count + newUserComments.length, "Comment")}</p>
                            <div className="comment-sort-section">
                                <select className="comment-sort-select" value={selectedSort} onChange={onCommentSortChange}>
                                    <option value="top">Top</option>
                                    <option value="new">New</option>
                                    <option value="old">Old</option>
                                    <option value="controversial">Controversial</option>
                                </select>
                            </div>
                        </header>
                        <div className="new-user-comments">
                            {newUserComments.map(comment => (
                                <CommentThread key={comment.id} commentData={comment}/>
                            ))}
                        </div>
                        <CommentSection postId={postData.id} sort={selectedSort} isNoComments={newUserComments.length === 0}/>
                    </div>
                </div>
            </div>
            {topic && <TopicSidebar className="post-sidebar sidebar" topic={topic} followerData={{isFollowed, followerCount, toggleFollow}}/>}
            {(!topic && user) && (
                <div className="user-sidebar sidebar">
                    <UserSidebar user={user} />
                </div>
            )}
        </div>    
     );
}
 
export default PostPage;