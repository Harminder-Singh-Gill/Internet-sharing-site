import TopicListCard from "components/topic/topic_list_card/TopicListCard";
import UserCard from "components/user/user_card/UserCard";
import './UserSidebar.css';

const UserSidebar = ({user, className}) => {
    return ( 
        <div className={"user-sidebar " + className}>
            {user && user.moderated_topics.length > 0 && <UserCard user={user} />}
            {(user && user.moderated_topics.length > 0) && <TopicListCard label={'Moderating Topics'} topics={user.moderated_topics} />}
            <div className="user-card-sticky">
                <UserCard user={user} />
            </div>
        </div>
     );
}
 
export default UserSidebar;