import { useState } from "react";
import MenuOptions from "./MainMenuOptions";

const MiniMainMenu = ({user}) => {
    const [isActive, setIsActive] = useState(false);

    return ( 
        <div className="sm-main-menu">
            <div onClick={() => setIsActive(!isActive)} className="sm-main-menu-select">
                {user && <img alt="PI"></img>}
                {!user && <img alt="DD"></img>}
            </div>
            {isActive && <MenuOptions user={user}/>}
        </div>
     );
}
 
export default MiniMainMenu;