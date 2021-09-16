import { logout } from '../../../logout';
import ProfileMenuOption from './ProfileMenuOption';
import './MainMenuOptions.css';
import { useCallback } from 'react';
import { useHistory } from 'react-router';

const MainMenuOptions = ({user, onOptionSelect}) => {
    const history = useHistory();

    const goToDeleteAccountPage = useCallback(() => {
        onOptionSelect && onOptionSelect();
        history.push('/');
    }, [onOptionSelect, history]);

    return (
        <div className="profile-menu-options">
            {user && <>
            <ProfileMenuOption onOptionSelect={onOptionSelect} user={user} ></ProfileMenuOption>
            <button onClick={goToDeleteAccountPage} className="main-menu-option">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm6 13h-12v-2h12v2z"/></svg>
                <div>Delete Account</div>
            </button>
            <button onClick={logout} className="main-menu-option">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path d="M10 9.408l2.963 2.592-2.963 2.592v-1.592h-8v-2h8v-1.592zm-2-4.408v4h-8v6h8v4l8-7-8-7zm6-3c-1.787 0-3.46.474-4.911 1.295l.228.2 1.396 1.221c1.004-.456 2.114-.716 3.287-.716 4.411 0 8 3.589 8 8s-3.589 8-8 8c-1.173 0-2.283-.26-3.288-.715l-1.396 1.221-.228.2c1.452.82 3.125 1.294 4.912 1.294 5.522 0 10-4.477 10-10s-4.478-10-10-10z"/></svg>
                <div>Log Out</div>
            </button>
            </>}
            {!user && <>
            <button className="main-menu-option">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm6 13h-12v-2h12v2z"/></svg>
                <div>Log In</div>
            </button>
            <button className="main-menu-option">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path d="M10 9.408l2.963 2.592-2.963 2.592v-1.592h-8v-2h8v-1.592zm-2-4.408v4h-8v6h8v4l8-7-8-7zm6-3c-1.787 0-3.46.474-4.911 1.295l.228.2 1.396 1.221c1.004-.456 2.114-.716 3.287-.716 4.411 0 8 3.589 8 8s-3.589 8-8 8c-1.173 0-2.283-.26-3.288-.715l-1.396 1.221-.228.2c1.452.82 3.125 1.294 4.912 1.294 5.522 0 10-4.477 10-10s-4.478-10-10-10z"/></svg>
                <div>Sign Up</div>
            </button>
            </>}
        </div>
     );
}
 
export default MainMenuOptions;