import { useEffect, useRef, useState } from "react";
import './ImageField.css';

const getImages = (files, onFinish, initialImages=[]) => {
    const newImages = [...initialImages];

    if (!files || files.length === 0) {
        onFinish(newImages);
        return;
    }

    let onLoadCount = 0;
    Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
            onLoadCount++;
            newImages.push({
                file: file,
                url: e.target.result
            });
            if (onLoadCount === files.length) {
                onFinish(newImages);
            }
        }
        reader.readAsDataURL(file);
    });
}

const ImageField = (props) => {
    const [images, setImages] = useState([]);
    const [files, setFiles] = useState(null);
    const fileInputTag = useRef();

    useEffect(() => {
        // if (!props.files) {return;}
        // if (files === props.files) {return;}
        // if (files !== null && files.length === 0 && props.files.length === 0) {return;}
        
        setFiles(props.files);
    }, [props.files, setFiles]);

    useEffect(() => {
        getImages(files, (images) => {
            setImages(images);
        });
    }, [files, setImages]);

    // useEffect(() => {
    //     if (files === null) {return;}
    //     if (props.onFilesChange) {props.onFilesChange(files);}
    // }, [files, props]);

    const classes = props.className? props.className: '';

    const addFiles = (e) => {
        if (!e.target.files || e.target.files.length === 0) return;
        const newFiles = files !== null ? [...files, ...e.target.files] : [...e.target.files];
        setFiles(newFiles);
        getImages(e.target.files, (images) => {
            setImages(images);
        }, images);
        props.onFilesChange && props.onFilesChange(newFiles);
    }

    const removeFile = (fileToRemove) => {
        if (!files || files.length === 0) {return;}

        const newFiles = files.filter(file => file !== fileToRemove);
        const newImages = images.filter(image => image.file !== fileToRemove);

        setFiles(newFiles);
        setImages(newImages);
        props.onFilesChange && props.onFilesChange(newFiles);
    }

    const removeAllFiles = () => {
        setFiles([]);
        setImages([]);
        props.onFilesChange && props.onFilesChange([]);
    }

    return ( 
        <div className={"image-field " + classes} tabIndex="0">
            <input onChange={addFiles} className="img-input" onClick={e => e.target.value=''} ref={fileInputTag} type="file" multiple accept="image/*"></input>
            {images.map((image, index) => (
                <div className="img-div" key={index}>
                    <button className="remove-img-btn" type="button" onClick={(e) => removeFile(image.file)}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24"><path d="M23.954 21.03l-9.184-9.095 9.092-9.174-2.832-2.807-9.09 9.179-9.176-9.088-2.81 2.81 9.186 9.105-9.095 9.184 2.81 2.81 9.112-9.192 9.18 9.1z"/></svg>
                    </button>
                    <img src={image.url} alt=""></img>
                </div>
            ))}
            <button className="add-img-btn" type="button" onClick={() => fileInputTag.current.click()}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                    <path d="M24 10h-10v-10h-4v10h-10v4h10v10h4v-10h10z"/>
                </svg>
            </button>
        </div>
     );
}
 
export default ImageField