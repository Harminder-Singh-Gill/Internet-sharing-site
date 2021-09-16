import { useCallback, useState } from "react";
import Choice from "components/utils/choice_select/Choice";
import ChoiceWrapper from "components/utils/choice_select/ChoiceWrapper";
import './UserContentMenu.css';

export const USER_CONTENT_OPTIONS = {
    overview: 'overview',
    posts: 'posts',
    comments: 'comments',
    saved: 'saved',
    upvoted: 'upvoted',
    downvoted: 'downvoted',
    hidden: 'hidden',
}

export const USER_RELATED_CONTENT_OPTIONS = {
    saved: 'saved',
    upvoted: 'upvoted',
    downvoted: 'downvoted',
    hidden: 'hidden',
    followed: 'followed'
}

const isOptionSafe = (contentOption) => {
    return !Object.values(USER_RELATED_CONTENT_OPTIONS).includes(contentOption);
}

const getValidOption = (contentOption, isUserPermitted) => {
    if (isOptionSafe(contentOption)) {return contentOption;}

    if (isUserPermitted) {return contentOption; }

    return USER_CONTENT_OPTIONS.overview;
}

const UserContentMenu = ({defaultOption, onChange, isUserPermitted}) => {
    const [selectedOption, setSelectedOption] = useState(getValidOption(defaultOption, isUserPermitted));
    const validDefaultOption = getValidOption(defaultOption, isUserPermitted);
    
    // useEffect(() => {
    //     onChange && onChange(selectedOption);
    // }, [selectedOption, onChange]);

    // useEffect(() => {
    //     const validOption = getValidOption(defaultOption, isUserPermitted)
    //     setSelectedOption(validOption);
    // }, [defaultOption, isUserPermitted]);

    const handleContentOptionChange = useCallback((contentOption) => {
        setSelectedOption(contentOption);
        onChange && onChange(contentOption);
    }, [setSelectedOption, onChange]);

    return ( 
        <div className="user-content-menu">
            <ChoiceWrapper onChange={handleContentOptionChange} defaultChoice={validDefaultOption}>
                <Choice className="user-content-option" value={USER_CONTENT_OPTIONS.overview}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path d="M15 12c0 1.657-1.343 3-3 3s-3-1.343-3-3c0-.199.02-.393.057-.581 1.474.541 2.927-.882 2.405-2.371.174-.03.354-.048.538-.048 1.657 0 3 1.344 3 3zm-2.985-7c-7.569 0-12.015 6.551-12.015 6.551s4.835 7.449 12.015 7.449c7.733 0 11.985-7.449 11.985-7.449s-4.291-6.551-11.985-6.551zm-.015 12c-2.761 0-5-2.238-5-5 0-2.761 2.239-5 5-5 2.762 0 5 2.239 5 5 0 2.762-2.238 5-5 5z"/></svg>
                    <p>Overview</p>
                </Choice>
                <Choice className="user-content-option" value={USER_CONTENT_OPTIONS.posts}>
                    <svg xmlns="http://www.w3.org/2000/svg" enableBackground="new 0 0 24 24" height="20px" viewBox="0 0 24 24" width="20px"><g><rect fill="none" height="24" width="24"/><g><path d="M19,5v14H5V5H19 M19,3H5C3.9,3,3,3.9,3,5v14c0,1.1,0.9,2,2,2h14c1.1,0,2-0.9,2-2V5C21,3.9,20.1,3,19,3L19,3z"/></g><path d="M14,17H7v-2h7V17z M17,13H7v-2h10V13z M17,9H7V7h10V9z"/></g></svg>
                    <p>Posts</p>
                </Choice>
                <Choice className="user-content-option" value={USER_CONTENT_OPTIONS.comments} >
                    <svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 0 24 24" width="20" fill="#000000"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M21.99 4c0-1.1-.89-2-1.99-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4-.01-18zM20 4v13.17L18.83 16H4V4h16zM6 12h12v2H6zm0-3h12v2H6zm0-3h12v2H6z"/></svg>
                    <p>Comments</p>
                </Choice>
                {isUserPermitted && (<>
                    <Choice className="user-content-option" value={USER_CONTENT_OPTIONS.saved} >
                        <svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 0 24 24" width="20"  fill="#000000"><path d="M17 3H7c-1.1 0-1.99.9-1.99 2L5 21l7-3 7 3V5c0-1.1-.9-2-2-2z"/></svg>
                        <p>Saved</p>
                    </Choice>
                    <Choice className="user-content-option" value={USER_CONTENT_OPTIONS.upvoted} >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path d="M0 12c0 6.627 5.373 12 12 12s12-5.373 12-12-5.373-12-12-12-12 5.373-12 12zm18-1h-4v7h-4v-7h-4l6-6 6 6z"/></svg>
                        <p>Upvoted</p>
                    </Choice>
                    <Choice className="user-content-option" value={USER_CONTENT_OPTIONS.downvoted} >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path d="M24 12c0-6.627-5.373-12-12-12s-12 5.373-12 12 5.373 12 12 12 12-5.373 12-12zm-18 1h4v-7h4v7h4l-6 6-6-6z"/></svg>
                        <p>Downvoted</p>
                    </Choice>
                    <Choice className="user-content-option" value={USER_CONTENT_OPTIONS.hidden} >
                        <svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 0 24 24" width="20" fill="#000000"><g><path d="M2.81,2.81L1.39,4.22l2.27,2.27C2.61,8.07,2,9.96,2,12c0,5.52,4.48,10,10,10c2.04,0,3.93-0.61,5.51-1.66l2.27,2.27 l1.41-1.41L2.81,2.81z M12,20c-4.41,0-8-3.59-8-8c0-1.48,0.41-2.86,1.12-4.06l10.94,10.94C14.86,19.59,13.48,20,12,20z M7.94,5.12 L6.49,3.66C8.07,2.61,9.96,2,12,2c5.52,0,10,4.48,10,10c0,2.04-0.61,3.93-1.66,5.51l-1.46-1.46C19.59,14.86,20,13.48,20,12 c0-4.41-3.59-8-8-8C10.52,4,9.14,4.41,7.94,5.12z"/></g></svg>
                        <p>Hidden</p>
                    </Choice>
                </>)}
            </ChoiceWrapper>
        </div>
     );
}
 
export default UserContentMenu;