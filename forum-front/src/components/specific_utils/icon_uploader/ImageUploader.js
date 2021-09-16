import Cropper from "components/utils/Cropper";
import InputFileButton from "components/utils/InputFileButton";
import { useState, useRef } from "react";
import './ImageUploader.css';

const ImageUploader = ({src, onChange, children, onCancel, onSave}) => {
    const imageFile = useRef();
    const [newSrc, setNewSrc] = useState();

    const [initialCrop, setInitialCrop] = useState({
        unit: '%',
        width: 50,
        x: 25,
        aspect: 1,
    });

    const onCroppedImageGenerated = (imageUrl, imageBlob) => {
        imageFile.current = imageBlob;
        onChange(imageUrl, imageBlob);
    }

    const onSelectFile = (e) => {
        if (e.target.files && e.target.files.length > 0) {
          const reader = new FileReader();
          reader.addEventListener("load", () => setNewSrc(reader.result));
          reader.readAsDataURL(e.target.files[0]);
        }
    };

    const handleSave = (e) => {
        onSave(imageFile.current);
    }

    return ( 
        <div className="image-uploader">
            <header >
                <p className="title">Image Upload</p>
                <div className="buttons">
                    <InputFileButton className="change-img-btn btn round-btn" accept="image/*" onChange={onSelectFile}>Choose...</InputFileButton>
                    <button className="save-btn btn round-btn" onClick={handleSave}>Save</button>
                    <button onClick={onCancel} className="cancel-btn btn round-btn">Cancel</button>
                </div>
            </header>
            <main>
                {children}
                {src && <div className="crop-div">
                    <Cropper initialCrop={initialCrop} src={newSrc ? newSrc : src} onCroppedImageGenerated={onCroppedImageGenerated} />
                </div>}
            </main>
        </div>
     );
}
 
export default ImageUploader;