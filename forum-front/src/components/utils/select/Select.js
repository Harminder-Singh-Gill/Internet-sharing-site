import { createContext, useCallback, useEffect, useRef, useState } from "react";
import ClickNotifier from "../click_notifier/ClickNotifier";

export const OptionSelectContext = createContext();

const selectStyle = {
    display: 'inline-block',
    position: 'relative',
}

const Select = ({defaultValue, children, className, selectedClassName, optionsClassName, onChange}) => {
    const [value, setValue] = useState(null);
    const [selectedOptionChildren, setSelectedOptionChildren] = useState(null);
    const [isActive, setIsActive] = useState(false);
    const [selectedOptionWidth, setSelectedOptionWidth] = useState(0);
    const selectedOptionRef = useRef();

    const optionsStyle = {
        display: 'inline-flex',
        flexDirection: 'column',
        backgroundColor: 'white',
        marginTop: '5px',
        boxShadow: `0 0 0 1px ${isActive ? 'gray' : 'transparent'}`,
        height: isActive ? 'auto' : '0px',
        overflow: 'hidden',
        position: 'absolute',
        top: '100%',
        left: '0',
        width: '100%',
    }

    const selectedOptionStyle = {
        padding: '0.5em 1em',
        width: `${selectedOptionWidth}px`,
        boxShadow: '0 0 0 1px gray',
        backgroundColor: 'white',
        border: 'none',
        textAlign: 'left',
        // width: '100%',
    }

    const optionsRef = useCallback((node) => {
        if (node !== null) {
            setSelectedOptionWidth(node.getBoundingClientRect().width);
        }
    }, []);

    useEffect(() => {
        setValue(defaultValue);
    }, [defaultValue, setValue]);

    const handleOptionSelect = (value, optionChildren) => {
        setValue(value);
        setSelectedOptionChildren(optionChildren);
        onChange && onChange(value);
        setIsActive(false);
    }

    return (
        <div style={selectStyle} className={"select " + (className || "")}>
            <button type="button" className={"selected-option " + (selectedClassName || "")} ref={selectedOptionRef} style={selectedOptionStyle} onClick={() => setIsActive(prev => !prev)}>
                {selectedOptionChildren}
            </button>
            <ClickNotifier exclude={selectedOptionRef} onClickOutside={() => setIsActive(false)}>
                <div style={optionsStyle} ref={optionsRef} className={"options " + (optionsClassName || "")}>
                    <OptionSelectContext.Provider value={{handleOptionSelect, defaultValue, setSelectedOptionChildren}}>
                        {children}
                    </OptionSelectContext.Provider>
                </div>
            </ClickNotifier>
        </div>
     );
}
 
export default Select;