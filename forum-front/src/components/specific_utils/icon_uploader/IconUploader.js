import InputFileButton from 'components/utils/InputFileButton';
import { useEffect, useState, useRef } from 'react';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import './IconUploader.css';

const IconUploader = ({src, onCancel, onSave}) => {
    const [isCropAreaEmpty, setIsCropAreaEmpty] = useState(false);
    const [croppedImageUrl, setCroppedImageUrl] = useState();
    const [newSrc, setNewSrc] = useState();
    const imageFile = useRef();

    const [crop, setCrop] = useState({
        unit: '%',
        width: 50,
        x: 25,
        aspect: 1,
    });

    const imageRef = useRef();
    const fileUrl = useRef();

    const onImageLoaded = image => {
        imageRef.current = image;
    }

    const onCropComplete = crop => {
        makeClientCrop(crop);
    }

    const onCropChange = (crop, percentCrop) => {
        setCrop(percentCrop);
    }

    async function makeClientCrop(crop) {
        if (!(imageRef.current && crop.width && crop.height)) return;
        // getCroppedImg(imageRef.current, crop, 'newFile.jpeg').then(croppedImageUrl => {
        //     setCroppedImageUrl(croppedImageUrl);
        //     setIsCropAreaEmpty(false);
        // })
        // .catch(error => setIsCropAreaEmpty(true));
        try {
            const croppedImageUrl = await getCroppedImg(imageRef.current, crop, 'newFile.jpeg');
            setCroppedImageUrl(croppedImageUrl);
            setIsCropAreaEmpty(false);
        } catch {
            setIsCropAreaEmpty(true);
        }
    }
    
    /**
     * @param {HTMLImageElement} image - Image File Object
     * @param {Object} crop - crop Object
     * @param {String} fileName - Name of the returned file in Promise
     */
    function getCroppedImg(image, crop, fileName) {
        const canvas = document.createElement('canvas');
        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;
        canvas.width = crop.width;
        canvas.height = crop.height;
        const ctx = canvas.getContext('2d');

        ctx.drawImage(
            image,
            crop.x * scaleX,
            crop.y * scaleY,
            crop.width * scaleX,
            crop.height * scaleY,
            0,
            0,
            crop.width,
            crop.height
        );

        return new Promise((resolve, reject) => {
            console.log("What");
            
            canvas.toBlob(blob => {
                if (!blob) {
                    reject(new Error('Canvas is empty'));
                    console.error('Canvas is empty');
                    return;
                }
                blob.name = fileName;
                window.URL.revokeObjectURL(fileUrl.current);
                fileUrl.current = window.URL.createObjectURL(blob);
                resolve(fileUrl.current);
                imageFile.current = blob;
            }, 'image/jpeg');
        });
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
        <div className="icon-uploader">
            <header >
                <p className="title">Image Upload</p>
                <div className="buttons">
                    <InputFileButton className="change-img-btn btn round-btn" accept="image/*" onChange={onSelectFile}>Choose...</InputFileButton>
                    <button className="save-btn btn round-btn" onClick={handleSave}>Save</button>
                    <button onClick={onCancel} className="cancel-btn btn round-btn">Cancel</button>
                </div>
            </header>
            <main>
                {croppedImageUrl && <img src={croppedImageUrl} alt="" className="image-preview"></img>}
                {src && <div className="react-crop-div">
                    <ReactCrop
                    className="main-img"
                    src={newSrc ? newSrc : src}
                    crop={crop}
                    ruleOfThirds
                    onChange={onCropChange}
                    onComplete={onCropComplete}
                    onImageLoaded={onImageLoaded}
                    />
                </div>}
            </main>
        </div>
     );
}

export default IconUploader