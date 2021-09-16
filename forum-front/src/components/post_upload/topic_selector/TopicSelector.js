import { useState, useEffect } from "react";
import axiosInstance from "axiosInstance";
import ClickNotifier from "components/utils/click_notifier/ClickNotifier";
import TopicsDropdown from "./TopicsDropdown";
import './TopicSelector.css';
import { getImgUrl } from "baseUrls";

const TopicSelector = ({user, initialTopic, onChange}) => {
    const [selectedTopic, setSelectedTopic] = useState(initialTopic);
    const [searchQuery, setSearchQuery] = useState('');
    const [isActive, setIsActive] = useState(false);
    const [userTopics, setUserTopics] = useState([]);

    useEffect(() => {
        setSelectedTopic(initialTopic);
    }, [initialTopic]);
    
    useEffect(() => {
        if (!isActive) {
            setSearchQuery('');
        }
    }, [isActive]);
    
    useEffect(() => {
        if (!user) {return;}

        axiosInstance
        .get('topics/?followers__username=' + user.username)
        .then(response => setUserTopics(response.data));
    }, [user]);

    const handleSelect = (topic) => {
        setSearchQuery('');
        setIsActive(false);
        if (selectedTopic !== topic) {
            setSelectedTopic(topic);
            if (onChange) {
                onChange(topic);
            }
        }
    }
    return ( 
        <ClickNotifier onClickInside={() => setIsActive(true)} onClickOutside={() => setIsActive(false)}>
            <div className="topic-selector card-shadow">
                <div className="main-bar">
                    {searchQuery === '' && 
                        <>
                            {selectedTopic && <img className="selected-icon" alt='' src={selectedTopic.icon || getImgUrl('default_topic_icon.jpg')}></img>}
                            {(!selectedTopic && user) && <img className="selected-icon" alt='' src={user.profile_pic}></img>}
                        </>
                    }
                    {searchQuery !== '' && <svg className="search-icon" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>}
                    <div className="input-section">
                        <input className="search-input" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}></input>
                        {searchQuery === '' && <>
                            {selectedTopic && <div className="selected-item-name " >{selectedTopic.name}</div>}
                            {(!selectedTopic && user) && <div className="selected-item-name ">{user.username}</div>}
                            </>
                        }
                    </div>
                    <button className="dropdown-btn">
                        <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24"><path d="M12 21l-12-18h24z"/></svg>
                    </button>
                </div>
                {(isActive && user) && <div className="dropdown-topics-div">
                    <TopicsDropdown searchQuery={searchQuery} user={user} userTopics={userTopics} onSelect={handleSelect}/>
                </div>}
            </div>
        </ClickNotifier>
     );
}
 
export default TopicSelector;