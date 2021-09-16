import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import useFollowHandler from 'hooks/useFollowHandler';
import { pluralize, shortify } from 'number_format';
import './TopicListCardItem.css';
import { getImgUrl } from 'baseUrls';

const TopicListCardItem = ({topic, onFollowerDataChange, onToggleFollowClick}) => {
    const {isFollowed, followerCount, toggleFollow} = useFollowHandler(topic, 'topic');

    useEffect(() => {
        if (topic.followerCount === followerCount && topic.isFollowed === isFollowed) {return;}
        onFollowerDataChange && onFollowerDataChange(topic.name, isFollowed, followerCount);
    }, [isFollowed, followerCount]);

    const handleToggleFollowClick = (e) => {
        toggleFollow();
        onToggleFollowClick && onToggleFollowClick();
    }

    return ( 
        <div key={topic.name} className="topic-list-card-item">
            <img className="topic-icon" src={topic.icon || getImgUrl('default_topic_icon.jpg')} alt="" />
            <Link to={`/topic/${topic.name}/`} className="topic-info-link">
                <div className="topic-name">{topic.name}</div>
                <div className="topic-follower-info">{`${shortify(followerCount)} ${pluralize(followerCount, 'follower')}`}</div> 
            </Link>
            <button className="topic-follow-btn" onClick={handleToggleFollowClick}>{isFollowed ? 'Unfollow' : 'Follow'}</button>
        </div>
     );
}
 
export default TopicListCardItem;