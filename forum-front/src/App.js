import Navbar from './components/navbar/Navbar';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import './App.css';
import {Route, Switch, useHistory} from 'react-router-dom';
import RegistrationForm from './components/authentication/RegistrationForm';
import LoginSignupModal from './components/authentication/LoginSignupModal';
import PostPage from './components/post/PostPage';
import axiosInstance from "axiosInstance";
import { setLogoutAction } from './logout';
import Topic from './components/topic/Topic';
import PostUpload from './components/post_upload/PostUpload';
import Profile from './components/user/Profile';
import SuperTopic from './components/super_topic/SuperTopic';
import TopicCreate from 'components/topic/topic_creation/TopicCreate';

export const UserContext = React.createContext();
export const UserSetterContext = React.createContext();
export const LoginRequiredContext = React.createContext();
export const ScrollTopContext = React.createContext();
export const PageInfoSetterContext = React.createContext();
export const OpenLoginSignupPageContext = React.createContext();

function App() {
    const [user, setUser] = useState(null);
    const [isLoginSignupModalVisible, setIsLoginSignupModalVisible] = useState(false);
    const [authenticationPage, setAuthenticationPage] = useState(null);
    const [pageInfo, setPageInfo] = useState({type: null, of: null});
    
    const contentRef = useRef();
    const history = useHistory();
    
    useEffect(() => {
        setLogoutAction(() => {
            setUser(null);
            scrollToTop();
            history.go(0);
        });
        getLoggedInUser();
    }, [history]);

    const getLoggedInUser = () => {
        axiosInstance
        .get('account/authenticated/user/')
        .then(response => setUser(response.data))
        .catch(error => console.log(error));
    }
    
    const openLoginSignupPage = useCallback((pageName) => {
        setAuthenticationPage(pageName);
        setIsLoginSignupModalVisible(true);
    }, [setAuthenticationPage, setIsLoginSignupModalVisible]);

    const loginRequired = useCallback((func) => {
        return (...args) => {
            if (user) { return func(...args); }
            openLoginSignupPage('login');
        }
    }, [user, openLoginSignupPage]);

    const handleLogin = (user) => {
        setUser(user);
        scrollToTop();
        history.go(0);
    }

    const scrollToTop = () => {
        contentRef.current.scrollTo(0, 0);
    }

    const handleLoginSignupModalClose = useCallback(() => {
        setAuthenticationPage(null);
        setIsLoginSignupModalVisible(false);
    }, [setAuthenticationPage, setIsLoginSignupModalVisible]);
    
    return (
        <div className="App">
            <OpenLoginSignupPageContext.Provider value={openLoginSignupPage}>
            <PageInfoSetterContext.Provider value={setPageInfo}>
            <ScrollTopContext.Provider value={scrollToTop}>
            <LoginRequiredContext.Provider value={loginRequired}>
            <UserSetterContext.Provider value={setUser} >
            <UserContext.Provider value={ user } >
                <Navbar user={user} pageInfo={ pageInfo } />
                <div ref={contentRef} className={"content " + (isLoginSignupModalVisible ? 'modal-open' : '')}>
                    {isLoginSignupModalVisible && <LoginSignupModal formType={authenticationPage} visible={isLoginSignupModalVisible} onLogin={handleLogin} onSignup={handleLogin} handleClose={handleLoginSignupModalClose}/>}
                    <Switch>
                        <Route path="/signup/">
                            <RegistrationForm />
                        </Route>
                        <Route path="/post/t/:topic_name/create/">
                            <PostUpload user={user}/>
                        </Route>
                        <Route path="/post/create/">
                            <PostUpload user={user}/>
                        </Route>
                        <Route path="/post/:id/:sort?/">
                            <PostPage />
                        </Route>
                        <Route path="/topic/create">
                            <TopicCreate />
                        </Route>
                        <Route path="/topic/:name/:sort?/:sortPeriod?/">
                            <Topic />
                        </Route>
                        <Route path="/user/:username/:contentOption/:sort?/:sortPeriod?/">
                            <Profile />
                        </Route>
                        <Route path="/user/:username/">
                            <Profile />
                        </Route>
                        <Route key='super-topic-all' path="/all/:sort?/:sortPeriod?/">
                            <SuperTopic superTopicName="all" />
                        </Route>
                        <Route key='super-topic-frontpage' path="/frontpage/:sort?/:sortPeriod?/">
                            <SuperTopic superTopicName="frontpage" />
                        </Route>
                        <Route key='super-topic-default' path="/:sort?/:sortPeriod?/">
                            <SuperTopic superTopicName={user ? "frontpage" : "all"} />
                        </Route>
                    </Switch>
                </div>
            </UserContext.Provider>
            </UserSetterContext.Provider>
            </LoginRequiredContext.Provider>
            </ScrollTopContext.Provider>
            </PageInfoSetterContext.Provider>
            </OpenLoginSignupPageContext.Provider>
        </div>
    );
}

export default App;
