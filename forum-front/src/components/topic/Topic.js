import { useHistory, useParams } from "react-router";
import useAxios from "hooks/useAxios";
import ContentList from "components/specific_utils/content_list/ContentList";
import './Topic.css';
import SortMenu from "components/specific_utils/sorting/SortMenu";
import useFollowHandler from "hooks/useFollowHandler";
import TopicSidebar from "components/topic/topic_sidebar/TopicSidebar";
import { getSortType } from "components/user/Profile";
import { useCallback, useContext, useEffect, useState } from "react";
import { ScrollTopContext, UserContext } from "App";
import usePageInfoSetter from "hooks/usePageInfoSetter";
import { pluralize, shortify } from "number_format";
import IconEditRemoveButton from "./icon_edit_remove_button/IconEditRemoveButton";
import axiosInstance from "axiosInstance";
import { getImgUrl } from "baseUrls";

const Topic = () => {
    const {name, sort, sortPeriod } = useParams();
    const [topic, isPending, error] = useAxios('topics/' + name + '/');
    const {isFollowed, followerCount, toggleFollow} = useFollowHandler(topic, 'topic');
    const history = useHistory();
    const sortType = getSortType(sort, sortPeriod, 'hot');
    const [selectedSort, setSelectedSort] = useState(sortType);
    const scrollToTop = useContext(ScrollTopContext);
    const [isInIconEditMode, setIsInIconEditMode] = useState(true);
    const user = useContext(UserContext);

    usePageInfoSetter({topicName: topic?.name});

    useEffect(() => {
        const sortType = getSortType(sort, sortPeriod, 'hot');
        setSelectedSort(sortType);
    }, [sort, sortPeriod]);

    const handleSortChange = useCallback((sort) => {
        scrollToTop();
        history.push(`/topic/${name}/${sort}`);
    }, [name, history, scrollToTop]);

    const setNewIcon = (newIconUrl) => {
        let formData = null;
        if (newIconUrl) {
            formData = new FormData();
            formData.append('icon', newIconUrl);
        }
        axiosInstance.post(`topics/${name}/set_icon/`, formData)
        .then(response=> window.location.reload())
        .catch(error => {});
    }

    const isModerator = (user) => {
        return topic.moderators.some(moderator => moderator.username === user.username);
    }

    return topic && (
        <div className={"topic " + (isFollowed ? 'followed' : '')}>
            <aside className="sort-section">
                <div className="sidebar-topic-section">
                    <div className="sidebar-topic-info-section">
                        <div className="sidebar-topic-icon-div">
                            <img src={topic.icon || getImgUrl('default_topic_icon.jpg')} alt="" className="sidebar-topic-icon"/>
                        </div>
                        <div className="sidebar-title-name-div">
                            <p className="sidebar-topic-name">t/{topic.name}</p>
                            <div className="sidebar-followers">{shortify(followerCount)} {pluralize(followerCount, 'follower')}</div>
                        </div>
                    </div>
                    <div className="sidebar-follower-section">
                        <button className="sidebar-follow-btn sidebar-btn" onClick={toggleFollow}>{isFollowed? 'Unfollow' : 'Follow'}</button>
                        <button type="button" onClick={() => history.push(`/post/t/${topic.name}/create`)} className="sidebar-create-post-btn sidebar-btn">Create Post</button>
                    </div>
                </div>
                <div className="line-div"></div>
                <SortMenu defaultSort={ selectedSort } onChange={ handleSortChange } />
            </aside>
            <main className="topic-main">
                <header className="topic-header" style={{backgroundImage: `url('${topic.banner}')`}}>
                    <div className="topic-info-section">
                        <div className="main-topic-icon-div">
                            <img src={topic.icon || getImgUrl('default_topic_icon.jpg')} alt="" className="main-topic-icon"/>
                            {user && isModerator(user) &&
                             <IconEditRemoveButton className="topic-icon-edit-remove-button" onSave={setNewIcon} onRemove={() => setNewIcon()}/>
                            }
                        </div>
                        <div className="title-name-div">
                            <p className="main-topic-title">{topic.title || topic.name}</p>
                            <p className="main-topic-name">t/{topic.name}</p>
                        </div>
                    </div>
                    <button className="main-follow-btn" onClick={toggleFollow}>{isFollowed? 'Unfollow' : 'Follow'}</button>
                </header>
                <div className="posts">
                    <ContentList contentType="post" sort={selectedSort} topicName={name} />
                </div>
                <TopicSidebar className="sidebar" topic={topic} followerData={{isFollowed, followerCount, toggleFollow}} />
            </main>
        </div>
     );
}
 
export default Topic;