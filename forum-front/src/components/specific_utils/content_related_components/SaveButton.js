import { useContext } from "react";
import { LoginRequiredContext } from "App";
import {toggleSave} from './content_type_settings';

const SaveButton = (props) => {
    const loginRequired = useContext(LoginRequiredContext);

    const handleToggleSave = loginRequired((e) => {
        toggleSave(props.contentId, props.contentType, (isSaved) => {
            if (props.onToggleSave) {
                props.onToggleSave(isSaved);
            }
        })
    }); 

    return ( 
        <button className={props.className} onClick={handleToggleSave}>
            {props.children}
        </button>
     );
}
 
export default SaveButton;