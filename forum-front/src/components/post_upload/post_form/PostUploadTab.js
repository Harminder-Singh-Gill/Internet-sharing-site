import Tab from "../../utils/tab_component/Tab"
import TabItem from "../../utils/tab_component/TabItem";
import PostForm from "./PostForm";

const PostUploadTab = ({topic}) => {
    return ( 
        <Tab className="post-upload-tab darker-shadow">
            <TabItem label="Text" name="text" disabled={topic && topic.valid_post_types && !topic.valid_post_types.includes('Text')}>
                <PostForm topic={topic}/>
            </TabItem>
            <TabItem label="Link" name="link" disabled={topic && topic.valid_post_types && !topic.valid_post_types.includes('Link')}>
                <PostForm type="link" topic={topic}/>
            </TabItem>
            <TabItem label="Images" name="images" disabled={topic && topic.valid_post_types && !topic.valid_post_types.includes('Image')}>
                <PostForm type="images" topic={topic}/>
            </TabItem>
        </Tab>
    );
}
 
export default PostUploadTab;