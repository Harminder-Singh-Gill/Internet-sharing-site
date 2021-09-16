import React, {useEffect, useState} from 'react';
import './TopicMenuOptions.css';
import { SUPER_TOPICS } from './TopicMenu';
import { useHistory } from 'react-router';
import { getImgUrl } from 'baseUrls';

const TopicMenuOptions = ({userTopics, onItemSelect}) => {
    const [filterText, setFilterText] = useState('');
    const [filteredTopics, setFilteredTopics] = useState(userTopics);
    const history = useHistory();

    useEffect(() => {
        const fTopics = userTopics.filter((topic) => topic.name.toLowerCase().startsWith(filterText.toLowerCase()));
        setFilteredTopics(fTopics);
    }, [filterText, userTopics, setFilteredTopics]);

    const handleSuperTopicClick = (superTopicName) => {
        onItemSelect && onItemSelect(superTopicName);
        history.push(`/${superTopicName.toLowerCase()}`);
    }

    const handleTopicClick = (topicName) => {
        onItemSelect && onItemSelect(topicName);
        history.push(`/topic/${topicName}`);
    }

    return (
        <div className="topic-menu-options card-shadow">

            <div className="super-topics">
                {Object.values(SUPER_TOPICS).map(superTopic => (
                    <div className="topic-option" key={superTopic.name} onClick={() => handleSuperTopicClick(superTopic.name)}>
                        <img className="super-topic-icon" src={superTopic.icon} alt=""></img>
                        <div className="topic-name-option">{superTopic.name}</div>
                    </div>
                ))}
            </div>

            <div className="topics">
                <p className="your-topics-label">YOUR TOPICS</p>
                <div className="topic-filter-div">
                    <input type="text" className="topic-filter" value={filterText} onChange={(e) => setFilterText(e.target.value)} placeholder="Filter"></input>
                </div>
                {filteredTopics.map((topic) => (
                    <div className="topic-option" key={topic.name} onClick={() => handleTopicClick(topic.name)}>
                        <img className="topic-icon-option" src={topic.icon || getImgUrl('default_topic_icon.jpg')} alt="Topic"></img>
                        <div className="topic-name-option">{topic.name}</div>
                    </div>
                ))}
            </div>
        </div>
        
     );
}
 
export default TopicMenuOptions;