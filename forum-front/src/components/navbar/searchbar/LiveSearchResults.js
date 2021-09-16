import axios from "axios";
import { useEffect, useState } from "react";
import axiosInstance from "axiosInstance";
import {useHistory} from 'react-router-dom';
import './LiveSearchResults.css';
import { getImgUrl } from "baseUrls";

const LiveSearchResults = ({searchQuery, onResultClick}) => {
    const [topicResults, setTopicResults] = useState([]);
    const [userResults, setUserResults] = useState([]);
    const history = useHistory();

    useEffect(() => {

        if (searchQuery === '') {
            setTopicResults([]);
            setUserResults([]);
            return;
        }

        const source = axios.CancelToken.source();
        axiosInstance('search/?topic=true&user=true&search=' + searchQuery, { cancelToken: source.token })
        .then(response => {
            setTopicResults(response.data.topics);
            setUserResults(response.data.users);
        })
        .catch(error => {
        }); // This is incase source.cancel() is called

        return () => {
            source.cancel();
        }
    }, [searchQuery]);

    const handleTopicClick = (e, topic) => {
        onResultClick && onResultClick(topic);
        history.push(`/topic/${topic.name}/`);
    }

    const handleUserClick = (e, user) => {
        onResultClick && onResultClick(user);
        history.push(`/user/${user.username}/`);
    }

    return searchQuery && (topicResults.length > 0 || userResults.length > 0) &&  (
        <div className="live-search-results card-shadow">
            {topicResults.length > 0 && (
                <div className="results-section">
                    <div className="result-section-title">TOPICS</div>
                    <div className="topic-results results">
                        {topicResults.map(topic => (
                            <button onClick={(e) => handleTopicClick(e, topic)} className="result" key={topic.name}>
                                <img src={topic.icon || getImgUrl('default_topic_icon.jpg')} alt="" className="result-icon" />
                                <p className="result-name">{topic.name}</p>
                            </button>
                        ))}
                    </div>
                </div>
            )}
            {userResults.length > 0 && (
                <div className="results-section">
                    <div className="result-section-title">USERS</div>
                    <div className="user-results results">
                        {userResults.map(user => (
                            <button className="result" onClick={(e) => handleUserClick(e, user)} key={user.username}>
                                <img src={user.profile_pic} alt="" className="result-icon" />
                                <p className="result-name">{user.username}</p>
                            </button>
                        ))}
                    </div>
                </div>
            )}
            {/* {isPending && (
                <div className="loading-message">Loading...</div>
            )} */}
        </div>
     );
}
 
export default LiveSearchResults;