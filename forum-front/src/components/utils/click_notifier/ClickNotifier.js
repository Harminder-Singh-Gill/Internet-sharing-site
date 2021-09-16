import { useEffect, useRef } from "react";
import './ClickNotifier.css';

const useClickNotifier = (ref, onClickInside, onClickOutside, exclude) => {
    useEffect(() => {
        const handleClick = (e) => {
            if (exclude?.current?.contains(e.target)) {
                return;
            }

            if (ref.current && !ref.current.contains(e.target)) {
                onClickOutside && onClickOutside(e);
            }else {
                onClickInside && onClickInside(e);
            }
        }
        document.addEventListener('mousedown', handleClick);

        return () => {
            document.removeEventListener('mousedown', handleClick);
        }
    }, [ref, onClickInside, onClickOutside, exclude]);
}

const ClickNotifier = ({onClickInside, onClickOutside, children, exclude}) => {
    const wrapperRef = useRef(null);

    useClickNotifier(wrapperRef, onClickInside, onClickOutside, exclude);

    return ( 
        <div ref={wrapperRef} className="click-notifier">{children}</div>
     );
}
 
export default ClickNotifier;