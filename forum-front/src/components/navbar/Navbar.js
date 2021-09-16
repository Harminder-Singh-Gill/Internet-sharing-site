import TopicMenu from "./topic-menu/TopicMenu";
import MainMenu from "./main-menu/MainMenu";
import MiniMainMenu from "./main-menu/MiniMainMenu";
import SearchBar from "./searchbar/SearchBar";
import './Navbar.css';
import { Link } from "react-router-dom";
import { useContext } from "react";
import { OpenLoginSignupPageContext } from "App";
import { baseURL } from "axiosInstance";
import { getImgUrl } from "baseUrls";

const Navbar = ({user, pageInfo}) => {
    const openLoginSignupPage = useContext(OpenLoginSignupPageContext);

    return ( 
        <nav className="navbar">
            <Link to='/' className="logo-section">
                <img alt="" className="logo-img" src={getImgUrl('logo.png')}></img>
                <p className="website-name">Topick</p>
            </Link>
            <div className="topic-menu-section">
                {user &&  <TopicMenu user={user} pageInfo={pageInfo} />}
            </div>
            <div className="searchbar-section">
                <SearchBar />
            </div>
            
            <div className="profile-section">
                {!user && <> 
                <button className="login-btn" onClick={() => openLoginSignupPage('login')}>Log In</button>
                <button className="signup-btn" onClick={() => openLoginSignupPage('signup')}>Sign Up</button>
                </>}
                {user && <>
                <Link className="create-post-link" to="/post/create" title="Create a Post">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M12 2c5.514 0 10 4.486 10 10s-4.486 10-10 10-10-4.486-10-10 4.486-10 10-10zm0-2c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-3.994 12.964l3.106 3.105-4.112.931 1.006-4.036zm9.994-3.764l-5.84 5.921-3.202-3.202 5.841-5.919 3.201 3.2z"/></svg>
                </Link>
                <MainMenu user={user}/>
                </>}
                <div className="sm-profile-menu-div">
                    <MiniMainMenu user={user}/>
                </div>
            </div>
        </nav>
    );
}
 
export default Navbar;