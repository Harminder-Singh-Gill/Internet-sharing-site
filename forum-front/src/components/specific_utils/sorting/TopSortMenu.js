import Choice from "components/utils/choice_select/Choice";
import './TopSortMenu.css';

export const TOP_SORT_OPTIONS = {
    top_day: 'top/day',
    top_week: 'top/week',
    top_month: 'top/month',
    top_year: 'top/year',
    top_all: 'top'
}

export const TOP_SORT_LABELS = {
    'top/day': 'Day',
    'top/week':'Week',
    'top/month': 'Month',
    'top/year': 'Year',
    'top': 'All Time'
}

const TopSortMenu = ({exclude=[]}) => {
    return ( 
        <div className="top-sort-menu" >
            {!exclude.includes(TOP_SORT_OPTIONS.top_day) && <Choice className="top-d-option top-option" value={TOP_SORT_OPTIONS.top_day} >Day</Choice>}
            {!exclude.includes(TOP_SORT_OPTIONS.top_week) && <Choice className="top-w-option top-option" value={TOP_SORT_OPTIONS.top_week} >Week</Choice>}
            {!exclude.includes(TOP_SORT_OPTIONS.top_month) && <Choice className="top-m-option top-option" value={TOP_SORT_OPTIONS.top_month} >Month</Choice>}
            {!exclude.includes(TOP_SORT_OPTIONS.top_year) && <Choice className="top-y-option top-option" value={TOP_SORT_OPTIONS.top_year} >Year</Choice>}
            {!exclude.includes(TOP_SORT_OPTIONS.top_all) && <Choice className="top-a-option top-option" value={TOP_SORT_OPTIONS.top_all} >All Time</Choice>}
        </div>
     );
}
 
export default TopSortMenu;