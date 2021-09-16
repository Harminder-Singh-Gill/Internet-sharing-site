import { useRef, useState } from "react";
import MainMenuOptions from "./MainMenuOptions";
import './MainMenu.css'
import ClickNotifier from "components/utils/click_notifier/ClickNotifier";

const MainMenu = ({user}) => {
    const [isActive, setIsActive] = useState(false);
    const profileMenuSelectRef = useRef();

    return ( 
        <div className="profile-menu">
            <button onClick={() => setIsActive(prev => !prev)} ref={profileMenuSelectRef} className="profile-menu-select">
                <img alt="" className="profile-img-icon" src={user.profile_pic}></img>
                <p className="username">{user.username}</p>
                <svg className="dropdown-icon" xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24"><path d="M12 21l-12-18h24z"/></svg>
            </button>

            {isActive && 
                <div className="profile-menu-options-div card-shadow">
                    <ClickNotifier exclude={profileMenuSelectRef} onClickOutside={(e) => setIsActive(false)}>
                        <MainMenuOptions user={user} onOptionSelect={() => setIsActive(false)}/>
                    </ClickNotifier>
                </div>
            }
        </div>
     );
}
 
export default MainMenu;