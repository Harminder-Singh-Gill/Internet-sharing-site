import { useCallback, useState } from 'react';
import Choice from 'components/utils/choice_select/Choice';
import ChoiceWrapper from 'components/utils/choice_select/ChoiceWrapper';
import TopSortMenu, { TOP_SORT_LABELS, TOP_SORT_OPTIONS } from './TopSortMenu';
import './SortMenu.css';

export const SORT_OPTIONS = {
    hot: 'hot',
    new: 'new',
    old: 'old',
    ...TOP_SORT_OPTIONS
}

const isTopSortSelected = (value) => {
    return Object.values(TOP_SORT_OPTIONS).includes(value);
}

const SortMenu = ({defaultSort, onChange, exclude=[]}) => {
    const [isTopSortMenuVisible, setIsTopSortMenuVisible] = useState(false);
    const [selectedSort, setSelectedSort] = useState(defaultSort);

    const handleSortChange = useCallback((sort) => {
        setSelectedSort(sort);
        onChange && onChange(sort);
        setIsTopSortMenuVisible(false);
    }, [onChange, setSelectedSort, setIsTopSortMenuVisible]);

    return ( 
        <div className="sort-menu">
            <ChoiceWrapper onChange={handleSortChange} defaultChoice={defaultSort}>
                {!exclude.includes(SORT_OPTIONS.hot) && <Choice className="hot-option sort-option" value={SORT_OPTIONS.hot}>
                    <svg width="20" height="20" xmlns="http://www.w3.org/2000/svg" fillRule="evenodd" viewBox="0 0 24 24" clipRule="evenodd"><path d="M8.625 0c.61 7.189-5.625 9.664-5.625 15.996 0 4.301 3.069 7.972 9 8.004 5.931.032 9-4.414 9-8.956 0-4.141-2.062-8.046-5.952-10.474.924 2.607-.306 4.988-1.501 5.808.07-3.337-1.125-8.289-4.922-10.378zm4.711 13c3.755 3.989 1.449 9-1.567 9-1.835 0-2.779-1.265-2.769-2.577.019-2.433 2.737-2.435 4.336-6.423z"/></svg>
                    <p>Hot</p>
                </Choice>}
                {!exclude.includes('top_sort') && <div className="top-option-div" >
                    <button className={"top-option-toggle sort-option " + (isTopSortSelected(selectedSort) ? 'selected': '')} onClick={() => {setIsTopSortMenuVisible(prev=>!prev)}}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path d="M7 11v13h2v-5h2v3h2v-7h2v9h2v-13h6l-11-11-11 11z"/></svg>
                        
                        <p>Top{isTopSortSelected(selectedSort) && ": " + TOP_SORT_LABELS[selectedSort]}</p>
                        
                        {isTopSortMenuVisible && <svg className="top-dropdown-icon" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"><path d="M0 16.67l2.829 2.83 9.175-9.339 9.167 9.339 2.829-2.83-11.996-12.17z"/></svg>}
                        {!isTopSortMenuVisible && <svg className="top-dropdown-icon" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"><path d="M0 7.33l2.829-2.83 9.175 9.339 9.167-9.339 2.829 2.83-11.996 12.17z"/></svg>}
                    </button>
                    {isTopSortMenuVisible && <TopSortMenu exclude={exclude} defaultSort={defaultSort} />}
                </div>}
                {!exclude.includes(SORT_OPTIONS.new) && <Choice className="new-option sort-option" value={SORT_OPTIONS.new}>
                    <svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 0 24 24" width="20" fill="#000000"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M23 12l-2.44-2.78.34-3.68-3.61-.82-1.89-3.18L12 3 8.6 1.54 6.71 4.72l-3.61.81.34 3.68L1 12l2.44 2.78-.34 3.69 3.61.82 1.89 3.18L12 21l3.4 1.46 1.89-3.18 3.61-.82-.34-3.68L23 12zm-4.51 2.11l.26 2.79-2.74.62-1.43 2.41L12 18.82l-2.58 1.11-1.43-2.41-2.74-.62.26-2.8L3.66 12l1.85-2.12-.26-2.78 2.74-.61 1.43-2.41L12 5.18l2.58-1.11 1.43 2.41 2.74.62-.26 2.79L20.34 12l-1.85 2.11zM11 15h2v2h-2zm0-8h2v6h-2z"/></svg>
                    <p>New</p>
                </Choice>}
                {!exclude.includes(SORT_OPTIONS.old) && <Choice className="old-option sort-option" value={SORT_OPTIONS.old}>
                    <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fillRule="evenodd" clipRule="evenodd"><path d="M8.625 0c.61 7.189-5.625 9.664-5.625 15.996 0 4.301 3.069 7.972 9 8.004 5.931.032 9-4.414 9-8.956 0-4.141-2.062-8.046-5.952-10.474.924 2.607-.306 4.988-1.501 5.808.07-3.337-1.125-8.289-4.922-10.378zm4.711 13c3.755 3.989 1.449 9-1.567 9-1.835 0-2.779-1.265-2.769-2.577.019-2.433 2.737-2.435 4.336-6.423z"/></svg>
                    <p>Old</p>
                </Choice>}
            </ChoiceWrapper>
        </div>
     );
}
 
export default SortMenu;