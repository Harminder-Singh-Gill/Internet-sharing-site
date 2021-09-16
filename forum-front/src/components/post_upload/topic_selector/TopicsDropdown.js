import {useState, useEffect} from 'react';
import axiosInstance from "axiosInstance";
import './TopicsDropdown.css';
import axios from 'axios';
import { getImgUrl } from 'baseUrls';

const iIncludes = (includer, included) => {
    return includer.toLowerCase().includes(included.toLowerCase());
}

const TopicsDropdown = ({user, userTopics, searchQuery, onSelect}) => {
    const [filteredUserTopics, setFilteredUserTopics] = useState(userTopics || []);
    const [results, setResults] = useState([]);

    useEffect(() => {
        const filteredUserTopics = userTopics.filter(topic => iIncludes(topic.name, searchQuery));
        setFilteredUserTopics(filteredUserTopics);
        
        if (searchQuery === '') {
            setResults([]);
            return;
        }

        const source = axios.CancelToken.source();
        axiosInstance
        .get('topics/?search=' + searchQuery, { cancelToken: source.token })
        .then(response => {
            const results = response.data.filter(topic => {
                const filteredTopicNames = filteredUserTopics.map(fTopic => fTopic.name);
                return !filteredTopicNames.includes(topic.name);
            });
            setResults(results);
        })
        .catch(error => {});

        return () => {
            source.cancel();
        }
        
    }, [searchQuery, userTopics]);
    
    return ( 
        <div className="dropdown-topics">
            {(iIncludes(user.username, searchQuery) || (results.length === 0 && filteredUserTopics.length === 0)) && (
                <div className="dropdown-profile dropdown-section">
                    <p className="dropdown-section-label">YOUR PROFILE</p>
                    <div className="profile-item dropdown-item" onClick={() => onSelect(null)}>
                        <img className="dropdown-item-icon" alt='' src={user.profile_pic}></img>
                        <p className="username">{user.username}</p>
                    </div>
                </div>
            )}
            {filteredUserTopics.length > 0 && (
                <div className="user-topics dropdown-section">
                    <p className="dropdown-section-label">YOUR TOPICS</p>
                    {filteredUserTopics.map(topic => (
                        <div className="dropdown-item" key={topic.name} onClick={() => onSelect(topic)}>
                            <img className="dropdown-item-icon" alt='' src={topic.icon || getImgUrl('default_topic_icon.jpg')}></img>
                            <p className="topic-name">{topic.name}</p>
                        </div>
                    ))}
                </div>
            )}
            {results.length > 0 && (
                <div className="other-topics dropdown-section">
                    <p className="dropdown-section-label">OTHER TOPICS</p>
                    {results.map(topic => (
                        <div className="dropdown-item" key={topic.name} onClick={() => onSelect(topic)}>
                            <img className="dropdown-item-icon" alt='' src={topic.icon}></img>
                            <p className="topic-name">{topic.name}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
     );
}
 
export default TopicsDropdown;