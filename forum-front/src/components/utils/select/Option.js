import { useContext, useEffect } from "react";
import { OptionSelectContext } from "./Select";
import './Option.css';

const optionStyle = {
    padding: '0.5em 1em',
    flex: '1',
    backgroundColor: 'transparent',
    border: 'none',
    textAlign: 'left',
    whiteSpace: 'nowrap'
}

const Option = ({value, className, children}) => {
    const {handleOptionSelect, defaultValue, setSelectedOptionChildren} = useContext(OptionSelectContext);

    useEffect(() => {
        if (defaultValue !== value) {return}
        setSelectedOptionChildren(children);
    }, [defaultValue, children, setSelectedOptionChildren, value]);

    const optionSelect = (e) => {
        handleOptionSelect(value);
        setSelectedOptionChildren(children);
    }

    return ( 
        <button type="button" style={optionStyle} onClick={optionSelect} className={"option " + (className || "")}>
            {children}
        </button>
     );
}
 
export default Option;