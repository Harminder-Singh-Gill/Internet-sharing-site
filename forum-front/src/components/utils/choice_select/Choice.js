import { useContext } from "react";
import {SelectedChoiceContext} from './ChoiceWrapper';

const Choice = ({value, children, className}) => {
    const [selectedChoice, handleChoiceSelect] = useContext(SelectedChoiceContext);
    
    return (
        <button type="button" onClick={() => handleChoiceSelect(value)} className={"choice " + className + " " + (selectedChoice === value ? 'selected' : '')}>
            {children}
        </button>
     );
}
 
export default Choice;