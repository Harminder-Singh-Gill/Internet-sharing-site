import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

const DateText = ({date}) => {
    const dayJsDate = dayjs(date);

    return ( 
        <span className="date-text" type="button" title={dayJsDate.format('MMM D, YYYY [at] HH:MM a')}>{dayJsDate.fromNow()}</span>
    );
}
 
export default DateText;