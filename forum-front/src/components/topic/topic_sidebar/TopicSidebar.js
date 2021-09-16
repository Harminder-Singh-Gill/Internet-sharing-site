import './TopicSidebar.css';
import RulesCard from 'components/topic/topic_components/rules/RulesCard';
import SidebarCard from 'components/topic/topic_components/SidebarCard';
import TopicAboutCard from 'components/topic/topic_components/TopicAboutCard';

const TopicSidebar = ({topic, followerData, className}) => {
    return topic && ( 
        <div className={"topic-sidebar " + className}>
            {(topic.rules.length > 0 || topic.sidebar_cards.lengh > 0) && <TopicAboutCard topic={topic} followerData={followerData}/>}
            {(topic.rules.length > 0) && <div className="rules-card-div">
                <RulesCard topic={topic} />
            </div>}
            {topic.sidebar_cards.map(sidebarCard => (
                <div className='sidebar-card-div'>
                    <SidebarCard sidebarCardData={sidebarCard} />
                </div>
            ))}
            <div className="topic-about-card-sticky">
                <TopicAboutCard topic={topic} followerData={followerData}/>
            </div>
        </div>
     );
}
 
export default TopicSidebar;