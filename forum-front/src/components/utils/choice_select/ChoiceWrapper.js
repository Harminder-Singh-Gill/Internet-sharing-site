import { createContext, useCallback, useEffect, useState } from "react";

export const SelectedChoiceContext = createContext();

const ChoiceWrapper = ({children, onChange, defaultChoice}) => {
    const [selectedChoice, setSelectedChoice] = useState(null);
    
    useEffect(() => {
        setSelectedChoice(defaultChoice);
    }, [defaultChoice, setSelectedChoice]);

    const handleChoiceSelect = useCallback((sort) => {
        setSelectedChoice(sort);
        onChange && onChange(sort);
    }, [setSelectedChoice, onChange]);

    return ( 
        <SelectedChoiceContext.Provider value = {[selectedChoice, handleChoiceSelect]}>
            {children}
        </SelectedChoiceContext.Provider>
     );
}
 
export default ChoiceWrapper;