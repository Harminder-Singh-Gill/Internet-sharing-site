import { useContext, useState } from "react";
import ProfileMenuOptions from "../navbar/profile-menu/ProfileMenuOptions";
import {SelectedContext} from './TopicSortMenu';

const TopSortMenuItem = ({value, children, className}) => {
    const [selectedSort, setSelectedSort] = useContext(SelectedContext);

    return (
        <button onClick={() => setSelectedSort(value)} className={"top-sort-menu-item " + (className + " ") (selectedSort === value ? 'selected' : '')}>{children}</button>
     );
}
 
export default TopSortMenuItem;