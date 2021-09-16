import { useEffect, useState } from "react";
import './Tab.css';

const getActiveItemName = (tabItems) => {
    let activeItem = tabItems.find(tabItem => tabItem.props.default);
    if (!activeItem) {
        activeItem = tabItems.find(tabItem => !tabItem.props.disabled);
    }
    return activeItem ? activeItem.props.name : null;
}

const Tab = (props) => {
    const initialTabItems = props.children? (props.children[0]? props.children : [props.children]) : [];
    const initialActiveItemName = getActiveItemName(initialTabItems);
    const [tabItems, setTabItems] = useState(initialTabItems);
    const [activeTabItemName, setactiveTabItemName] = useState(initialActiveItemName);

    const getActiveTabItemContent = () => {
        const activeTabItem = tabItems.find(tabItem => tabItem.props.name === activeTabItemName);
        return activeTabItem ? activeTabItem.props.children : null;
    }

    useEffect(() => {
        const newTabItems = props.children? (props.children[0]? props.children : [props.children]) : [];
        setTabItems(newTabItems);
        
        setactiveTabItemName(getActiveItemName(newTabItems));
    }, [props.children]);

    return ( 
        <div className={"tab " + props.className}>
            <div className="tab-options">
                {tabItems.map((tabItem, index) => {
                    const disabled_class = tabItem.props.disabled ? 'disabled' : '';
                    const active_class = tabItem.props.name === activeTabItemName? 'active': '';
                    const classes = `tab-item ${disabled_class} ${active_class}`;
                    const clickAction = tabItem.props.disabled ? () => {} : () => setactiveTabItemName(tabItem.props.name);
                    return (
                    <div onClick={clickAction} key={index} className={classes}>
                        {tabItem.props.label}
                    </div>
                )})}
            </div>
            <div className="tab-content">
                {getActiveTabItemContent()}
            </div>
        </div>
    );
}
 
export default Tab;