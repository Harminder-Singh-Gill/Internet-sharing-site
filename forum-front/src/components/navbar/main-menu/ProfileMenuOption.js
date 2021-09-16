import { useCallback, useState } from "react";
import { useHistory } from "react-router-dom";
import './ProfileMenuOption.css';

const ProfileMenuOption = ({user, onOptionSelect}) => {
    const [isActive, setIsActive] = useState(false);
    const history = useHistory();

    const goToUserPage = useCallback((pageType) => {
        onOptionSelect && onOptionSelect(pageType);
        history.push(`/user/${user.username}/${pageType}`);
    },[user, history, onOptionSelect]);


    return ( 
        <div className="profile-menu-option">
            <div className="main-profile-option">
                <button onClick={() => goToUserPage('')} className="profile-link">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm7.753 18.305c-.261-.586-.789-.991-1.871-1.241-2.293-.529-4.428-.993-3.393-2.945 3.145-5.942.833-9.119-2.489-9.119-3.388 0-5.644 3.299-2.489 9.119 1.066 1.964-1.148 2.427-3.393 2.945-1.084.25-1.608.658-1.867 1.246-1.405-1.723-2.251-3.919-2.251-6.31 0-5.514 4.486-10 10-10s10 4.486 10 10c0 2.389-.845 4.583-2.247 6.305z"/></svg>
                    <div>Profile</div>
                </button>
                <button className="profile-option-btn" onClick={(e) => setIsActive(prev => !prev)}>
                    {!isActive && <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24"><path d="M0 7.33l2.829-2.83 9.175 9.339 9.167-9.339 2.829 2.83-11.996 12.17z"/></svg>}
                    {isActive && <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24"><path d="M0 16.67l2.829 2.83 9.175-9.339 9.167 9.339 2.829-2.83-11.996-12.17z"/></svg>}
                </button>
            </div>
            {isActive &&
                <div className="profile-options">
                    <button className="profile-option" onClick={() => goToUserPage('posts')} >Posts</button>
                    <button className="profile-option" onClick={() => goToUserPage('comments')} >Comments</button>
                    <button className="profile-option" onClick={() => goToUserPage('saved')} >Saved</button>
                    <button className="profile-option" onClick={() => goToUserPage('upvoted')} >Upvoted</button>
                    <button className="profile-option" onClick={() => goToUserPage('downvoted')} >Downvoted</button>
                    <button className="profile-option" onClick={() => goToUserPage('hidden')} >Hidden</button>
                </div>
            }
        </div>
     );
}
 
export default ProfileMenuOption;