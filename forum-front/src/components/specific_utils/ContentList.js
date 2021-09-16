import {useCallback, useEffect, useRef, useState } from 'react';
import axiosInstance from 'axiosInstance';
import Comment from 'components/comment/Comment';
import './ContentList.css';
import Post from 'components/post/Post';
import {SORT_OPTIONS} from 'components/specific_utils/sorting/SortMenu';
import { TOP_SORT_OPTIONS } from 'components/specific_utils/sorting/TopSortMenu';
import { USER_RELATED_CONTENT_OPTIONS } from 'components/user/user_content_menu/UserContentMenu';
import CommentPreview from 'components/comment/CommentPreview';

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
    'post_comment': 'post/content-list' // TODO: Add an API endpoint for getting comments and posts together
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

const ContentList = ({contentType, username, topicName, sort, scrollableParent, loggedInUserRelation}) => {
    const [content, setContent] = useState([]);
    const [currPageNo, setCurrPageNo] = useState(1);
    const [noMoreResults, setNoMoreResults] = useState(false); //TODO: redo later
    const observer = useRef(null);

    let loadingIconRef = useRef(null);
    
    useEffect(() => {
        setContent([]);
        setCurrPageNo(1);
        setNoMoreResults(false); //TODO: redo later
    }, [username, topicName, sort, contentType, loggedInUserRelation]);

    const getContent = useCallback((entries) => {
        if (!entries[0].isIntersecting || !contentType) {return;}
        
        const params = {
            ...getQueryParams(username, topicName, loggedInUserRelation),
            ...getSortingParams(sort),
            page: currPageNo
        }
        
        axiosInstance(CONTENT_TYPE_URL[contentType], {params: params})
        .then(response => {
            setCurrPageNo((prev) => prev+1);
            setContent(prev => [...prev, ...response.data.results]);
        })
        .catch(error => {
            setNoMoreResults(true); //TODO: redo later
            setCurrPageNo(prev => -1); //TODO: Check if prev is even required
        });
    }, [username, topicName, contentType, setCurrPageNo, currPageNo, setContent, loggedInUserRelation, sort]);

    useEffect(() => {

        const options = {
            root: scrollableParent, //Documentation: If the ContentList is placed inside of a scrollable Parent, pass it as a prop to ContentList
            rootMargin: '0px',
            threshold: 1
        }
        const loadingRefIconCurrent = loadingIconRef.current;
        if (loadingRefIconCurrent) {
            observer.current = new IntersectionObserver(getContent, options);
            observer.current.observe(loadingRefIconCurrent);
        }
        
        return () => {
            if (observer.current && loadingRefIconCurrent) {
                observer.current.unobserve(loadingRefIconCurrent);
            }
        }
    }, [scrollableParent, getContent]);
    
    return ( 
        <div className="content-list">
            {content.map(content => (
                <div className="content-item" key={content.post_type ? `p${content.id}` : `c${content.id}`}>
                    {!content.post_type && <CommentPreview comment={content}/>}
                    {content.post_type && <Post isPreview postData={content} />}
                </div>
            ))}
            {noMoreResults && content.length === 0 && <p className='no-content-message'>Nothing To See Here</p>} {/*TODO: redo later*/}
            {(currPageNo > 0) && <div className="loading-icon" ref={loadingIconRef}></div>}
        </div>
     );
}
 
export default ContentList;