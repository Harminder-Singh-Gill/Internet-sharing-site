import { useEffect, useState } from "react";
import './ImageGallery.css';

const ImageGallery = (props) => {
    const [current, setCurrent] = useState(null);
    const [isModePreview, setIsModePreview] = useState(false);

    useEffect(() => {
        if (props.images && props.images.length > 0) {
            setCurrent(0);
        }
    }, [props.images]);

    const goToImage = (index) => {
        setIsModePreview(false);
        setCurrent(index);
    }
    return ( 
        <div className="image-gallery">
            {isModePreview && props.images.length > 1 && (
                <div className="preview-div">
                    {props.images.map((image, idx) => (
                        <button className="preview-img-btn" onClick={e => goToImage(idx)}>
                            <img src={props.baseUrl + image} alt='' className="preview-img" key={idx}></img>
                        </button>
                    ))}
                </div>
            )}
            {!isModePreview && (<>
                <img className="current-img" alt='' src={props.baseUrl + props.images[current]}></img>
                {current > 0 && (
                    <button className="left-btn nav-btn" onClick={(e) => {setCurrent(current-1)}}>
                        <svg className="left-btn-svg nav-icon" xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24"><path d="M16.67 0l2.83 2.829-9.339 9.175 9.339 9.167-2.83 2.829-12.17-11.996z"/></svg>
                    </button>
                )}
                {current < props.images.length-1 && (
                    <button className="right-btn nav-btn" onClick={(e) => {setCurrent(current+1)}}>
                        <svg className="right-btn-svg nav-icon" xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24"><path d="M7.33 24l-2.83-2.829 9.339-9.175-9.339-9.167 2.83-2.829 12.17 11.996z"/></svg>
                    </button>
                )}
                {current !== null && props.images.length > 1 && (
                    <span className="img-count">{current+1}/{props.images.length}</span>
                )}
            </>)}
            {props.images.length > 1 && (
                <button className="preview-btn" onClick={(e) => setIsModePreview(!isModePreview)}>
                    <svg className="preview-svg" xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24"><path d="M11 11h-11v-11h11v11zm13 0h-11v-11h11v11zm-13 13h-11v-11h11v11zm13 0h-11v-11h11v11z"/></svg>
                </button>
            )}
        </div>
     );
}
 
export default ImageGallery;