import { Link } from "react-router-dom";

const LinkOptional = ({isActive, to, children}) => {
    const active = ( 
        <Link to={to}>
            {children}
        </Link>
    );
    return isActive ? active : children;
}
 
export default LinkOptional;