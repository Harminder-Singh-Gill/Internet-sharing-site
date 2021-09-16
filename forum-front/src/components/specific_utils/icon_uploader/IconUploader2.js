import { useState } from "react";
import ImageUploader from "./ImageUploader";
import './IconUploader2.css';

const IconUploader = ({src, onCancel, onSave}) => {
    const [croppedImageUrl, setCroppedImageUrl] = useState();

    const onCroppedImageGenerated = (imageUrl, imageBlob) => {
        setCroppedImageUrl(imageUrl);
    }
    
    return ( 
        <ImageUploader src={src} onChange={onCroppedImageGenerated} onCancel={onCancel} onSave={onSave}>
            {croppedImageUrl && <img src={croppedImageUrl} className="image-preview" alt=""></img>}
        </ImageUploader>
     );
}
 
export default IconUploader;