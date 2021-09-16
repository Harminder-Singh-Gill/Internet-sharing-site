import { useContext, useState } from "react";
import { useHistory } from "react-router";
import {LoginRequiredContext} from '../../../App';
import axiosInstance from "axiosInstance";
import ImageField from "components/utils/form_components/ImageField";
import TextField from "../../utils/form_components/TextField";
import './PostForm.css';
import { Link } from "react-router-dom";

const PostForm = ({type, topic}) => {
    const [title, setTitle] = useState('');
    const [text, setText] = useState('');
    const [link, setLink] = useState('');
    const [files, setFiles] = useState([]);

    const loginRequired = useContext(LoginRequiredContext);

    const history = useHistory();

    const getFormData = (type) => {
        const formData = new FormData();
        formData.append('title', title);
        if (topic) {
            formData.append('topic_name', topic.name);
        }
        const post_type = type ? type : 'text';
        formData.append('post_type', post_type);
        switch(type) {
            case 'link':
                formData.append('link', link);
                break;
            case 'images':
                if (files !== null) {
                    files.forEach((file, i) => {
                        formData.append(`images[${i}]`, file);
                    });
                }
                break;
            default:
                formData.append('text', text);
        }
        return formData;
    }

    const createPost = loginRequired(() => {
        const formData = getFormData(type);
        axiosInstance
            .post('/post/posts/', formData)
            .then(response => {
                history.push(`/post/${response.data.id}/`);
            })
    });

    const formDataIsValid = () => {
        if (title === '') {return false; }
        switch(type) {
            case 'images':
                return files.length > 0;
            case 'link':
                return link !== '';
            default: 
                return text !== '';
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        createPost();
    }

    return ( 
        <form className="post-form" onSubmit={handleSubmit}>
            <div className="title-input-div input-div">
                <TextField label="TITLE" className="post-form-text-field" inputClassName="post-form-input" required value={title} placeholder="Title" onChange={e => setTitle(e.target.value)} />
            </div>
            <div className="input-section">
                {(type === "text" || !type) && (
                    <textarea value={text} placeholder="Write something here..." onChange={e =>setText(e.target.value)} className="content-textarea"></textarea>
                )}
                {type === "link"  && 
                    <div className="input-div">
                        <TextField type="url" className="post-form-text-field" inputClassName="post-form-input" required value={link} onChange={(e) => setLink(e.target.value)} placeholder="Enter a URL" />
                    </div>}
                {type === "images"  && <ImageField files={files} className="img-upload-field post-form-input" onFilesChange={files => setFiles(files)}/>}
            </div>

            <div className="post-form-buttons">
                <Link to="/" className="cancel-btn post-form-btn btn">Cancel</Link>
                <button type="submit" className="post-btn post-form-btn" disabled={!formDataIsValid()}>Post</button>
            </div>
        </form>
     );
}
 
export default PostForm;