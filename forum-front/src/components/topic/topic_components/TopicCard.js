import dayjs from "dayjs";
import { pluralize, shortify } from "../../../number_format";
import useFollowHandler from "../../../hooks/useFollowHandler";
import './TopicCard.css';
import { Link } from "react-router-dom";
import { getImgUrl } from "baseUrls";

const TopicCard = ({topic}) => {
    const dayJsDate = dayjs(topic.creation_date);
    const date = dayJsDate.format('MMM D, YYYY');
    const {isFollowed, followerCount, toggleFollow} = useFollowHandler(topic, 'topic');
    
    return (
        <div className="topic-card card-shadow">
            <header className="header-section">
                <img src={topic.icon || getImgUrl('default_topic_icon.jpg')} alt="" className="circle-icon"/>
                <Link to={`/topic/${topic.name}/`} className="topic-name">t/{topic.name}</Link>
            </header>
            <main className="body-section">
                <p className="description">{topic.description}</p>
                <div className="follower-section">
                <div className="follower-stat">
                    <div className="follower-num">{shortify(followerCount)}</div>
                        <div className="follower-label">{pluralize(followerCount, 'follower')}</div>
                    </div>
                    <button type="button" onClick={toggleFollow} className="follow-btn btn">{isFollowed? 'Unfollow': 'Follow'}</button>
                </div>
                <div className="creation-date-section">
                    <svg id="Capa_1" enableBackground="new 0 0 511.955 511.955" height="24" viewBox="0 0 511.955 511.955" width="24" xmlns="http://www.w3.org/2000/svg"><g><g><g><g><g><path d="m286.889 198.629c-15.616-97.406 28.584-162.013 115.053-187.818 21.358-6.374 40.322-9.147 62.155-10.69 10.136-1.28 18.571 7.745 16.599 17.776-15.089 76.729-31.177 122.284-52.164 147.708-33.704 40.83-72.782 25.967-121.456 44.652-8.897 3.417-18.683-2.234-20.187-11.628z" fill="#6b0"/></g></g></g></g><g><g><g><g><path d="m204.88 210.259c-48.694-18.693-87.752-3.822-121.456-44.652-20.987-25.425-37.075-70.979-52.164-147.709-1.975-10.041 6.476-19.057 16.6-17.776 121.227 8.565 196.84 76.048 177.207 198.507-1.508 9.412-11.306 15.039-20.187 11.63z" fill="#9cdd05"/></g></g></g></g><path d="m377.788 133.665c-99.96 91.61-102.81 155.17-106.11 228.77-.23 5.06-.46 10.15-.72 15.27-.46 9.51-7.72 14.26-14.98 14.25-7.26 0-14.51-4.75-14.98-14.25-.26-5.12-.49-10.21-.72-15.27-3.3-73.6-6.15-137.16-106.11-228.77-6.11-5.59-6.52-15.08-.93-21.19 5.6-6.11 15.09-6.52 21.2-.92 44.84 41.09 83.41 87.63 101.54 145.99 18.12-58.36 56.7-104.9 101.54-145.99 6.11-5.6 15.6-5.19 21.2.92 5.59 6.11 5.18 15.6-.93 21.19z" fill="#c3ea21"/><path d="m377.788 133.665c-99.96 91.61-102.81 155.17-106.11 228.77-.23 5.06-.46 10.15-.72 15.27-.46 9.51-7.72 14.26-14.98 14.25v-134.41c18.12-58.36 56.7-104.9 101.54-145.99 6.11-5.6 15.6-5.19 21.2.92 5.59 6.11 5.18 15.6-.93 21.19z" fill="#9cdd05"/><g><path d="m383.068 422.515c-13.16-23.33-40.31-35.25-66-28.85-13.91-19.61-36.64-31.71-61.09-31.71s-47.18 12.1-61.09 31.71c-25.67-6.39-52.83 5.5-66 28.85-21.46 3.41-37.91 22.04-37.91 44.44 0 24.81 20.19 45 45 45h240c24.81 0 45-20.19 45-45 0-22.4-16.45-41.03-37.91-44.44z" fill="#c86e59"/></g><path d="m420.978 466.955c0 24.81-20.19 45-45 45h-120v-150c24.45 0 47.18 12.1 61.09 31.71 25.69-6.4 52.84 5.52 66 28.85 21.46 3.41 37.91 22.04 37.91 44.44z" fill="#a34f3e"/></g></svg>
                    <div className="creation-date-prefix">Created on <span className="creation-date">{date}</span></div>
                </div>
            </main>
        </div>
     );
}
 
export default TopicCard;