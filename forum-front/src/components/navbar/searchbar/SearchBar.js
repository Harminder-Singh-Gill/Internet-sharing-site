import {useState} from 'react';
import ClickNotifier from 'components/utils/click_notifier/ClickNotifier';
import LiveSearchResults from "./LiveSearchResults";
import './SearchBar.css';

const SearchBar = () => {
    const [isFocused, setIsFocused] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    
    return (
        <ClickNotifier onClickOutside={() => {setSearchQuery('')}}>
            <div tabIndex="0" className={"searchbar "  + (isFocused ? 'focused' : '')}>
                <form method="GET" className="searchbar-form">
                    <svg className="search-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="gray"><path d="M23.809 21.646l-6.205-6.205c1.167-1.605 1.857-3.579 1.857-5.711 0-5.365-4.365-9.73-9.731-9.73-5.365 0-9.73 4.365-9.73 9.73 0 5.366 4.365 9.73 9.73 9.73 2.034 0 3.923-.627 5.487-1.698l6.238 6.238 2.354-2.354zm-20.955-11.916c0-3.792 3.085-6.877 6.877-6.877s6.877 3.085 6.877 6.877-3.085 6.877-6.877 6.877c-3.793 0-6.877-3.085-6.877-6.877z"/></svg>
                    <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} onFocus={() => setIsFocused(true)} onBlur={() => setIsFocused(false)} type="text" placeholder="Search"></input>
                </form>
                
                <div className="live-search-results-div">
                    <LiveSearchResults searchQuery={searchQuery} onResultClick = {(result) => setSearchQuery('')}/>
                </div>
            </div>
        </ClickNotifier>
    );
}
 
export default SearchBar;