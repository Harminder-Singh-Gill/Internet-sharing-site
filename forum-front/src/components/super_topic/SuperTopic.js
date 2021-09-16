import { useHistory, useParams } from "react-router";
import { useCallback, useContext, useEffect, useState } from "react";
import { LoginRequiredContext, ScrollTopContext, UserContext } from "App";
import ContentList from "components/specific_utils/content_list/ContentList";
import SortMenu from "components/specific_utils/sorting/SortMenu";
import { getSortType } from "components/user/Profile";
import './SuperTopic.css';
import TopicListCard from "components/topic/topic_list_card/TopicListCard";
import useAxios from "hooks/useAxios";
import usePageInfoSetter from "hooks/usePageInfoSetter";
import MiniPost from "components/post/MiniPost";
import { Link } from "react-router-dom";

const SuperTopic = ({superTopicName}) => {
    console.log(window.location.pathname);
    const {sort, sortPeriod } = useParams();
    const history = useHistory();
    const sortType = getSortType(sort, sortPeriod, 'hot');
    const [selectedSort, setSelectedSort] = useState(sortType);
    const scrollToTop = useContext(ScrollTopContext);
    const [topics, isPending, error] = useAxios('topics/?limit=5');
    const [postData, trendingIsPending, trendingPostsError] = useAxios('post/posts/?page_size=3&ordering=-_points&time_period=week');
    const trendingPosts = postData?.results;
    const user = useContext(UserContext);
    const loginRequired = useContext(LoginRequiredContext);

    usePageInfoSetter({superTopicName: superTopicName});
    
    useEffect(() => {
        const sortType = getSortType(sort, sortPeriod, 'hot');
        setSelectedSort(sortType);
    }, [sort, sortPeriod]);

    const handleSortChange = useCallback((sort) => {
        scrollToTop();
        // if (superTopicName === 'frontpage') {
        //     history.push(`/${sort}`);
        // }else {
        //     history.push(`/${superTopicName}/${sort}`);
        // }
        history.push(`/${superTopicName}/${sort}`);
    }, [history, superTopicName, scrollToTop]);

    const handleCreatePostClick = useCallback(loginRequired(() => {
        history.push('/post/create/');
    }), [loginRequired, history]);

    return (
        <div className="super-topic">
            <div className="sort-section">
                <aside className="menus">
                    <SortMenu defaultSort={ selectedSort } onChange={handleSortChange} />
                    <div className="line-div"></div>
                    <div className="menu-buttons">
                        <button className="menu-create-post-btn menu-btn" onClick={handleCreatePostClick}>Create a Post</button>
                        <button onClick={loginRequired(() => history.push("/topic/create"))} className="menu-create-topic-btn menu-btn round-btn">Create a Topic</button>
                        {user && <button className="menu-profile-btn menu-btn" onClick={() => history.push(`/user/${user.username}/`)}>Your Profile</button>}
                    </div>
                </aside>
            </div>
            <div className="posts">
                <ContentList contentType="post" sort={selectedSort} loggedInUserRelation={superTopicName === 'frontpage' ? 'followed' : null} />
            </div>
            <div className="super-topic-sidebar">
                <div className="topic-list-card-div" style={trendingPosts && trendingPosts.length > 0 ? null : {position: 'sticky', top: '20px'}}>
                    <TopicListCard label="Top 5 Topics" topics={topics}/>
                </div>
                {trendingPosts && trendingPosts.length > 0 && <div className="trending-posts-section">
                    <h3 className="trending-posts-title">Trending Posts</h3>
                    <div className="trending-posts">
                        {trendingPosts.map(post => (
                            <div key={'mp' + post.id} className="trending-post">
                                <MiniPost post={post} />
                            </div>
                        ))}
                    </div>
                </div>}
            </div>
        </div>
     );
}
 
export default SuperTopic;