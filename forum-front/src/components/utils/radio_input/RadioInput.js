import Choice from "../choice_select/Choice";
import ChoiceWrapper from "../choice_select/ChoiceWrapper";
import './RadioInput.css';
const RadioInput = ({children, defaultValue, onChange}) => {
    let childrenArray = [];
    if (children) childrenArray = Array.isArray(children) ? children : [children];

    return (
        <div className="radio-input">
            <ChoiceWrapper defaultChoice={defaultValue} onChange={onChange}>
                {childrenArray.map(radioOption =>
                    <Choice className="radio-option" value={radioOption.props.value} key={radioOption.key}>
                        <div className="radio-button-icon"></div>
                        <div className="radio-text">{radioOption}</div>
                    </Choice>
                )}
            </ChoiceWrapper>
        </div>
     );
}
 
export default RadioInput;