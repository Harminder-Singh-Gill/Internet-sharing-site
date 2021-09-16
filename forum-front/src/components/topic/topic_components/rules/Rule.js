import { useState } from "react";
import './Rule.css';

const Rule = ({rule}) => {
    const [isExpanded, setIsExpanded] = useState(false);

    return ( 
        <article className="rule" onClick={() => rule.description && setIsExpanded(prev => !prev)}>
            <div className="rule-expander">
                <div className="rule-no">{rule.no}.</div>
                <div className="rule-title">{rule.title}</div>
                {(!isExpanded && rule.description) && <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"><path d="M0 7.33l2.829-2.83 9.175 9.339 9.167-9.339 2.829 2.83-11.996 12.17z"/></svg>}
                {isExpanded && <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"><path d="M0 16.67l2.829 2.83 9.175-9.339 9.167 9.339 2.829-2.83-11.996-12.17z"/></svg>}
            </div>
            {isExpanded && <div className="rule-description">{rule.description}</div>}
        </article>
     );
}
 
export default Rule;