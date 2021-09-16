import './ContentList.css';
import Post from 'components/post/Post';
import {SORT_OPTIONS} from 'components/specific_utils/sorting/SortMenu';
import { TOP_SORT_OPTIONS } from 'components/specific_utils/sorting/TopSortMenu';
import { USER_RELATED_CONTENT_OPTIONS } from 'components/user/user_content_menu/UserContentMenu';
import CommentPreview from 'components/comment/CommentPreview';
import useScrollPagination from 'hooks/useScrollPagination';

const getUserRelatedQueryParams = (username, loggedInUserRelation) => {
    if (username) { return { poster: username }; }
    
    if (Object.values(USER_RELATED_CONTENT_OPTIONS).includes(loggedInUserRelation)) {
        return {[loggedInUserRelation]: true};
    }

    return {};
}

const getQueryParams = (username, topicName, loggedInUserRelation) => {
    const topicRelatedQueryParams = topicName ? {'topic': topicName} : {};
    const userRelatedQueryParams = getUserRelatedQueryParams(username, loggedInUserRelation);

    return {
        ...topicRelatedQueryParams,
        ...userRelatedQueryParams
    };
}
const ORDERING_PARAMS = {
    [SORT_OPTIONS.hot]: '-hot_rank',
    [SORT_OPTIONS.new]: '-posted_date',
    [SORT_OPTIONS.old]: 'posted_date',
    top: '-_points',
}

const CONTENT_TYPE_URL = {
    'post': 'post/posts/',
    'comment': 'comments/',
    'post_comment': 'post/content-list/' // TODO: Add an API endpoint for getting comments and posts together
}

const getSortingParams = (sort) => {
    const params = {};
    if (Object.values(TOP_SORT_OPTIONS).includes(sort)) {
        const period_limit = sort.split('/')[1];
        if (period_limit) {
            params.time_period = period_limit;
        }
        params.ordering = ORDERING_PARAMS.top;
    } else if (Object.values(SORT_OPTIONS).includes(sort)) {
        params.ordering = ORDERING_PARAMS[sort];
    }else {
        params.ordering = ORDERING_PARAMS.hot;
    }
    return params;
}
const getParamUrl = (url, params) => {
    url = url[url.length-1] === '/' ? url : url + '/';

    return Object.keys(params).reduce((value, paramKey, index) => {
        const prefix = index === 0 ? '?' : '&';
        return value + prefix + `${paramKey}=${params[paramKey]}`;
    }, url);
}
const getContentListURL = (username, topicName, contentType, loggedInUserRelation, sort) => {
    const params = {
        ...getQueryParams(username, topicName, loggedInUserRelation),
        ...getSortingParams(sort),
    }
    const url = getParamUrl(CONTENT_TYPE_URL[contentType], params);
    // const url = Object.keys(params).reduce((value, paramKey, index) => {
    //     const prefix = index === 0 ? '?' : '&';
    //     return value + prefix + `${paramKey}=${params[paramKey]}`;
    // }, CONTENT_TYPE_URL[contentType]);
    
    return url;
}

const ContentList = ({contentType, username, topicName, sort, scrollableParent, loggedInUserRelation}) => {
    const {content, hasMore, isLoading, isError, loaderRef} = useScrollPagination(getContentListURL(username, topicName, contentType, loggedInUserRelation, sort));
    
    return ( 
        <div className="content-list">
            {content.map(content => (
                <div className="content-item" key={content.post_type ? `p${content.id}` : `c${content.id}`}>
                    {!content.post_type && <CommentPreview comment={content}/>}
                    {content.post_type && <Post isPreview postData={content} />}
                </div>
            ))}

            {hasMore && <div className="loading-icon" ref={loaderRef}></div>}
        </div>
     );
}
 
export default ContentList;