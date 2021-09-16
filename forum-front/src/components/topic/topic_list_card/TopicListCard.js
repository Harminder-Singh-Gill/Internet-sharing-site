import { useContext, useEffect, useState } from 'react';
import { LoginRequiredContext } from 'App';
import axiosInstance from 'axiosInstance';
import './TopicListCard.css';
import TopicListCardItem from 'components/topic/topic_list_card/TopicListCardItem';

const areAllFollowed = (topics) => {
    return !topics.some(topic => !topic.is_followed);
} 

const TopicListCard = ({topics, label='Topics'}) => {
    const loginRequired = useContext(LoginRequiredContext);
    const [topicList, setTopicList] = useState([]);
    const [followedTopicNames, setFollowedTopicNames] = useState([]);

    useEffect(() => {
        setTopicList(topics);
    }, [topics, setTopicList]);

    const followMultiple = loginRequired((topics) => {
        if (!topics) {return;}

        const notFollowedTopics = topics.filter(topic => !topic.is_followed);
        const topicNames = notFollowedTopics.map(topic => topic.name);
        
        axiosInstance
        .post('topics/follow_multiple/', {topics: topicNames})
        .then(response => {
            const updatedTopics = topics.map(topic => {
                const topicsDict = response.data.topics.reduce((object, topic) => ({
                    ...object,
                    [topic.name]: topic 
                }), {});

                return (topic.name in topicsDict) ? topicsDict[topic.name] : topic;
            })
            
            console.log(updatedTopics);
            setTopicList(updatedTopics);

            const topicNames = response.data.topics.map(topic => topic.name);
            setFollowedTopicNames(topicNames);
        });
    })

    const toggleFollowMultiple = loginRequired((topics) => {
        if (!topics) {return;}
        
        axiosInstance
        .post('topics/toggle_follow_multiple/', {topics: followedTopicNames})
        .then(response => {
            const updatedTopics = topics.map(topic => {
                const topicsDict = response.data.topics.reduce((object, topic) => ({
                    ...object,
                    [topic.name]: topic 
                }), {});
                
                return (topic.name in topicsDict) ? topicsDict[topic.name] : topic;
            })
            console.log(updatedTopics);
            setTopicList(updatedTopics);
            setFollowedTopicNames([]);
        });
    })

    const updateFollowerData = (topicName, isFollowed, followerCount) => {
        const newTopicList = topicList.map(topic => {
            if (topicName === topic.name) {
                topic.is_followed = isFollowed;
                topic.follower_count = followerCount;
            }

            return topic;
        })

        setTopicList(newTopicList);
    }

    const handleFollowAllClick = (e) => {
        if (followedTopicNames.length === 0) {
            followMultiple(topicList);
        } else {
            toggleFollowMultiple(topicList);
        }
    }
    
    return topicList && (
        <div className="topic-list-card card-shadow">
            <header className="topic-list-header">{label}</header>
            <main className="topic-list">
                {topicList.map(topic => (
                    <div className="topic-list-card-item-div" key={topic.name}>
                        <TopicListCardItem onToggleFollowClick={() => setFollowedTopicNames([])} onFollowerDataChange={updateFollowerData} topic={topic} />
                    </div>
                ))}
            </main>
            <footer className="topic-list-footer">
                <button type="button" className="follow-all-btn" onClick={handleFollowAllClick} disabled={(followedTopicNames.length === 0) && areAllFollowed(topicList)}><p>{followedTopicNames.length > 0 ? 'Undo' : 'Follow All'}</p></button>
            </footer>
        </div>
     );
}
 
export default TopicListCard;