import { useContext } from "react";
import { LoginRequiredContext } from "App";
import {votePost} from './content_type_settings';

const UpvoteButton = (props) => {
    const loginRequired = useContext(LoginRequiredContext)
    
    const upvoteClickHandle = loginRequired((e) => {
        votePost('upvote', props.contentId, props.contentType, (vote) => {
            if (props.onVote) {
                props.onVote(vote);
            }
        });
    })
    
    return ( 
        <button className={props.className} onClick={upvoteClickHandle} >
            {props.children}
        </button>
     );
}
 
export default UpvoteButton;