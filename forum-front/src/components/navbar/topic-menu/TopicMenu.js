import { useEffect, useRef, useState } from "react";
import TopicMenuOptions from './TopicMenuOptions';
import './TopicMenu.css'
import axiosInstance, { baseURL } from "axiosInstance";
import axios from "axios";
import ClickNotifier from 'components/utils/click_notifier/ClickNotifier';
import { getImgUrl } from "baseUrls";

export const SUPER_TOPICS = {
    frontpage: {
        name: 'Frontpage',
        icon: getImgUrl('home_icon.svg')
    },
    all: {
        name: 'All',
        icon: getImgUrl('infinity_icon.svg')
    }
}

const TopicMenu = ({user, pageInfo}) => {
    const [currentPage, setCurrentPage] = useState(null);
    const [isActive, setIsActive] = useState(false);
    const [userTopics, setUserTopics] = useState([]);
    const selectButtonRef = useRef();

    useEffect(() => {
        if (!user) {return;}
        
        const source = axios.CancelToken.source();

        axiosInstance('topics/?followers__username=' + user.username, { cancelToken: source.token })
        .then(response => setUserTopics(response.data))
        .catch(error => {}) // In the event that the request is cancelled by source.cancel()
        
        return () => source.cancel();
    }, [user, setUserTopics]);

    useEffect(() => {
        switch(pageInfo.type) {
            case 'superTopic':
                setCurrentPage({
                    name: SUPER_TOPICS[pageInfo.of].name,
                    icon: SUPER_TOPICS[pageInfo.of].icon
                })
                return;
            case 'topic':
                axiosInstance('topics/' + pageInfo.of)
                .then(response => {
                    setCurrentPage({
                        name: 't/' + response.data.name,
                        icon: response.data.icon? response.data.icon : getImgUrl('default_topic_icon.jpg')
                    })
                })
                return;
            case 'user':
                axiosInstance('users/' + pageInfo.of)
                .then(response => {
                    setCurrentPage({
                        name: 'u/' + response.data.username,
                        icon: response.data.profile_pic
                    })
                })
                return;
            default: 
                setCurrentPage({
                    name: pageInfo.type,
                    icon: pageInfo.icon
                })
        }
    }, [pageInfo]);
    
    return (
        <div className="topic-menu">
            <button className="topic-menu-select" ref={selectButtonRef} onClick={() => setIsActive(prev => !prev)}>
                {currentPage && (<>
                        <img className={(pageInfo.type === 'superTopic'? 'super-topic-icon' : "topic-icon-selected")} src={currentPage.icon} alt=""></img>
                        <div className="topic-name-selected ">{currentPage.name}</div>
                </>)}
            </button>
            {isActive && (
                <ClickNotifier exclude={selectButtonRef} onClickOutside={(e) => setIsActive(false)} onClickInside = {(e) => setIsActive(true)}>
                    <TopicMenuOptions userTopics={userTopics} onItemSelect = {(itemName) => setIsActive(false)} />
                </ClickNotifier>
            )}
        </div>
    );
}
 
export default TopicMenu;