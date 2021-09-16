import { useContext } from "react";
import { LoginRequiredContext } from "App";
import {votePost} from './content_type_settings';

const DownvoteButton = (props) => {
    const loginRequired = useContext(LoginRequiredContext);
    
    const downvoteClickHandle = loginRequired((e) => {
        votePost('downvote', props.contentId, props.contentType, (vote) => {
            if (props.onVote) {
                props.onVote(vote);
            }
        });
    })
    
    return ( 
        <button className={props.className} onClick={downvoteClickHandle}>
            {props.children}
        </button>
     );
}
 
export default DownvoteButton;