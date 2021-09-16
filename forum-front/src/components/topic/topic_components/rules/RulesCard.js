import Rule from "./Rule";
import './RulesCard.css';

const RulesCard = ({topic}) => {
    return topic.rules && (topic.rules.length > 0) && (
        <div className="rules-card">
            <header className="title-header" >Rules of t/{topic.name}</header>
            <main className="rules">
                {topic.rules.map(rule => (
                    <Rule rule={rule} key={rule.id}/>
                ))}
            </main>
        </div>
     );
}
 
export default RulesCard;