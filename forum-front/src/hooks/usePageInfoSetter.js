import { useContext, useEffect } from "react";
import { PageInfoSetterContext } from "../App";

const usePageInfoSetter = ({topicName, username, otherType, otherTypeIcon, superTopicName,}) => {
    const setPageInfo = useContext(PageInfoSetterContext);

    useEffect(() => {
        if (topicName) {
            setPageInfo({ type: 'topic', of: topicName });
        } else if (username) {
            setPageInfo({ type: 'user', of: username });
        } else if (superTopicName) {
            setPageInfo({ type: 'superTopic', of: superTopicName });
        } else if (otherType) {
            setPageInfo({ type: otherType, of: null, icon: otherTypeIcon  });
        } else {
            setPageInfo({ type: null, of: null});
        }
    }, [topicName, username, otherType, otherTypeIcon, superTopicName, setPageInfo]);
}
 
export default usePageInfoSetter;