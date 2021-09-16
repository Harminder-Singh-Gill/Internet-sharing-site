import { useEffect, useState, useRef } from "react";
import ReactCrop from "react-image-crop";
import 'react-image-crop/dist/ReactCrop.css';

const Cropper = ({src, onCroppedImageGenerated, initialCrop}) => {
    const [crop, setCrop] = useState(initialCrop);
    
    useEffect(() => {
        setCrop(initialCrop);
    }, [setCrop, initialCrop]);

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
        getCroppedImg(imageRef.current, crop, 'newFile.jpeg');
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

        canvas.toBlob(blob => {
            if (!blob) {
                console.error('Canvas is empty');
                return;
            }
            blob.name = fileName;
            window.URL.revokeObjectURL(fileUrl.current);
            fileUrl.current = window.URL.createObjectURL(blob);
            onCroppedImageGenerated(fileUrl.current, blob);
        }, 'image/jpeg');
    }
    
    return ( 
        <ReactCrop
        src={src}
        crop={crop}
        ruleOfThirds
        onChange={onCropChange}
        onComplete={onCropComplete}
        onImageLoaded={onImageLoaded}
        />
     );
}
 
export default Cropper;