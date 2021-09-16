import { useHistory, useParams } from "react-router";
import PostUploadTab from "components/post_upload/post_form/PostUploadTab";
import './PostUpload.css';
import TopicSelector from "components/post_upload/topic_selector/TopicSelector";
import { useEffect, useState } from "react";
import axiosInstance from "axiosInstance";
import RulesCard from "components/topic/topic_components/rules/RulesCard";
import TopicCard from "components/topic/topic_components/TopicCard";
import usePageInfoSetter from "hooks/usePageInfoSetter";

const PostUpload = ({user}) => {
    const { topic_name } = useParams();
    const [topic, setTopic] = useState(null);
    const history = useHistory();
    
    usePageInfoSetter({topicName: topic?.name, username: user?.username});

    useEffect(() => {
        if (!topic_name) {return;}

        axiosInstance
        .get('topics/' + topic_name + '/')
        .then(response => {
            setTopic(response.data);
        })
        .catch(error => history.push('/'));
        
    }, [topic_name, history]);

    useEffect(() => {
        if(!topic) {
            history.push('/post/create/');
            return;
        }
        if (topic_name === topic.name) {return;}
        
        history.push(`/post/t/${topic.name}/create/`);

    }, [topic, topic_name, history]);

    return ( 
        <div className="post-upload">
            <main className="post-upload-tab-main">
                <div className="topic-select-section">
                    <TopicSelector user={user} onChange={setTopic} initialTopic={topic} />
                </div>
                {topic?.post_message && <div className="post-message card-shadow">{topic.post_message}</div>}
                <PostUploadTab topic={topic} />
            </main>
            <aside className="sidebar">
                {topic && <>
                    <TopicCard topic={topic} />
                    <RulesCard topic={topic} />
                </>}
            </aside>
        </div>
    );
}
 
export default PostUpload;