import axiosInstance, { cancellableAxios } from "axiosInstance";
import Option from "components/utils/select/Option";
import Select from "components/utils/select/Select";
import useAxios from "hooks/useAxios";
import { useEffect, useState } from "react";
import TextField from 'components/utils/form_components/TextField';
import RadioInput from 'components/utils/radio_input/RadioInput';
import './TopicCreate.css';
import { useHistory } from "react-router-dom";
import axios from "axios";
import usePageInfoSetter from "hooks/usePageInfoSetter";
import { getImgUrl } from "baseUrls";

const TOPIC_NAME_ERRORS = {
    invalid: "Topic name must be 1-20 characters long and may contain only alphanumeric characters and the special character '_'",
    unavailable: 'Topic already exists',
    serverError: 'Could not check if topic is available',
    valid: 'Topic name is valid'
}

const isValidTopicName = (topicName) => {
    return /(?=.{1,20}$)[a-zA-Z0-9._@+-]/.test(topicName);
}

const isTopicNameAvailable = (topicName, trueFn, falseFn, errorFn) => {
    return cancellableAxios(cancelToken => {
        axiosInstance(`topics/is_available/?topic_name=${topicName}`, {cancelToken: cancelToken})
        .then(response => {
            if (response.data.is_available) {
                trueFn();
                return;
            }
            falseFn();
        })
        .catch(error => {
            if (!axios.isCancel(error)) errorFn(error);
        });
    });
    
}

const TopicCreate = () => {
    const [topicName, setTopicName] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");
    const [access, setAccess] = useState("public");
    const [error, setError] = useState("");
    const [isSubmissionError, setIsSubmissionError] = useState(false);

    const [categories] = useAxios('/category/list');
    const history = useHistory();
    
    usePageInfoSetter({otherType: 'Create a Topic', otherTypeIcon: getImgUrl('plus_icon.svg')});

    useEffect(() => {
        
        if (topicName === "") {
            setError("");
            return;
        }
        let axiosSourceObject = null;
        if (isValidTopicName(topicName)) {
            axiosSourceObject = isTopicNameAvailable(topicName, 
                () => setError(TOPIC_NAME_ERRORS.valid),
                () => setError(TOPIC_NAME_ERRORS.unavailable),
                () => setError(TOPIC_NAME_ERRORS.serverError),
            );
        } else {
            setError(TOPIC_NAME_ERRORS.invalid);
        }

        return () => axiosSourceObject?.cancel();
    }, [topicName, setError]);

    const handleTopicNameChange = (e) => {
        setTopicName(e.target.value.trim());
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', topicName);
        formData.append('description', description);
        formData.append('category', category);
        formData.append('access', access);

        axiosInstance
            .post('topics/', formData)
            .then(response => history.push('/topic/' + response.data.name))
            .catch(error => setIsSubmissionError(true));
    }
    
    return ( 
        <div className="topic-create">
            <div className="topic-create-box darker-shadow">
                <img className="aside-design" src={getImgUrl("topic_creation_design.jpg")} alt="" />
                <main className="topic-create-main">
                    <p className="topic-create-title">Create a Topic</p>
                    <hr style={{'margin-bottom': '50px', color: 'gray'}}></hr>
                    <form onSubmit={handleSubmit} className="topic-create-form">
                        <div className="topic-name-div input-div">
                            <label>Give your topic a name</label>
                            <TextField required inputClassName="topic-name-input" className="topic-name-text-field" onChange={handleTopicNameChange} value={topicName} valid={error === TOPIC_NAME_ERRORS.valid} error={error && error !== TOPIC_NAME_ERRORS.valid} helperText={error} />
                        </div>
                        <div className="description-div input-div">
                            <label>Describe your topic</label>
                            <textarea placeholder="..." className="description-textarea" value={description} onChange={(e) => setDescription(e.target.value)} />
                        </div>
                        <div className="category-select-div input-div">
                            <label>Select a category</label>
                            <Select selectedClassName="category-selected-option" className='category-select' optionsClassName="category-options" defaultValue={category} onChange={(value) => setCategory(value)}>
                                <Option className="category-option" key="category" value="">Other</Option>
                                {categories && categories.map((category) => (
                                    <Option value={category} className="category-option" key={category}>{category}</Option>
                                ))}
                            </Select>
                        </div>
                        <div className="access-radio-div input-div">
                            <label className="access-label">Who can access your topic</label>
                            <RadioInput defaultValue={access} onChange={(value) => setAccess(value)}>
                                <div key="public" value="public" className="access-radio-option">
                                    <p className="access-radio-title">Public</p>
                                    <p className="access-radio-description">Anyone can follow and view this topic</p>
                                </div>
                                <div key="private" value="private" className="access-radio-option">
                                    <p className="access-radio-title">Private</p>
                                    <p className="access-radio-description">Only people you invite can follow and view this topic</p>
                                </div>
                                <div key="protected" value="protected" className="access-radio-option">
                                    <p className="access-radio-title">Protected</p>
                                    <p className="access-radio-description">Only people you invite can follow this topic. The topic can be viewed by all</p>
                                </div>
                            </RadioInput>
                        </div>
                        <button disabled={error !== TOPIC_NAME_ERRORS.valid} className="create-topic-button">Create Topic</button>
                    </form>
                </main>
            </div>
        </div>
    );
}
 
export default TopicCreate;