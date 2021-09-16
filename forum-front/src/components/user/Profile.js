import { useContext, useCallback, useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";
import { ScrollTopContext, UserContext } from "App";
import useAxios from "hooks/useAxios";
import usePageInfoSetter from "hooks/usePageInfoSetter";
import ContentList from "components/specific_utils/content_list/ContentList";
import SortMenu, { SORT_OPTIONS } from "components/specific_utils/sorting/SortMenu";
import UserContentMenu, { USER_CONTENT_OPTIONS } from "components/user/user_content_menu/UserContentMenu";
import './Profile.css';
import UserSidebar from "components/user/user_sidebar/UserSidebar";

export const getSortType = (sort, sortPeriod, defaultSort) => {
    if (!isValidSort(sort)) {
        return defaultSort;
    }

    if (sort === 'top' && sortPeriod) {
        return `${sort}/${sortPeriod}`;
    }

    return sort;
}

const isValidSort = (sort) => {
    if (sort === 'top') {return true;}
    return Object.values(SORT_OPTIONS).includes(sort)
};

const getLoggedInUserRelation = (contentOption) => {
    if (
        contentOption === USER_CONTENT_OPTIONS.overview ||
        contentOption === USER_CONTENT_OPTIONS.posts ||
        contentOption === USER_CONTENT_OPTIONS.comments
    ) {return null;}

    return contentOption;
}

const getContentType = (contentOption) => {
    if (contentOption === USER_CONTENT_OPTIONS.comments) {
        return 'comment';
    }
    
    if (
        contentOption === USER_CONTENT_OPTIONS.posts ||
        contentOption === USER_CONTENT_OPTIONS.hidden ||
        contentOption === USER_CONTENT_OPTIONS.upvoted ||
        contentOption === USER_CONTENT_OPTIONS.downvoted
    ) { return 'post'; }

    return 'post_comment';
}

const Profile = () => {
    const scrollToTop = useContext(ScrollTopContext);
    const loggedInUser = useContext(UserContext);
    const history = useHistory();

    const {username, contentOption: contentOptionParam, sort, sortPeriod } = useParams();
    
    const sortType = getSortType(sort, sortPeriod, 'new');
    const contentOpt = contentOptionParam || 'overview';
    
    const [user, isPending, error] = useAxios('users/' + username + '/');
    const [selectedSort, setSelectedSort] = useState(sortType);
    const [selectedContentOption, setSelectedContentOption] = useState(contentOpt);
    const loggedInUserRelation = getLoggedInUserRelation(selectedContentOption);
    const contentType = getContentType(selectedContentOption);

    usePageInfoSetter({username: user?.username});

    // useEffect(() => {
    //     scrollToTop();
    //     history.push(`/user/${username}/${selectedContentOption}/${selectedSort}`);
    // }, [selectedSort, selectedContentOption, history, username, scrollToTop]);

    useEffect(() => {
        const contentOpt = contentOptionParam || 'overview';
        setSelectedContentOption(contentOpt);
    }, [contentOptionParam]);

    useEffect(() => {
        const sortType = getSortType(sort, sortPeriod, 'new');
        setSelectedSort(sortType);
    }, [sort, sortPeriod]);

    const handleSortChange = useCallback((sort) => {
        scrollToTop();
        history.push(`/user/${username}/${selectedContentOption}/${sort}`);
    }, [username, selectedContentOption, history, scrollToTop]);

    const handleContentOptionChange = useCallback((contentOption) => {
        scrollToTop();
        history.push(`/user/${username}/${contentOption}/${selectedSort}`);
    }, [username, selectedSort, history, scrollToTop]);

    return (
        <div className="profile">
            <div className="left-profile-sidebar">
                <div className="menus">
                    <SortMenu exclude={[SORT_OPTIONS.hot]} defaultSort={ selectedSort } onChange={handleSortChange} />
                    <div className="line-div"></div>
                    <UserContentMenu isUserPermitted={loggedInUser && (username === loggedInUser.username)} defaultOption={ selectedContentOption } onChange={handleContentOptionChange} />
                </div>
            </div>
            <div className="profile-content-list">
                <ContentList contentType={contentType} sort={selectedSort} loggedInUserRelation={loggedInUserRelation} username={loggedInUserRelation ? null : username}/>
            </div>
            <UserSidebar className="right-profile-sidebar" user={user} />
        </div>
     );
}
 
export default Profile;